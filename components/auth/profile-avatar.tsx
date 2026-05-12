"use client";

import { authClient } from "@/lib/auth/auth-client";
import { getInitials } from "@/utility/commonFunction";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfileAvatar() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const handleRedirect = () => {
        router.push("/settings/profile")
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
        >
            <Avatar
                onClick={handleRedirect}
                className="h-11 w-11 ring-2 ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl cursor-pointer transition-all hover:ring-primary/40"
            >
                <AvatarImage src={session?.user?.image || ''} className="object-cover" />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-black uppercase tracking-widest leading-none bg-linear-to-br from-primary/10 to-transparent">
                    {getInitials(session?.user?.name)}
                </AvatarFallback>
            </Avatar>
        </motion.div>
    )
}