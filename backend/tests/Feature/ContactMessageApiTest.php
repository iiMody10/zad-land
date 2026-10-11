<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::create([
            'id' => 'contact-test-admin',
            'username' => 'contact-admin',
            'password' => 'password',
            'role' => 'SUPER_ADMIN',
        ]);
    }

    public function test_public_user_can_submit_contact_message(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'تجربة',
            'business_name' => 'متجر التجربة',
            'phone' => '0940722840',
            'message' => 'هذه رسالة تجريبية للاستفسار عن منتجات الجملة.',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.name', 'تجربة');
        $response->assertJsonPath('data.businessName', 'متجر التجربة');
        $response->assertJsonPath('data.phone', '0940722840');
        $response->assertJsonPath('data.status', 'unread');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'تجربة',
            'phone' => '0940722840',
            'status' => 'unread',
        ]);
    }

    public function test_public_submission_auto_recovers_if_table_missing(): void
    {
        \Illuminate\Support\Facades\Schema::dropIfExists('contact_messages');
        $this->assertFalse(\Illuminate\Support\Facades\Schema::hasTable('contact_messages'));

        $response = $this->postJson('/api/contact', [
            'name' => 'تعافي تلقائي',
            'business_name' => 'شركة التعافي',
            'phone' => '0999999999',
            'message' => 'اختبار إنشاء الجدول تلقائياً',
        ]);

        $response->assertCreated();
        $this->assertTrue(\Illuminate\Support\Facades\Schema::hasTable('contact_messages'));
        $this->assertDatabaseHas('contact_messages', [
            'name' => 'تعافي تلقائي',
            'phone' => '0999999999',
        ]);
    }

    public function test_contact_submission_validates_required_fields(): void
    {
        $response = $this->postJson('/api/contact', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['name', 'phone', 'message']);
    }

    public function test_admin_can_read_and_manage_contact_messages(): void
    {
        ContactMessage::create([
            'name' => 'عميل جملة',
            'phone' => '0944000000',
            'message' => 'طلب تسعيرة كرتونة',
            'status' => 'unread',
        ]);

        $admin = $this->admin();

        $indexRes = $this->actingAs($admin, 'web')->getJson('/api/admin/contact-messages');
        $indexRes->assertOk();
        $indexRes->assertJsonPath('unreadCount', 1);
        $indexRes->assertJsonPath('totalCount', 1);

        $msgId = $indexRes->json('messages.0.id');
        $this->assertNotEmpty($msgId);

        $updateRes = $this->actingAs($admin, 'web')->patchJson("/api/admin/contact-messages/{$msgId}", [
            'status' => 'read',
        ]);
        $updateRes->assertOk();
        $this->assertDatabaseHas('contact_messages', ['id' => $msgId, 'status' => 'read']);

        $deleteRes = $this->actingAs($admin, 'web')->deleteJson("/api/admin/contact-messages/{$msgId}");
        $deleteRes->assertOk();
        $this->assertDatabaseMissing('contact_messages', ['id' => $msgId]);
    }
}
