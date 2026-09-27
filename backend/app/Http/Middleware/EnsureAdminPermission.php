<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = Auth::guard('web')->user();
        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        if ($user->role === 'SUPER_ADMIN') {
            return $next($request);
        }

        $allowed = match ($permission) {
            'customers' => false,
            'users', 'settings', 'site-content', 'admin-credentials' => false,
            default => (bool) $user->getAttribute('can_'.$permission),
        };

        return $allowed ? $next($request) : response()->json(['error' => 'Forbidden'], 403);
    }
}
