"use client";

import { useSession } from "@/lib/auth/auth-client";
import { tran } from "@/lib/languages/i18n";
import { LandmarkIcon, LayoutDashboard, Settings, User2Icon, UserRoundCog, Wallet } from "lucide-react";
import { TabItem } from "./tab-item";
import { UserRole } from "@/lib/generated/prisma/enums";

export const useNavItems = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === UserRole.admin;

  const navItems: TabItem[] = [
    { id: "dashboard", label: tran("nav.dashboard"), icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { id: "accounts", label: tran("nav.accounts"), icon: <LandmarkIcon size={20} />, href: "/accounts" },
    { id: "parties", label: tran("nav.parties"), icon: <User2Icon size={20} />, href: "/parties" },
    { id: "cashbook", label: tran("nav.cashbook"), icon: <Wallet size={20} />, href: "/cashbook" },
    { id: "settings", label: tran("nav.settings"), icon: <Settings size={20} />, href: "/settings" },
    ...(isAdmin ? [{ id: "admin", label: tran("nav.admin"), icon: <UserRoundCog size={20} />, href: "/admin" }] : []),
  ];

  return navItems;
};