"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import Link from "next/link";
import { PostData } from "@/types/post-data";

export default function EditPostPage() {
    const params = useParams();
    const postId = params.id as string;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const router = useRouter();

    // Fetch post data on mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get<PostData>(`/posts/${postId}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to fetch post"
                );
            } finally {
                setIsLoadingPost(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        setIsLoading(true);

        try {
            await api.put(`/posts/${postId}`, {
                title: title.trim(),
                content: content.trim(),
            });

            // Redirect to the post
            router.push(`/post/${postId}`);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update post"
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingPost) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <p>Loading post...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Link href={`/post/${postId}`} className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <CardTitle>Edit Post</CardTitle>
                            <CardDescription>
                                Update post title and content
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Title
                            </label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter post title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium">
                                Content
                            </label>
                            <textarea
                                id="content"
                                placeholder="Enter post content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={isLoading}
                                className="w-full min-h-48 p-2 border rounded-md font-mono text-sm"
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? "Updating..." : "Update Post"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
