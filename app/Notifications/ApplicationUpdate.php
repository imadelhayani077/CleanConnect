<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationUpdate extends Notification
{
    use Queueable;

    public $message;
    public $status; // 'success' (approved), 'error' (rejected), or 'info' (new)
    public $type; // 'applicationRequest' or 'applicationResponse'

    public function __construct($message, $status = 'info', $type = 'applicationRequest')
    {
        $this->message = $message;
        $this->status = $status;
        $this->type = $type;
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
            'type' => $this->type,
            'created_at' => now(),
        ];
    }
}
