'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AppContextProvider';

export default function Me() {
    const router = useRouter();
    const { user, loading, isAuthenticated, logout } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <main className="flex min-h-screen w-full flex-col items-center gap-3 py-32 px-16 bg-white dark:bg-black sm:items-start">
                    <p>Loading your profile...</p>
                </main>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null; // Redirecting to login
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full flex-col items-center gap-6 py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="text-2xl font-bold">Your Profile</h1>
                
                <div className="w-full max-w-md space-y-4">
                    <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                        <p className="text-lg font-semibold">{user.name}</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-lg font-semibold">{user.email}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </main>
        </div>
    );
}
