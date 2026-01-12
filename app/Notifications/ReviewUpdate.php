<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;

use Illuminate\Notifications\Notification;

class ReviewUpdate extends Notification
{
    use Queueable;
    public $message;
    public $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct($message, $booking)
    {
        $this->message = $message;
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['database']; // Store in DB
    }


  public function toArray($notifiable)
    {
        return [
        'message' => $this->message,
        'booking_id' => $this->booking->id, // <--- IMPORTANT: We need the ID
        'type'    => 'review',      // <--- A tag to help React know where to go
        'created_at' => now(),
    ];
    }
}
