"use client";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, CircleUser } from "lucide-react";
import { useState } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AppContextProvider";
import { useRouter } from "next/navigation";

export default function Register() {

    const router = useRouter();
    const { register, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            await register(name, email, password, confirmPassword);
            // Redirect to /me after successful registration
            router.push("/me");
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-3xl flex-col items-center gap-3 py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="text-xl font-bold">Registration Page</h1>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                    <InputGroup>
                        <InputGroupAddon>
                            <CircleUser className="text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            className="border-0 shadow-none focus-visible:ring-0"
                            placeholder="John Doe"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <MailIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            className="border-0 shadow-none focus-visible:ring-0"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </InputGroup>
                    {/* PW */}
                    <InputGroup>
                        <InputGroupAddon>
                            <LockIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            className="border-0 shadow-none focus-visible:ring-0"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                    {/* CPW */}
                    <InputGroup>
                        <InputGroupAddon>
                            <LockIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            className="border-0 shadow-none focus-visible:ring-0"
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <InputGroupAddon align="inline-end">
                            <InputGroupButton onClick={toggleConfirmPasswordVisibility}>
                                {showConfirmPassword ? (
                                    <EyeOffIcon className="size-4 text-muted-foreground" />
                                ) : (
                                    <EyeIcon className="size-4 text-muted-foreground" />
                                )}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button disabled={isLoading} className="w-full">
                        {isLoading ? "Creating account..." : "Register"}
                    </Button>
                </form>
            </main>
        </div>
    )
};
