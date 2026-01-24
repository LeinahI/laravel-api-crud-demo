"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
    ArrowLeft,
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
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";
import { PostData } from "@/types/post-data";
import { useAuth } from "@/context/AppContextProvider";
import Link from "next/link";

export default function PostDetail() {
    const params = useParams();
    const postId = params.id as string;
    const router = useRouter();
    const { user } = useAuth();
    const [post, setPost] = useState<PostData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get<PostData>(`/posts/${postId}`);
                setPost(res.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch post');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const isAuthor = post && user?.user_id === post.user_id.user_id;

    const handleEdit = () => {
        router.push(`/post/edit/${postId}`);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/posts/${postId}`);
            setShowDeleteDialog(false);
            router.push("/");
        } catch (error) {
            alert("Failed to delete post");
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <p>Loading post...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <div className="text-red-500 text-center p-4">{error}</div>
                <Link href="/" className="text-blue-500 hover:underline flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Posts
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
                <div className="text-center p-4">Post not found</div>
                <Link href="/" className="text-blue-500 hover:underline flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Posts
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
            <Card className="w-full max-w-2xl gap-0 py-0 shadow-none">
                <CardHeader className="-mr-1 flex flex-row items-center justify-between py-2.5">
                    <Item className="w-full gap-2.5 p-0">
                        <ItemContent className="gap-0">
                            <ItemTitle>{post.user_id.name}</ItemTitle>
                            <ItemDescription className="text-xs">{new Date(post.created_at).toLocaleDateString()}</ItemDescription>
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
                        <h2 className="text-2xl font-semibold">{post.title}</h2>
                        <p className="mt-4 text-muted-foreground text-base leading-relaxed">
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

            <Link href="/" className="text-blue-500 hover:underline flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Posts
            </Link>
        </div>
    );
}