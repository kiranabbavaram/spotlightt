
"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Share2, Menu } from 'lucide-react'
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useState } from "react"

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      navigate("/auth")
    } catch (error) {
      toast.error("Error signing out")
    }
  }

  const navItems = [
    { name: "Features", path: "/features" },
    { name: "Examples", path: "/examples" },
    { name: "Pricing", path: "/pricing" },
  ]

  const fadeInVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
  }

  const staggerMenuItems = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        staggerChildren: 0.05,
      }
    }
  }

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center text-sm font-medium tracking-tight text-black transition-opacity hover:opacity-80"
          >
            <span className="mr-1.5 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">✦</span> 
            <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent font-semibold">
              Spotlight
            </span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <motion.li 
                  key={item.name}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="text-xs text-gray-600 transition-colors hover:text-black"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-1 rounded-md" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={18} />
        </button>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial="hidden" 
            animate="visible"
            variants={staggerMenuItems}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 md:hidden z-50 shadow-sm"
          >
            <div className="px-4 py-3">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <motion.li key={item.name} variants={menuItemVariants}>
                    <Link
                      to={item.path}
                      className="block text-sm text-gray-600 hover:text-black py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="soft"
                size="pill"
                onClick={() => navigate(`/portfolio/${user.id}`)}
                className="hidden h-8 items-center gap-1.5 border-gray-200 px-3 text-xs hover:bg-gray-100 sm:flex"
              >
                <Share2 size={12} />
                <span>View Portfolio</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-7 w-7 overflow-hidden rounded-full border border-gray-200 p-0 shadow-none transition-all duration-200 hover:border-gray-300 hover:shadow-sm focus-visible:ring-1 focus-visible:ring-black"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                      <AvatarFallback className="bg-gray-50 text-xs font-medium text-black">
                        {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-md border border-gray-200 shadow-sm">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-medium leading-none">{profile?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="rounded-sm text-xs hover:bg-gray-50 hover:text-black"
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/profile")}
                    className="rounded-sm text-xs hover:bg-gray-50 hover:text-black"
                  >
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-sm text-xs text-gray-700 hover:bg-gray-50 hover:text-black"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="pill"
                onClick={() => navigate("/auth")}
                className="hidden h-8 px-3 text-xs font-normal text-gray-600 hover:bg-gray-50 hover:text-black md:inline-flex"
              >
                Log in
              </Button>
              <Button
                size="pill"
                variant="soft"
                onClick={() => navigate("/auth")}
                className="h-8 bg-black px-3 text-xs font-medium text-white hover:bg-gray-800"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
