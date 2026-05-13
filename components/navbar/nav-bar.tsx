"use client"

import { envClient } from "@/lib/env.client";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useNav } from "../providers/nav-provider";
import { TabItem } from "./tab-item";
import { useNavItems } from "./use-nav-items";

export default function NavBar({ navItems: propNavItems }: { navItems?: TabItem[] }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { isMenuOpen, setIsMenuOpen } = useNav();
    const defaultNavItems = useNavItems();

    const navItems = useMemo(() =>
        propNavItems?.length ? propNavItems : defaultNavItems,
        [propNavItems, defaultNavItems]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isMenuOpen]);

    const asideClasses = clsx(
        "transition-all duration-500 ease-in-out flex flex-col",
        isMenuOpen
            ? "fixed inset-0 z-[100] bg-background/80 backdrop-blur-3xl bg-radial-[at_top_right] from-primary/10 via-transparent to-transparent p-6"
            : "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl"
    );

    return (
        <>
            <motion.aside
                initial={false}
                animate={{ width: isMenuOpen ? "100%" : (collapsed ? 64 : 256) }}
                className={asideClasses}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between lg:justify-start gap-3 shrink-0 lg:px-5 lg:py-4 relative">
                    {isMenuOpen ? (
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-xl bg-foreground/5 border border-border/50 hover:bg-primary hover:text-primary-foreground transition-all active:scale-90 mb-6"
                        >
                            <X size={18} />
                        </button>
                    ) : (
                        <div className="absolute top-20 -right-4 z-50">
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="flex items-center justify-center h-8 w-8 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground shadow-md hover:bg-sidebar-accent transition-all active:scale-90"
                            >
                                <ChevronLeft size={16} className={clsx("transition-transform duration-500", collapsed && "rotate-180")} />
                            </button>
                        </div>
                    )}

                    <Logo collapsed={collapsed} isMenuOpen={isMenuOpen} />
                </div>

                <div className="px-6 mb-6">
                    <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                </div>

                <nav className="flex-1 overflow-y-auto no-scrollbar">
                    <div className={clsx("flex flex-col gap-1.5 mt-5", isMenuOpen ? "max-w-md mx-auto" : (collapsed ? "items-center" : "px-2"))}>
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={isMenuOpen ? { opacity: 0, x: -10 } : false}
                                animate={isMenuOpen ? { opacity: 1, x: 0 } : false}
                                transition={{ delay: index * 0.03 }}
                            >
                                <DesktopNavItem
                                    {...item}
                                    active={pathname === item.href}
                                    collapsed={collapsed && !isMenuOpen}
                                    isMenuOpen={isMenuOpen}
                                    onClick={() => setIsMenuOpen(false)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </nav>
            </motion.aside>

            {!isMenuOpen &&
                <div className={clsx("hidden lg:block shrink-0 transition-[width] duration-500", collapsed ? "w-16" : "w-64")} />
            }
        </>
    );
}

const Logo = ({ collapsed, isMenuOpen }: { collapsed: boolean, isMenuOpen: boolean }) => (
    <div className="flex items-center gap-3">
        <div className="hidden lg:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent/10">
            <Image src="/images/logo/light_logo.svg" alt="Logo" width={26} height={26} className="dark:hidden" />
            <Image src="/images/logo/dark_logo.svg" alt="Logo" width={26} height={26} className="hidden dark:block" />
        </div>

        {(!collapsed || isMenuOpen) && (
            <span className={clsx("hidden lg:block font-black tracking-tight whitespace-nowrap animate-in fade-in duration-500", isMenuOpen ? "text-2xl" : "text-xl")}>
                {envClient.NEXT_PUBLIC_APP_NAME}
            </span>
        )}
    </div>
);

function DesktopNavItem({ icon, label, active, collapsed, href, isMenuOpen, onClick }: TabItem & { active: boolean, collapsed: boolean, isMenuOpen: boolean, onClick: () => void }) {
    return (
        <Link
            href={href as any}
            onClick={onClick}
            className={clsx(
                "group relative flex items-center transition-all duration-300 ease-out flex-1",
                isMenuOpen ? "gap-4 rounded-2xl px-5 h-16 bg-foreground/5 border border-border/50 hover:bg-primary hover:text-primary-foreground" : "gap-4 rounded-xl h-11 px-4",
                active ? (isMenuOpen ? "bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-[0_10px_40px_rgba(var(--primary),0.25)] scale-[1.02]" : "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg") : "text-sidebar-foreground/60 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
                collapsed ? "justify-center w-12 mx-auto px-0" : "w-full"
            )}
        >
            <div className={clsx("shrink-0 transition-transform duration-300 group-hover:scale-110", active ? (isMenuOpen ? "text-primary-foreground" : "text-sidebar-accent-foreground") : "group-hover:text-sidebar-foreground", isMenuOpen && "[&>svg]:size-6")}>
                {icon}
            </div>
            {!collapsed && (
                <span className={clsx("font-semibold whitespace-nowrap tracking-tight", isMenuOpen ? "text-lg" : "text-sm")}>
                    {label}
                </span>
            )}
            {collapsed && !isMenuOpen && <Tooltip label={label} />}
        </Link>
    );
}

const Tooltip = ({ label }: { label: string }) => (
    <div className="fixed left-20 z-100 flex items-center opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <div className="px-3 py-2 bg-sidebar-accent text-sidebar-accent-foreground text-xs font-bold rounded-lg shadow-2xl relative border border-sidebar-border/20">
            {label}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-sidebar-accent" />
        </div>
    </div>
);
