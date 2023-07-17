<?php

namespace Database\Seeders;

use App\Models\BookingInquiryType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookingInquiryTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bookingInquiryTypes = [
            ['name' => 'Add Booking'],
            ['name' => 'Change Booking'],
            ['name' => 'Delete Booking'],
            // ['name' => 'Flight Inquiry'],
            // ['name' => 'Refund Inquiry'],
            // ['name' => 'Seat Inquiry'],
            // ['name' => 'Schedule Inquiry'],
        ];

        foreach($bookingInquiryTypes as $key => $value)
        {
            BookingInquiryType::create($value);
        }
    }
}
