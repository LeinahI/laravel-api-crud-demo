"use client";
import { Key, Home, NotebookPen, Search, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AppContextProvider";

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    const navigationMenuItems = [
        { title: "Home", href: "/", icon: Home },
        ...(isAuthenticated ? [
            { title: "Profile", href: "/me", icon: User },
            { title: "Create Post", href: "/post/create", icon: NotebookPen },
        ] : [
            { title: "Login", href: "/login", icon: Key },
            { title: "Register", href: "/register", icon: NotebookPen },
        ]),
        { title: "Search", href: "/search", icon: Search },
    ];

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (<div className="flex w-full flex-col items-center p-4 bg-red-400 dark:bg-black sm:items-start">
        <NavigationMenu>
            <NavigationMenuList>
                {navigationMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <NavigationMenuItem key={item.title}>
                            <NavigationMenuLink
                                active={isActive}
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link
                                    className={`flex-row items-center gap-2.5 ${isActive && "bg-blue-500! text-white!" }`}
                                    href={item.href}
                                >
                                    <item.icon
                                        className={`h-5 w-5 shrink-0 ${isActive && "text-white!" }`}
                                    />
                                    {item.title}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                })}
                {isAuthenticated && (
                    <>
                    <NavigationMenuItem>
                        <button
                            onClick={handleLogout}
                            className={navigationMenuTriggerStyle()}
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            Logout
                        </button>
                    </NavigationMenuItem>
                    </>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    </div>)
};
