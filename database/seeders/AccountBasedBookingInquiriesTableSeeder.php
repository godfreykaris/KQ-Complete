<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\BookingInquiryType;

class AccountBasedBookingInquiriesTableSeeder extends Seeder
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
