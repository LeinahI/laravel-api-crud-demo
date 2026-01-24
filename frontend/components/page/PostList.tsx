"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Ellipsis,
    Trash,
    NotebookPen,
    HeartIcon,
    MessageCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import api from "@/lib/api";
import { PostData } from "@/types/post-data";
import { useAuth } from "@/context/AppContextProvider";
import Link from "next/link";

async function getPosts(): Promise<PostData[]> {
    try {
        const res = await api.get('/posts');
        return res.data;
    } catch (error) {
        throw new Error('Failed to fetch posts' + (error instanceof Error ? `: ${error.message}` : ''));
    }
}

function PostItem({ post, onPostDeleted }: { post: PostData; onPostDeleted: (postId: number) => void }) {
    const router = useRouter();
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const isAuthor = user?.user_id === post.user_id.user_id;

    const handleEdit = () => {
        router.push(`/post/edit/${post.post_id}`);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/posts/${post.post_id}`);
            setShowDeleteDialog(false);
            onPostDeleted(post.post_id);
        } catch (error) {
            alert("Failed to delete post");
            setIsDeleting(false);
        }
    };

    return (
        <Card key={post.post_id} className="w-full max-w-lg mx-auto gap-0 py-0 shadow-none">
            <CardHeader className="-mr-1 flex flex-row items-center justify-between py-2.5">
                <Item className="w-full gap-2.5 p-0">
                    <ItemContent className="gap-0">
                        <ItemTitle>{post.user_id.name}</ItemTitle>
                        <ItemDescription className="text-xs">
                            <Link href={`/post/${post.post_id}`} className="text-muted-foreground hover:text-foreground">
                                Posted on {new Date(post.created_at).toLocaleDateString()}
                            </Link>
                        </ItemDescription>
                    </ItemContent>
                    {isAuthor && (
                        <ItemActions className="-me-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="outline">
                                        <Ellipsis />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="mt-2">
                                    <DropdownMenuItem onClick={handleEdit}>
                                        <NotebookPen /> Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setShowDeleteDialog(true)}
                                        disabled={isDeleting}
                                        className="text-red-500"
                                    >
                                        <Trash /> Delete Post
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </ItemActions>
                    )}
                </Item>
            </CardHeader>
            <CardContent className="p-0">
                <div className="px-6 py-5">
                    <h2 className="font-semibold">{post.title}</h2>
                    <p className="mt-1 text-muted-foreground text-sm">
                        {post.content}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex border-t px-2 py-2! pb-0">
                <Button className="shrink-0 grow text-muted-foreground" variant="ghost">
                    <HeartIcon /> <span className="hidden sm:inline">Like</span>
                </Button>
                <Button className="shrink-0 grow text-muted-foreground" variant="ghost">
                    <MessageCircleIcon />
                    <span className="hidden sm:inline">Comment</span>
                </Button>
            </CardFooter>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

export default function PostList() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch posts');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handlePostDeleted = (postId: number) => {
        setPosts(posts.filter(post => post.post_id !== postId));
    };

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <>
            {posts.map((post) => (
                <PostItem key={post.post_id} post={post} onPostDeleted={handlePostDeleted} />
            ))}
        </>
    );
}
