"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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

export default function SearchPage() {
    const [postId, setPostId] = useState("");
    const [error, setError] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!postId.trim()) {
            setError("Please enter a post ID");
            return;
        }

        if (!/^\d+$/.test(postId.trim())) {
            setError("Post ID must be a number");
            return;
        }

        setIsSearching(true);

        try {
            // Verify post exists before navigating
            await api.get(`/posts/${postId.trim()}`);
            router.push(`/post/${postId.trim()}`);
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setError("Post doesn't exist");
            } else {
                setError(err?.response?.data?.message || "Failed to search post");
            }
            setIsSearching(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search Post
                    </CardTitle>
                    <CardDescription>
                        Enter a post ID to view the post details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="postId" className="text-sm font-medium">
                                Post ID
                            </label>
                            <Input
                                id="postId"
                                type="text"
                                placeholder="Enter post ID (e.g., 1)"
                                value={postId}
                                onChange={(e) => setPostId(e.target.value)}
                                disabled={isSearching}
                                className={error ? "border-red-500" : ""}
                            />
                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isSearching}
                            className="w-full"
                        >
                            {isSearching ? "Searching..." : "Search"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
