<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class EditProfileUpdate extends Notification
{
    use Queueable;

    public $message;
    public $user;
    public $changes;

    /**
     * @param string $message
     * @param array $changes  - The [field => ['old' => x, 'new' => y]] array
     * @param object $user    - The user who was updated
     */
    public function __construct($message, $changes, $user)
    {
        $this->message = $message;
        $this->changes = $changes;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message'    => $this->message,
            'user_id'    => $this->user->id,
            'changes'    => $this->changes,
            'type'       => 'profileUpdate',
            'created_at' => now(),
        ];
    }
}
