"use client"

import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import ProfileAvatar from "./auth/profile-avatar"
import { useNav } from "./providers/nav-provider"

interface HeaderProps {
  title: string
  isProfile?: boolean
  leftAction?: React.ReactNode
}

const SPRING_TRANSITION = { type: "spring", stiffness: 300, damping: 30 } as const;

const Header = ({ title, isProfile, leftAction }: HeaderProps) => {
  const { toggleMenu } = useNav()
  const showProfile = isProfile ?? true

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 flex items-center justify-between bg-background/70 backdrop-blur-2xl px-6 py-5 border-b border-border/50 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="lg:hidden p-2 hover:bg-foreground/5 rounded-xl transition-colors"
          onClick={toggleMenu}
        >
          <Menu size={24} />
        </motion.button>

        {leftAction ? (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            {leftAction}
            <h1 className="text-xl font-black tracking-tight lg:text-3xl bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{title}</h1>
          </motion.div>
        ) : (
          <div className="flex items-center gap-4">
            <motion.div
              layout
              layoutId="header-title"
              transition={SPRING_TRANSITION}
            >
              <h1 className="text-2xl font-black tracking-tight lg:text-3xl bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {title}
              </h1>
            </motion.div>
          </div>
        )}
      </div>

      {/* Profile Container */}
      {showProfile && (
        <motion.div 
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <ProfileAvatar />
        </motion.div>
      )}
    </motion.header>
  )
}

export { Header }

