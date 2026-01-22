<?php

use Illuminate\Foundation\Testing\RefreshDatabase; // Import the RefreshDatabase trait to reset the database between tests
use App\Models\User;
use App\Models\PostModel;

uses(RefreshDatabase::class); // Apply RefreshDatabase to this test file - clears database state before each test

it('lists posts', function () { // Define a test called 'lists posts' using Pest's it() helper function

    $user = User::factory()->create();  // Create a single test user and save it to the database
    PostModel::factory()->count(3)->create();   // Create 3 test posts in the database using the PostModel factory

    $response = $this->actingAs($user) // Make an authenticated HTTP GET request as the created user
        ->getJson('/api/v1/posts');  // Send a JSON GET request to the /api/v1/posts endpoint

    // Display the actual response data in test output
    dump($response->json());

    $response
        ->assertStatus(200)         // Assert that the response status code is 200 (successful)
        ->assertJsonCount(3, 'data'); // Assert that the JSON response contains exactly 3 items in the 'data' key
});
