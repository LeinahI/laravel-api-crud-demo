import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Post({name, title, content}: {name?: string; title?: string; content?: string}) {
    return (
        <Card className="mx-auto w-full max-w-lg">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Post by {name}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    {content}
                </p>
            </CardContent>
        </Card>
    )
};
