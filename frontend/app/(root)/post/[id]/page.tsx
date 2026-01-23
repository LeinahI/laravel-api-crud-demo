import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { PostData } from "@/types/post-data";
import Link from "next/link";

async function getPost(id: string): Promise<PostData> {
    try {
        const res = await api.get(`/posts/${id}`);
        return res.data;
    } catch (error) {
        throw new Error('Failed to fetch post' + (error instanceof Error ? `: ${error.message}` : ''));
    }
}

export default async function PostDetail({ params }: { params: { id: string } }) {
    let post: PostData | null = null;
    let error: string | null = null;

    try {
        const { id } = await params;
        post = await getPost(id);
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to fetch post';
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-red-500 text-center p-4">{error}</div>
                <Link href="/" className="text-blue-500 hover:underline">
                    Back to Posts
                </Link>
            </div>
        );
    }

    if (!post) {
        return <div className="text-center p-4">Post not found</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                        Post by {post.user_id?.name} on {new Date(post.created_at).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed">
                        {post.content}
                    </p>
                </CardContent>
            </Card>
            <Link href="/" className="text-blue-500 hover:underline">
                Back to Posts
            </Link>
        </div>
    );
}