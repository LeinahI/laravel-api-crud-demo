<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'post_id' => $this->post_id,
            'title' => $this->title,
            'content' => $this->content,
            'user_id' => new UserResource($this->whenLoaded('user')), // $this->user_id
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
