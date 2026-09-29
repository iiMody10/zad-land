<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $directory = public_path('uploads/'.$folder);
        if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
            throw new \RuntimeException('Unable to create upload directory.');
        }
        $file->move($directory, $filename);

        return response()->json(['url' => '/uploads/'.$folder.'/'.$filename, 'success' => true], 201);
    }
}
