
"use client";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-3xl flex-col items-center gap-3 py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="text-xl font-bold">Login Page</h1>
                <InputGroup>
                    <InputGroupAddon>
                        <MailIcon className="text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                        className="border-0 shadow-none focus-visible:ring-0"
                        placeholder="Email"
                        type="email"
                    />
                </InputGroup>
                {/* </div> */}
                <InputGroup>
                    <InputGroupAddon>
                        <LockIcon className="text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                        className="border-0 shadow-none focus-visible:ring-0"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                    />

                    <InputGroupAddon align="inline-end">
                        <InputGroupButton onClick={togglePasswordVisibility}>
                            {showPassword ? (
                                <EyeOffIcon className="size-4 text-muted-foreground" />
                            ) : (
                                <EyeIcon className="size-4 text-muted-foreground" />
                            )}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
                <Button className="w-full">Log In</Button>
            </main>
        </div>
    )
};
