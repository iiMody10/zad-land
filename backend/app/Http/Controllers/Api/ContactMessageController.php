<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Support\ApiJson;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ContactMessageController extends Controller
{
    /**
     * Ensure the contact_messages table exists in case pending migrations haven't run on production.
     */
    protected function ensureTableExists(): void
    {
        if (Schema::hasTable('contact_messages')) {
            return;
        }

        try {
            Artisan::call('migrate', ['--force' => true]);
        } catch (\Throwable $e) {
            Log::warning('Artisan migrate failed in ContactMessageController: '.$e->getMessage());
        }

        if (! Schema::hasTable('contact_messages')) {
            try {
                Schema::create('contact_messages', function (Blueprint $table) {
                    $table->string('id', 191)->primary();
                    $table->string('name', 191);
                    $table->string('business_name', 191)->nullable();
                    $table->string('phone', 64);
                    $table->text('message');
                    $table->string('status', 32)->default('unread');
                    $table->dateTime('created_at', precision: 3)->useCurrent();
                    $table->dateTime('updated_at', precision: 3)->useCurrent();

                    $table->index(['status', 'created_at']);
                });
            } catch (\Throwable $e) {
                Log::error('Direct Schema::create failed for contact_messages: '.$e->getMessage());
            }
        }
    }

    /**
     * Store a public contact message from the storefront.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'business_name' => ['nullable', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:50'],
            'message' => ['required', 'string', 'max:3000'],
        ]);

        $this->ensureTableExists();

        try {
            $message = ContactMessage::create([
                'name' => trim($validated['name']),
                'business_name' => isset($validated['business_name']) && trim($validated['business_name']) !== '' ? trim($validated['business_name']) : null,
                'phone' => trim($validated['phone']),
                'message' => trim($validated['message']),
                'status' => 'unread',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message received successfully',
                'data' => ApiJson::camel($message),
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Failed to save contact message: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'تعذر حفظ الرسالة حالياً، يرجى المحاولة مرة أخرى أو التواصل مباشرة عبر واتساب.',
            ], 500);
        }
    }

    /**
     * Admin index: List contact messages.
     */
    public function index(Request $request)
    {
        $this->ensureTableExists();

        if (! Schema::hasTable('contact_messages')) {
            return response()->json([
                'messages' => [],
                'unreadCount' => 0,
                'totalCount' => 0,
            ]);
        }

        $status = $request->query('status');
        $query = ContactMessage::query()->orderByDesc('created_at');

        if ($status && in_array($status, ['unread', 'read', 'archived'], true)) {
            $query->where('status', $status);
        }

        $messages = $query->get();
        $unreadCount = ContactMessage::where('status', 'unread')->count();
        $totalCount = ContactMessage::count();

        return response()->json([
            'messages' => ApiJson::camel($messages),
            'unreadCount' => $unreadCount,
            'totalCount' => $totalCount,
        ]);
    }

    /**
     * Admin update status (read, unread, archived).
     */
    public function update(Request $request, string $id)
    {
        $this->ensureTableExists();
        $message = ContactMessage::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:unread,read,archived'],
        ]);

        $message->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => ApiJson::camel($message),
        ]);
    }

    /**
     * Admin delete message.
     */
    public function destroy(string $id)
    {
        $this->ensureTableExists();
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}
