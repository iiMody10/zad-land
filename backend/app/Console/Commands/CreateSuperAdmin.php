<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdmin extends Command
{
    protected $signature = 'zadland:admin-create {username?}';

    protected $description = 'Create or reset the initial Zad Land super admin account';

    public function handle(): int
    {
        $username = $this->argument('username') ?: $this->ask('Admin username');
        if (! is_string($username) || trim($username) === '') {
            $this->error('A username is required.');

            return self::FAILURE;
        }

        $password = $this->secret('Admin password');
        if (! is_string($password) || mb_strlen($password) < 8) {
            $this->error('Use a password with at least 8 characters.');

            return self::FAILURE;
        }

        $user = User::updateOrCreate(
            ['username' => trim($username)],
            ['password' => Hash::make($password), 'role' => 'SUPER_ADMIN'],
        );

        $this->info("Super admin {$user->username} is ready.");

        return self::SUCCESS;
    }
}
