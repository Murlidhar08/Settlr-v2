"use client"

import { envClient } from "@/lib/env.client";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useNav } from "../providers/nav-provider";
import { TabItem } from "./tab-item";
import { useNavItems } from "./use-nav-items";

const SPRING_TRANSITION = { type: "spring", stiffness: 300, damping: 30 } as const;

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

    return (
        <>
            <motion.aside
                initial={false}
                animate={{
                    width: isMenuOpen ? "100%" : (collapsed ? 80 : 280),
                    x: 0
                }}
                transition={SPRING_TRANSITION}
                className={clsx(
                    "flex flex-col border-sidebar-border/50 transition-colors duration-500",
                    isMenuOpen
                        ? "fixed inset-0 z-100 bg-background/80 backdrop-blur-3xl bg-radial-[at_top_right] from-primary/10 via-transparent to-transparent p-6"
                        : "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex bg-sidebar/70 backdrop-blur-xl text-sidebar-foreground border-r shadow-2xl"
                )}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between lg:justify-start gap-4 shrink-0 lg:px-6 lg:py-5 relative">
                    {isMenuOpen ? (
                        <motion.button
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="h-10 w-10 flex items-center justify-center rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all active:scale-90 mb-8"
                        >
                            <X size={20} />
                        </motion.button>
                    ) : (
                        <div className="absolute top-22 -right-4 z-50">
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="flex items-center justify-center h-8 w-8 rounded-full bg-background border border-sidebar-border text-foreground shadow-xl hover:bg-sidebar-accent transition-all active:scale-90"
                            >
                                <ChevronLeft size={16} className={clsx("transition-transform duration-500", collapsed && "rotate-180")} />
                            </button>
                        </div>
                    )}

                    <Logo collapsed={collapsed} isMenuOpen={isMenuOpen} />
                </div>

                <div className="px-6 mb-2">
                    <div className="h-px w-full bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-50" />
                </div>

                <nav className="flex-1 overflow-y-auto no-scrollbar py-4">
                    <div className={clsx("flex flex-col gap-2", isMenuOpen ? "max-w-md mx-auto" : (collapsed ? "items-center" : "px-3"))}>
                        <AnimatePresence mode="popLayout">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={isMenuOpen ? { opacity: 0, y: 20, scale: 0.95 } : undefined}
                                    animate={isMenuOpen ? { opacity: 1, y: 0, scale: 1 } : undefined}
                                    exit={isMenuOpen ? { opacity: 0, scale: 0.95 } : undefined}
                                    transition={{
                                        ...SPRING_TRANSITION,
                                        delay: isMenuOpen ? index * 0.05 : 0
                                    }}
                                    className="w-full"
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
                        </AnimatePresence>
                    </div>
                </nav>
            </motion.aside>

            {/* Layout Spacer */}
            {!isMenuOpen && (
                <motion.div
                    initial={false}
                    animate={{ width: collapsed ? 80 : 280 }}
                    transition={SPRING_TRANSITION}
                    className="hidden lg:block shrink-0"
                />
            )}
        </>
    );
}

const Logo = ({ collapsed, isMenuOpen }: { collapsed: boolean, isMenuOpen: boolean }) => (
    <div className="flex items-center gap-4">
        <motion.div
            layout
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.25rem] bg-primary/10 border border-primary/20 shadow-inner"
        >
            <Image src="/images/logo/light_logo.svg" alt="Logo" width={28} height={28} className="dark:hidden" />
            <Image src="/images/logo/dark_logo.svg" alt="Logo" width={28} height={28} className="hidden dark:block" />
        </motion.div>

        {(!collapsed || isMenuOpen) && (
            <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={clsx(
                    "hidden lg:block font-black tracking-tight whitespace-nowrap bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent",
                    isMenuOpen ? "text-2xl" : "text-xl"
                )}
            >
                {envClient.NEXT_PUBLIC_APP_NAME}
            </motion.span>
        )}
    </div>
);

function DesktopNavItem({ icon, label, active, collapsed, href, isMenuOpen, onClick }: TabItem & { active: boolean, collapsed: boolean, isMenuOpen: boolean, onClick: () => void }) {
    return (
        <Link
            href={href as any}
            onClick={onClick}
            className={clsx(
                "group relative flex items-center transition-all duration-300 ease-out select-none outline-none",
                isMenuOpen
                    ? "gap-5 rounded-[1.5rem] px-6 h-18 bg-foreground/5 border border-foreground/5 hover:bg-primary/10 hover:border-primary/20"
                    : "gap-4 rounded-2xl h-12 px-4",
                active
                    ? (isMenuOpen
                        ? "bg-linear-to-br from-primary/20 to-primary/5 text-primary border-primary/20 shadow-2xl shadow-primary/10"
                        : "bg-primary text-primary-foreground shadow-xl shadow-primary/20")
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                collapsed ? "justify-center w-12 mx-auto px-0" : "w-full"
            )}
        >
            {/* Active Glow Effect */}
            {active && !isMenuOpen && !collapsed && (
                <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-primary/20 blur-xl opacity-50 rounded-2xl -z-10"
                />
            )}

            <div className={clsx(
                "shrink-0 transition-all duration-300",
                active ? "scale-110" : "group-hover:scale-110 group-active:scale-95",
                isMenuOpen ? "[&>svg]:size-7" : "[&>svg]:size-5"
            )}>
                {icon}
            </div>

            {!collapsed && (
                <span className={clsx(
                    "font-bold whitespace-nowrap tracking-tight transition-colors",
                    isMenuOpen ? "text-xl" : "text-[13px]",
                    active ? "text-inherit" : "text-foreground/60 group-hover:text-foreground"
                )}>
                    {label}
                </span>
            )}

            {/* Compact Tooltip */}
            {collapsed && !isMenuOpen && <Tooltip label={label} />}

            {/* Active Indicator Bar (Desktop Expanded) */}
            {active && !collapsed && !isMenuOpen && (
                <motion.div
                    layoutId="activeBar"
                    className="absolute right-2 w-1.5 h-6 bg-primary-foreground/40 rounded-full"
                />
            )}
        </Link>
    );
}

const Tooltip = ({ label }: { label: string }) => (
    <div className="fixed left-24 z-100 flex items-center opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-150">
        <div className="px-4 py-2 bg-foreground text-background text-[11px] font-black uppercase tracking-widest rounded-xl shadow-2xl relative">
            {label}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-foreground" />
        </div>
    </div>
);
