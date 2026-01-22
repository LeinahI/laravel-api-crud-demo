<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\PostModelFactory;

class PostModel extends Model
{


    /** @use HasFactory<PostModelFactory> */
    use HasFactory;
    protected $table = 'posts';
    protected $primaryKey = 'post_id';

    protected $fillable = [
        'title',
        'content',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
