<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Support\ApiJson;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
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
    }

    /**
     * Admin index: List contact messages.
     */
    public function index(Request $request)
    {
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
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}
