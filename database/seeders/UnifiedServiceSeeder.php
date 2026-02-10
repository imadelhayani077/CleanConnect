<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;


class UnifiedServiceSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Indoor Cleaning
        $indoor = Service::updateOrCreate(['name' => 'Indoor Cleaning'], [
            'description' => 'Professional interior house cleaning.',
        ]);

        $indoor->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'House Size','name' => 'Small House : 1-2 Rooms', 'option_price' => 120, 'duration_minutes' => 120],
            ['option_group' => 'option_1','option_group_name' => 'House Size','name' => 'Medium House : 3-4 Rooms', 'option_price' => 180, 'duration_minutes' => 180],
            ['option_group' => 'option_1','option_group_name' => 'House Size','name' => 'big House : +5 Rooms', 'option_price' => 240, 'duration_minutes' => 240],
        ]);

        $indoor->extras()->createMany([
            ['name' => 'Inside Fridge','extra_price' => 20, 'duration_minutes' => 30],
            ['name' => 'Inside Oven', 'extra_price' => 20, 'duration_minutes' => 30],
            ['name' => 'Inside Cabinets', 'extra_price' => 20, 'duration_minutes' => 45],
            ['name' => 'Interior Windows', 'extra_price' => 25, 'duration_minutes' => 30],
            ['name' => 'Interior Walls', 'extra_price' => 30, 'duration_minutes' => 60],
            ['name' => 'Water Plants', 'extra_price' => 10, 'duration_minutes' => 15],
            ['name' => 'Ironing', 'extra_price' => 20, 'duration_minutes' => 60],
            ['name' => 'Laundry', 'extra_price' => 25, 'duration_minutes' => 60],
        ]);

        // 2. Outdoor Services
        $outdoor = Service::updateOrCreate(['name' => 'Outdoor Services'], [
            'description' => 'Exterior maintenance and yard work.',
        ]);

        $outdoor->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'Yard Size','name' => 'Small Yard (<50 m2)', 'option_price' => 120, 'duration_minutes' => 120],
            ['option_group' => 'option_1','option_group_name' => 'Yard Size','name' => 'Medium Yard (50-80 m2)', 'option_price' => 180, 'duration_minutes' => 180],
            ['option_group' => 'option_1','option_group_name' => 'Yard Size','name' => 'Big Yard (+80 m2)', 'option_price' => 240, 'duration_minutes' => 240],
        ]);

        $outdoor->extras()->createMany([
            ['name' => 'Outside Windows', 'extra_price' => 30, 'duration_minutes' => 45],
            ['name' => 'Heavy Lifting', 'extra_price' => 40, 'duration_minutes' => 120],
            ['name' => 'Pool Cleaning', 'extra_price' => 60, 'duration_minutes' => 120],
            ['name' => 'Car Washing', 'extra_price' => 30, 'duration_minutes' => 60],
            ['name' => 'Dog Walking (1 hour)', 'extra_price' => 25, 'duration_minutes' => 60],
            ['name' => 'Dog Walking (30 min)', 'extra_price' => 15, 'duration_minutes' => 30],
        ]);

        // 3. Office Cleaning
        $office = Service::updateOrCreate(['name' => 'Office Cleaning'], [
            'description' => 'Specialized cleaning for commercial workspaces.',
        ]);

        $office->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'Office Size','name' => 'Small Office : 1-3 Rooms', 'option_price' => 120, 'duration_minutes' => 150],
            ['option_group' => 'option_1','option_group_name' => 'Office Size','name' => 'Medium Office : 4-5 Rooms', 'option_price' => 180, 'duration_minutes' => 210],
            ['option_group' => 'option_1','option_group_name' => 'Office Size','name' => 'Large Office : +6 Rooms', 'option_price' => 240, 'duration_minutes' => 270],
        ]);

        // 4. Moving Cleaning
        $moving = Service::updateOrCreate(['name' => 'Moving Cleaning'], [
            'description' => 'Deep cleaning for moving in or out of a property.',

        ]);
        $moving->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'Property Size','name' => ' Tiny Home: under 50m2', 'option_price' => 120, 'duration_minutes' => 150],
            ['option_group' => 'option_1','option_group_name' => 'Property Size','name' => 'Small Home: under 50-93m2', 'option_price' => 180, 'duration_minutes' => 210],
            ['option_group' => 'option_1','option_group_name' => 'Property Size','name' => 'Medium Home: under 93-186m2', 'option_price' => 240, 'duration_minutes' => 270],
            ['option_group' => 'option_1','option_group_name' => 'Property Size','name' => 'Large Home: under 186-325m2', 'option_price' => 300, 'duration_minutes' => 330],
            ['option_group' => 'option_1','option_group_name' => 'Property Size','name' => 'Extra Large Home: +325m2', 'option_price' => 360, 'duration_minutes' => 390],
        ]);
        $moving->extras()->createMany([
            ['name' => 'Garden Care', 'extra_price' => 40, 'duration_minutes' => 60],
            ['name' => 'Balcony / Patio', 'extra_price' => 20, 'duration_minutes' => 30],
            ['name' => 'Clean Windows', 'extra_price' => 30, 'duration_minutes' => 60],
            ['name' => 'Clean Appliance', 'extra_price' => 20, 'duration_minutes' => 45],
            ['name' => 'Wipe Furniture', 'extra_price' => 25, 'duration_minutes' => 60],
            ['name' => 'Unpack Boxes', 'extra_price' => 50, 'duration_minutes' => 120],
            ['name' => 'Pack Up Boxes', 'extra_price' => 60, 'duration_minutes' => 120],
        ]);

        // 5. Airbnb Cleaning
        $airbnb = Service::updateOrCreate(['name' => 'Airbnb Cleaning'], [
            'description' => 'Fast turnaround cleaning for short-term rentals.',

        ]);
          $airbnb->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'Property Size','name' => 'Small House : 1-2 Rooms', 'option_price' => 120, 'duration_minutes' => 120],
            ['option_group' => 'option_1','option_group_name' => 'Property Size','name' => 'Medium House : 3-4 Rooms', 'option_price' => 180, 'duration_minutes' => 180],
            ['option_group' => 'option_1','option_group_name' => 'Property Size','name' => 'big House : +5 Rooms', 'option_price' => 240, 'duration_minutes' => 240],
            ['option_group' => 'option_2','option_group_name' => 'Linen Service','name' => 'Replace linen but do not wash', 'option_price' => 10, 'duration_minutes' => 20],
            ['option_group' => 'option_2','option_group_name' => 'Linen Service','name' => 'Wash linens and leave to hang dry', 'option_price' => 40, 'duration_minutes' => 45],
            ['option_group' => 'option_2','option_group_name' => 'Linen Service','name' => 'Wash, dry & repack linen onsite', 'option_price' => 100, 'duration_minutes' =>120],
            ['option_group' => 'option_2','option_group_name' => 'Linen Service','name' => 'Do not replace bedding', 'option_price' =>0, 'duration_minutes' => 0],
        ]);

        $airbnb->extras()->createMany([
            ['name' => 'Clean Appliances', 'extra_price' => 30, 'duration_minutes' => 45],
            ['name' => 'Restock Supplies', 'extra_price' => 20, 'duration_minutes' => 20],
            ['name' => 'Restock Toiletries', 'extra_price' => 20, 'duration_minutes' => 20],
        ]);

        // 6. Laundry and Ironing
        $laundry = Service::updateOrCreate(['name' => 'Laundry and Ironing'], [
            'description' => 'Wash, dry, and iron services.',

        ]);

        $laundry->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'Laundry Loads','name' => '0 Loads', 'option_price' => 0, 'duration_minutes' => 0],
            ['option_group' => 'option_1','option_group_name' => 'Laundry Loads','name' => '1-2 Loads', 'option_price' => 100, 'duration_minutes' => 120],
            ['option_group' => 'option_1','option_group_name' => 'Laundry Loads','name' => '3-4 Loads', 'option_price' => 120, 'duration_minutes' => 150],
            ['option_group' => 'option_1','option_group_name' => 'Laundry Loads','name' => '5-6 Loads', 'option_price' => 140, 'duration_minutes' => 180],
            ['option_group' => 'option_1','option_group_name' => 'Laundry Loads','name' => '7-8 Loads', 'option_price' => 160, 'duration_minutes' => 210],
            ['option_group' => 'option_1','option_group_name' => 'Laundry Loads','name' => '9-10 Loads', 'option_price' => 180, 'duration_minutes' => 240],
            ['option_group' => 'option_1','option_group_name' => 'Laundry Loads','name' => 'More than 10 Loads', 'option_price' => 200, 'duration_minutes' => 300],
            ['option_group' => 'option_2','option_group_name' => 'Ironing Items','name' => '0 loads/items', 'option_price' => 0, 'duration_minutes' => 0],
            ['option_group' => 'option_2','option_group_name' => 'Ironing Items','name' => '1 Loads (10-15 items)', 'option_price' => 100, 'duration_minutes' => 120],
            ['option_group' => 'option_2','option_group_name' => 'Ironing Items','name' => '2 Loads (16-30 items)', 'option_price' => 120, 'duration_minutes' => 150],
            ['option_group' => 'option_2','option_group_name' => 'Ironing Items','name' => '3 Loads (31-45 items)', 'option_price' => 140, 'duration_minutes' => 180],
            ['option_group' => 'option_2','option_group_name' => 'Ironing Items','name' => '4 Loads (46-60 items)', 'option_price' => 160, 'duration_minutes' => 210],
            ['option_group' => 'option_2','option_group_name' => 'Ironing Items','name' => '5 Loads (61-75 items)', 'option_price' => 180, 'duration_minutes' => 240],
            ['option_group' => 'option_2','option_group_name' => 'Ironing Items','name' => '6 Loads (More than 76 items)', 'option_price' => 200, 'duration_minutes' => 300],

        ]);

        // 7. Mom\'s Helper
        $momsHelper = Service::updateOrCreate(['name' => 'Mom\'s Helper'], [
            'description' => 'Assistance with childcare and household tasks.',

        ]);
         $momsHelper->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 1-4 hours', 'option_price' => 100, 'duration_minutes' => 240],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 4-6 hours', 'option_price' => 140, 'duration_minutes' => 360],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 6-8 hours', 'option_price' => 180, 'duration_minutes' => 480],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 8-10 hours', 'option_price' => 220, 'duration_minutes' => 600],
            ['option_group' => 'option_2','option_group_name' => 'Children Count','name' => '1 Childe', 'option_price' => 0, 'duration_minutes' =>0],
            ['option_group' => 'option_2','option_group_name' => 'Children Count','name' => '2 childes', 'option_price' => 50, 'duration_minutes' =>0],
            ['option_group' => 'option_2','option_group_name' => 'Children Count','name' => '3 childes', 'option_price' => 100, 'duration_minutes' =>0],
            ['option_group' => 'option_2','option_group_name' => 'Children Count','name' => '+3 childes', 'option_price' => 150, 'duration_minutes' =>0],

        ]);

        $momsHelper->extras()->createMany([
            ['name' => 'Preparing snacks & meals', 'extra_price' => 15, 'duration_minutes' => 0],
            ['name' => 'Kids Laundry', 'extra_price' => 15, 'duration_minutes' => 0],
            ['name' => 'Organising kids rooms', 'extra_price' => 25, 'duration_minutes' => 0],
        ]);

        // 8. Elder Care
        $elderCare = Service::updateOrCreate(['name' => 'Elder Care'], [
            'description' => 'Compassionate assistance for seniors.',

        ]);
          $elderCare->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 1-4 hours', 'option_price' => 100, 'duration_minutes' => 240],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 4-6 hours', 'option_price' => 140, 'duration_minutes' => 360],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 6-8 hours', 'option_price' => 180, 'duration_minutes' => 480],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 8-10 hours', 'option_price' => 220, 'duration_minutes' => 600],

        ]);
        $elderCare->extras()->createMany([
            ['name' => 'Light Cleaning', 'extra_price' => 40, 'duration_minutes' => 0],
            ['name' => 'Meal Preparation', 'extra_price' => 40, 'duration_minutes' => 0]
        ]);

        //  9. Extra Care
        $extraCare = Service::updateOrCreate(['name' => 'Extra Care'], [
            'description' => 'High-level specialized care and assistance.',

        ]);

        $extraCare->options()->createMany([
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 1-4 hours', 'option_price' => 100, 'duration_minutes' => 240],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 4-6 hours', 'option_price' => 140, 'duration_minutes' => 360],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 6-8 hours', 'option_price' => 180, 'duration_minutes' => 480],
            ['option_group' => 'option_1','option_group_name' => 'Service Duration','name' => ' 8-10 hours', 'option_price' => 220, 'duration_minutes' => 600],

        ]);
        $extraCare->extras()->createMany([
            ['name' => 'Light Cleaning', 'extra_price' => 40, 'duration_minutes' => 0],
            ['name' => 'Meal Preparation', 'extra_price' => 40, 'duration_minutes' => 0]
        ]);
    }


}
