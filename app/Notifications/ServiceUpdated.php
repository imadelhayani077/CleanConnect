<?php

namespace App\Notifications;
namespace App\Notifications;

use Illuminate\Bus\Queueable;

use Illuminate\Notifications\Notification;

class ServiceUpdated extends Notification
{
    use Queueable;
    public $message;
    public $service;

    /**
     * Create a new notification instance.
     */
    public function __construct($message, $service)
    {
        $this->message = $message;
        $this->service = $service;
    }

    /**
     * Get the mail representation of the notification.
     */
   public function via($notifiable)
    {
        return ['database']; // Store in DB
    }





   public function toArray($notifiable)
    {
        return [
        'message' => $this->message,
        'service' => $this->service, // <--- IMPORTANT: We need the ID
        'type'    => 'service',      // <--- A tag to help React know where to go
        'created_at' => now(),
    ];
    }
}
