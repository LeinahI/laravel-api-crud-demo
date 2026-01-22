<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use App\Models\PostModel;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\QueryBuilder;

class PostController extends ApiController
{

    public function index()
    {
        // Create a QueryBuilder instance for the PostModel
        $posts = QueryBuilder::for(PostModel::class)
            ->allowedFilters(['title', 'status']) // Allow clients to filter results by 'title' or 'status' fields via query parameters
            ->allowedSorts(['title', 'created_at'])  // Allow clients to sort results by 'title' or 'created_at' fields via query parameters
            ->allowedIncludes(['author', 'comments']) // Allow clients to include related data like 'author' (user) or 'comments' via query parameters
            ->paginate();  // Paginate the results (default 15 items per page, or customizable via per_page parameter)

        return $this->success(PostResource::collection($posts->load('user'))); // Return the paginated posts transformed through PostResource and wrapped in success response
    }

    public function show(PostModel $post)
    {
        return $this->success(new PostResource($post->load('user'))); // Return a single post transformed through PostResource, including its related user data, wrapped in success response
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = $request->user()->posts()->create($data);
        /* On create you can do this inside create() for verbose code and for clarity:
            [
                'title' => $data['title'],
                'content' => $data['content'],
            ]    
        */

        return $this->success(new PostResource($post->load('user')), 201);
    }

    /* Use route model binding + policy (idiomatic and concise): */
    public function update(Request $request, PostModel $post)
    {
        Gate::authorize('modify', $post); // uses registered PostPolicy

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post->update($data);

        return $this->success(new PostResource($post->load('user')), 200);
    }

    public function destroy(PostModel $post)
    {
        Gate::authorize('modify', $post);
        $post->delete();

        return $this->success('The post has been deleted.', 204);
    }
}
