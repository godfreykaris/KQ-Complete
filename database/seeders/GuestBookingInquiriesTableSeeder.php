<?php

namespace Database\Seeders;

use App\Models\BookingInquiryType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GuestBookingInquiriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        [
            'name' => fake()->name,
            'email' => fake()->email,
            'booking_inquiry_type_id' => BookingInquiryType::pluck('id')->random(),
            'subject' => fake()->sentence,
            'message' => fake()->paragraph,
        ];
    }
}
