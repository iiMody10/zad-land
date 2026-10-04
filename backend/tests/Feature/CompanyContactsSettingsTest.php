<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyContactsSettingsTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::create(['id' => 'company-contacts-admin', 'username' => 'contacts-admin', 'password' => 'password', 'role' => 'SUPER_ADMIN']);
    }

    public function test_contacts_can_be_edited_and_read_on_the_public_settings_endpoint(): void
    {
        $contacts = json_encode([
            ['id' => 'company-manager', 'nameAr' => 'حسام', 'nameEn' => 'Hussam', 'roleAr' => 'مدير الشركة', 'roleEn' => 'Company Manager', 'phone' => '0944664406', 'enabled' => true],
            ['id' => 'sales-manager', 'nameAr' => 'محمد', 'nameEn' => 'Mohammad', 'roleAr' => 'مدير مبيعات', 'roleEn' => 'Sales Manager', 'phone' => '0969392878', 'enabled' => false],
        ], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

        $this->actingAs($this->admin(), 'web')->putJson('/api/admin/settings', ['companyContacts' => $contacts])
            ->assertOk()->assertJsonPath('companyContacts', $contacts);
        $this->assertDatabaseHas('settings', ['id' => 'site-settings', 'company_contacts' => $contacts]);
        $this->getJson('/api/settings')->assertOk()->assertJsonPath('companyContacts', $contacts);
    }

    public function test_admin_can_remove_every_contact_without_restoring_defaults(): void
    {
        $this->actingAs($this->admin(), 'web')->putJson('/api/admin/settings', ['companyContacts' => '[]'])
            ->assertOk()->assertJsonPath('companyContacts', '[]');
        $this->getJson('/api/settings')->assertOk()->assertJsonPath('companyContacts', '[]');
    }

    public function test_invalid_contact_payloads_are_rejected(): void
    {
        $this->actingAs($this->admin(), 'web');
        $contact = ['id' => 'duplicate', 'nameAr' => 'حسام', 'nameEn' => 'Hussam', 'roleAr' => 'مدير الشركة', 'roleEn' => 'Company Manager', 'phone' => '0944664406', 'enabled' => true];
        foreach (['not-json', '{}', json_encode([$contact, $contact], JSON_THROW_ON_ERROR)] as $payload) {
            $this->putJson('/api/admin/settings', ['companyContacts' => $payload])
                ->assertUnprocessable()->assertJsonValidationErrors('companyContacts');
        }
    }
}
