<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationUpdate extends Notification
{
    use Queueable;

    public $message;
    public $status; // 'success' (approved), 'error' (rejected), or 'info' (new)

    public function __construct($message, $status = 'info')
    {
        $this->message = $message;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['database']; // Store in DB
    }

    public function toArray($notifiable)
    {
        return [
            'message' => $this->message,
            'status' => $this->status,
            'created_at' => now(),
        ];
    }
}
