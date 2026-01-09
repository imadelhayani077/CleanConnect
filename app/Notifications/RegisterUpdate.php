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
            'user' => $this->user,
            'created_at' => now(),
        ];
    }
}
