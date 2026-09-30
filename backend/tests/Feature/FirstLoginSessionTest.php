<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class FirstLoginSessionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['session.driver' => 'database', 'session.cookie' => 'custom_store_session']);
        $this->withCredentials();
    }

    public static function accounts(): array
    {
        return [
            'admin apex' => ['admin', 'zad-land.com'],
            'admin www' => ['admin', 'www.zad-land.com'],
            'customer apex' => ['customer', 'zad-land.com'],
            'customer www' => ['customer', 'www.zad-land.com'],
        ];
    }

    private function createAccount(string $account): User|Customer
    {
        return $account === 'admin'
            ? User::create(['username' => 'login-test-admin', 'password' => 'secret123', 'role' => 'ADMIN'])
            : Customer::create(['shop_name' => 'Login test shop', 'owner_name' => 'Owner', 'phone' => '963912345678', 'city' => 'Homs', 'address' => 'Main street', 'password' => 'secret123', 'is_active' => true]);
    }

    private function credentials(string $account, string $password = 'secret123'): array
    {
        return $account === 'admin'
            ? ['username' => 'login-test-admin', 'password' => $password]
            : ['phone' => '0912345678', 'password' => $password];
    }

    private function rememberCookies(TestResponse $response): void
    {
        foreach ($response->headers->getCookies() as $cookie) {
            $this->withUnencryptedCookie($cookie->getName(), $cookie->getValue());
        }
        // Each HTTP request must resolve the user again from the saved cookie.
        app('auth')->forgetGuards();
        app('auth')->shouldUse('web');
    }

    #[DataProvider('accounts')]
    public function test_first_login_persists_the_session_for_the_next_request(string $account, string $host): void
    {
        $user = $this->createAccount($account);
        $this->withHeaders(['Origin' => "https://{$host}", 'Referer' => "https://{$host}/"]);
        $this->rememberCookies($this->get('/sanctum/csrf-cookie')->assertNoContent());
        $key = $account === 'admin' ? 'user' : 'customer';

        $this->rememberCookies($this->postJson("/api/{$account}/auth/login", $this->credentials($account))
            ->assertOk()->assertJsonPath("{$key}.id", $user->id));
        $this->rememberCookies($this->getJson("/api/{$account}/auth/me")
            ->assertOk()->assertJsonPath("{$key}.id", $user->id));
        $this->getJson("/api/{$account}/auth/me")->assertOk()->assertJsonPath("{$key}.id", $user->id);
    }

    #[DataProvider('accounts')]
    public function test_reauthentication_after_a_password_change_succeeds_on_the_first_attempt(string $account, string $host): void
    {
        $user = $this->createAccount($account);
        $key = $account === 'admin' ? 'user' : 'customer';
        $this->withHeaders(['Origin' => "https://{$host}", 'Referer' => "https://{$host}/"]);
        $this->rememberCookies($this->postJson("/api/{$account}/auth/login", $this->credentials($account))->assertOk());
        $this->rememberCookies($this->getJson("/api/{$account}/auth/me")->assertOk());
        if ($account === 'customer') {
            $this->rememberCookies($this->getJson('/api/customer/wishlist?idsOnly=true')->assertOk());
        }
        $user->update(['password' => 'updated123']);

        $this->rememberCookies($this->postJson("/api/{$account}/auth/login", $this->credentials($account, 'updated123'))
            ->assertOk()->assertJsonPath("{$key}.id", $user->id));
        $this->getJson("/api/{$account}/auth/me")->assertOk()->assertJsonPath("{$key}.id", $user->id);
    }

    public function test_admin_and_customer_sessions_can_be_used_in_the_same_browser(): void
    {
        $admin = $this->createAccount('admin');
        $customer = $this->createAccount('customer');
        $this->withHeaders(['Origin' => 'https://zad-land.com', 'Referer' => 'https://zad-land.com/']);
        $this->rememberCookies($this->postJson('/api/customer/auth/login', $this->credentials('customer'))->assertOk());
        $this->rememberCookies($this->getJson('/api/customer/auth/me')->assertOk());
        $this->rememberCookies($this->postJson('/api/admin/auth/login', $this->credentials('admin'))->assertOk());

        $this->rememberCookies($this->getJson('/api/admin/auth/me')->assertOk()->assertJsonPath('user.id', $admin->id));
        $this->rememberCookies($this->getJson('/api/customer/auth/me')->assertOk()->assertJsonPath('customer.id', $customer->id));
        $this->getJson('/api/customer/wishlist?idsOnly=true')->assertOk();
    }

    #[DataProvider('accounts')]
    public function test_password_changes_still_revoke_access_without_fresh_credentials(string $account, string $host): void
    {
        $user = $this->createAccount($account);
        $this->withHeaders(['Origin' => "https://{$host}", 'Referer' => "https://{$host}/"]);
        $this->rememberCookies($this->postJson("/api/{$account}/auth/login", $this->credentials($account))->assertOk());
        $this->rememberCookies($this->getJson("/api/{$account}/auth/me")->assertOk());
        $user->update(['password' => 'updated123']);

        $path = $account === 'admin' ? '/api/admin/auth/me' : '/api/customer/wishlist?idsOnly=true';
        $this->rememberCookies($this->getJson($path)->assertUnauthorized());
        $this->postJson("/api/{$account}/auth/login", $this->credentials($account))->assertUnauthorized();
    }

    public function test_revoking_one_guard_preserves_the_other_guard(): void
    {
        $admin = $this->createAccount('admin');
        $customer = $this->createAccount('customer');
        $this->withHeaders(['Origin' => 'https://zad-land.com', 'Referer' => 'https://zad-land.com/']);
        $this->rememberCookies($this->postJson('/api/admin/auth/login', $this->credentials('admin'))->assertOk());
        $this->rememberCookies($this->postJson('/api/customer/auth/login', $this->credentials('customer'))->assertOk());
        $admin->update(['password' => 'updated123']);

        $this->rememberCookies($this->getJson('/api/admin/auth/me')->assertUnauthorized());
        $this->getJson('/api/customer/auth/me')->assertOk()->assertJsonPath('customer.id', $customer->id);
    }
}
