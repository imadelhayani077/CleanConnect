<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingStatusUpdated extends Notification
{
    use Queueable;

    public $message;
    public $booking;
    public $type;

    public function __construct($message, $booking, $type)
    {
        $this->message = $message;
        $this->booking = $booking;
        $this->type = $type;
    }

    public function via($notifiable)
    {
        return ['database']; // We are saving to the DB, not sending email yet
    }

    // This defines what gets saved in the JSON 'data' column
    public function toArray($notifiable)
    {
        return [
            'message' => $this->message,
            'booking' => $this->booking,
            'type'    => $this->type,
            'created_at' => now(), // Good for sorting
        ];
    }
}
