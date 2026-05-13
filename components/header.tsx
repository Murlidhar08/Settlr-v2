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

const Header = ({ title, isProfile, leftAction }: HeaderProps) => {
  const { toggleMenu } = useNav()
  const showProfile = isProfile ?? true

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 flex items-center justify-between bg-background/80 dark:bg-background/60 backdrop-blur-xl px-6 py-4 border-b border-border/90 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center gap-4">
        <Menu className="cursor-pointer lg:hidden" onClick={toggleMenu} />

        {leftAction ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            {leftAction}
            <h1 className="text-xl font-black tracking-tight lg:text-3xl bg-linear-to-br from-foreground to-primary/80 bg-clip-text text-transparent">{title}</h1>
          </motion.div>
        ) : (
          <div className="flex items-center gap-4">
            <motion.div
              layoutId="header-title"
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <h1 className="text-xl font-black tracking-normal sm:text-2xl lg:text-3xl bg-linear-to-br from-foreground to-primary/80 bg-clip-text text-transparent">
                {title}
              </h1>
            </motion.div>
          </div>
        )}
      </div>

      {/* Profile Container */}
      {showProfile && (
        <ProfileAvatar />
      )}
    </motion.header>
  )
}

export { Header }

