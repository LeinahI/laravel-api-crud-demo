<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use App\Models\PostModel;
use App\Http\Resources\PostResource;
use Spatie\QueryBuilder\QueryBuilder;

class PostController extends ApiController
{

    public function index()
    {
        // return PostModel::all();

        // Create a QueryBuilder instance for the PostModel
        $posts = QueryBuilder::for(PostModel::class)
            ->allowedFilters(['title', 'status']) // Allow clients to filter results by 'title' or 'status' fields via query parameters
            ->allowedSorts(['title', 'created_at'])  // Allow clients to sort results by 'title' or 'created_at' fields via query parameters
            ->allowedIncludes(['author', 'comments']) // Allow clients to include related data like 'author' (user) or 'comments' via query parameters
            ->paginate();  // Paginate the results (default 15 items per page, or customizable via per_page parameter)

        return $this->success(PostResource::collection($posts)); // Return the paginated posts transformed through PostResource and wrapped in success response
    }

    public function show(PostModel $post)
    {
        return $this->success(new PostResource($post->load('user'))); // Return a single post transformed through PostResource, including its related user data, wrapped in success response
    }

    public function store(Request $request, PostModel $postModel)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = $postModel->create([
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'content' => $data['content'],
        ]);

        return $this->success(new PostResource($post->load('user')), 201);
    }

    public function update(Request $request, PostModel $postModel, $post_id)
    {

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = $postModel->findOrFail($post_id);

        $post->update([
            'title' => $data['title'],
            'content' => $data['content'],
        ]);

        return $this->success(new PostResource($post->load('user')), 201);
    }

    public function destroy(PostModel $postModel, $post_id)
    {
        $post = $postModel->findOrFail($post_id);
        $post->delete();

        return $this->success('The post has been deleted.', 204);
    }
}
