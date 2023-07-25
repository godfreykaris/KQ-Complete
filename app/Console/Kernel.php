<?php

namespace App\Console;

use App\Models\Flight;
use App\Models\FlightStatus;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use Carbon\Carbon;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        $schedule->call(function () 
        {
            // Mark flights with "departure_date" in the past as "departed"
            $departedStatusId = FlightStatus::where('name', 'Departed')->value('id');
            Flight::where('departure_date', '<', now())
                ->where('flight_status_id', FlightStatus::where('name', 'On-time')->value('id'))
                ->update(['flight_status_id' => $departedStatusId]);

            // Delete flights that departed 2 days ago
            $twoDaysAgo = Carbon::now()->subDays(2)->toDateString();
            $departedStatusId = FlightStatus::where('name', 'Departed')->value('id');
            Flight::where('flight_status_id', $departedStatusId)
                ->whereDate('departure_date', '<=', $twoDaysAgo)
                ->delete();
                
        })->dailyAt('23:59'); // Schedule the task to run daily at 23:59 (end of the day)
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
