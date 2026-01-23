import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { PostData } from "@/types/post-data";

async function getPosts(): Promise<PostData[]> {
    try {
        const res = await api.get('/posts');
        return res.data;
    } catch (error) {
        throw new Error('Failed to fetch posts' + (error instanceof Error ? `: ${error.message}` : ''));
    }
}

export default async function PostList() {

    let posts: PostData[] = [];
    let error: string | null = null;

    try {
        posts = await getPosts();
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to fetch posts';
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <>
            {posts.map((post) => {
                return (
                    <Card key={post.post_id} className="mx-auto w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription>
                                Post by {post.user_id?.name} on {new Date(post.created_at).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                {post.content}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </>
    )
};
