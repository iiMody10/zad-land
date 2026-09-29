<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $folder = preg_replace('/[^a-zA-Z0-9_-]/', '', (string) $request->input('folder', 'general')) ?: 'general';
        // Use the same authenticated user resolved by auth:sanctum. Looking up
        // the web guard directly can be null for valid Sanctum admin sessions.
        $user = $request->user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        $permission = match ($folder) {
            'products' => 'can_manage_products', 'brands' => 'can_manage_brands',
            'categories', 'main-categories' => 'can_manage_categories', 'banners' => 'can_manage_banners',
            default => null,
        };
        if ($user->role !== 'SUPER_ADMIN' && (! $permission || ! $user->{$permission})) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        $request->validate(['file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp,gif,avif', 'max:10240'], 'folder' => ['nullable', 'string', 'max:80']]);
        $file = $request->file('file');
        $extension = strtolower($file->guessExtension() ?: 'jpg');
        $filename = Str::uuid()->toString().'.'.$extension;
        $path = Storage::disk('public')->putFileAs('uploads/'.$folder, $file, $filename);
        if (! $path) {
            Log::error('Image upload failed: public storage did not save the file.', [
                'folder' => $folder,
                'user_id' => $user->id,
            ]);

            return response()->json(['error' => 'The server could not save the image. Check Laravel public storage permissions.'], 500);
        }

        return response()->json(['url' => '/uploads/'.$folder.'/'.$filename, 'success' => true], 201);
    }

    public function show(string $path)
    {
        abort_unless(
            preg_match('/\\A[a-zA-Z0-9._\\/-]+\\z/', $path) === 1
                && ! str_contains($path, '..')
                && ! str_contains($path, '\\'),
            404,
        );

        $legacyPath = public_path('uploads/'.$path);
        if (is_file($legacyPath)) {
            return response()->file($legacyPath, ['Cache-Control' => 'public, max-age=31536000, immutable']);
        }

        $disk = Storage::disk('public');
        $storagePath = 'uploads/'.$path;
        abort_unless($disk->exists($storagePath), 404);

        return response()->file($disk->path($storagePath), ['Cache-Control' => 'public, max-age=31536000, immutable']);
    }
}
