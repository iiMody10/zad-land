<?php

namespace Tests\Feature;

use App\Models\MainCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HeaderNavigationSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_existing_main_categories_as_header_navigation_links(): void
    {
        $admin = User::create([
            'id' => 'admin-navigation-test',
            'username' => 'navigation-admin',
            'password' => 'password',
            'role' => 'SUPER_ADMIN',
        ]);
        $mainCategory = MainCategory::create([
            'id' => 'main-category-navigation-test',
            'name' => 'Groceries',
            'slug' => 'groceries-navigation-test',
        ]);
        $links = json_encode([
            ['type' => 'mainCategory', 'id' => $mainCategory->id],
        ], JSON_THROW_ON_ERROR);

        $response = $this->actingAs($admin, 'web')->putJson('/api/admin/settings', [
            'headerNavItems' => $links,
        ]);

        $response->assertOk()->assertJsonPath('headerNavItems', $links);
        $this->assertDatabaseHas('settings', [
            'id' => 'site-settings',
            'header_nav_items' => $links,
        ]);
    }

    public function test_admin_can_control_the_home_link_in_header_navigation(): void
    {
        $admin = User::create([
            'id' => 'admin-home-navigation-test',
            'username' => 'home-navigation-admin',
            'password' => 'password',
            'role' => 'SUPER_ADMIN',
        ]);
        $links = json_encode([
            ['type' => 'home', 'id' => 'home', 'enabled' => false],
        ], JSON_THROW_ON_ERROR);

        $response = $this->actingAs($admin, 'web')->putJson('/api/admin/settings', [
            'headerNavItems' => $links,
        ]);

        $response->assertOk()->assertJsonPath('headerNavItems', $links);
        $this->assertDatabaseHas('settings', [
            'id' => 'site-settings',
            'header_nav_items' => $links,
        ]);
    }
}
