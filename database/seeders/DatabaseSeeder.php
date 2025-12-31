<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Admin Admin',
            'email' => 'admin@admin.admin',
            'password' => 'admin@admin.admin',
        ]);
        \App\Models\User::factory()->create([
            'name' => 'client client',
            'email' => 'client@client.client',
            'password' => 'client@client.client',
        ]);
        \App\Models\User::factory()->create([
            'name' => 'sweepstar sweepstar',
            'email' => 'sweepstar@sweepstar.sweepstar',
            'password' => 'sweepstar@sweepstar.sweepstar',
        ]);
    }
}
