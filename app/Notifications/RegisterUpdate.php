<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class RegisterUpdate extends Notification
{
    use Queueable;

    public $message;
    public $user; //

    public function __construct($message, $user)
    {
        $this->message = $message;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database']; // Store in DB
    }

    public function toArray($notifiable)
    {
        return [
        'message' => $this->message,
        'user_id' => $this->user->id, // <--- IMPORTANT: We need the ID
        'type'    => 'newUser',      // <--- A tag to help React know where to go
        'created_at' => now(),
    ];
    }
}
