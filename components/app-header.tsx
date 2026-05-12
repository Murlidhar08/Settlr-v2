"use client";
import { useEffect, useState } from "react";
import { Header } from "./header";

export function AppHeader(props: { title: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="sticky top-0 z-40 flex items-center justify-between bg-background/80 dark:bg-background/60 backdrop-blur-xl px-6 py-4 border-b border-border/90">
                <div className="flex items-center gap-4">
                    {/* Logo area skeleton for mobile */}
                    <div className="h-10 w-10 rounded-xl bg-muted animate-pulse lg:hidden" />
                    {/* Title skeleton */}
                    <div className="h-8 w-32 bg-muted rounded-lg animate-pulse lg:h-10 lg:w-48" />
                </div>
                {/* Profile skeleton */}
                <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
            </header>
        );
    }

    return (
        <Header title={props.title} />
    );
}

