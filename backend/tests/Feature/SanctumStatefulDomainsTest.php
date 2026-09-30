<?php

namespace Tests\Feature;

use Tests\TestCase;

class SanctumStatefulDomainsTest extends TestCase
{
    public function test_production_store_hosts_are_always_stateful_even_when_env_overrides_the_list(): void
    {
        $domains = config('sanctum.stateful');

        $this->assertContains('zad-land.com', $domains);
        $this->assertContains('www.zad-land.com', $domains);
    }
}
