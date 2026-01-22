<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PostModel;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    public function modify(User $user, PostModel $post): Response
    {
        return $user->user_id === $post->user_id
            ? Response::allow()
            : Response::deny('You do not own this post to modify this.');
    }
}
