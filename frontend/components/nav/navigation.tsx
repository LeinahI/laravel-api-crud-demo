"use client";
import { Key, Home, NotebookPen, Search } from "lucide-react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();
    const navigationMenuItems = [
        { title: "Home", href: "/", icon: Home },
        { title: "Login", href: "/login", icon: Key },
        { title: "Register", href: "/register", icon: NotebookPen },
        { title: "Search", href: "#", icon: Search },
    ];

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
            </NavigationMenuList>
        </NavigationMenu>
    </div>)
};
