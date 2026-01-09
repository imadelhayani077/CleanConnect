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
    public $bookingId;

    public function __construct($message, $bookingId)
    {
        $this->message = $message;
        $this->bookingId = $bookingId;
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
            'booking_id' => $this->bookingId,
            'created_at' => now(), // Good for sorting
        ];
    }
}
