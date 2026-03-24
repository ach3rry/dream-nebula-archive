"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Menu, X, Sparkles, Archive, User } from "lucide-react"

const navLinks = [
  { name: "档案探索", href: "#archive", icon: Archive },
  { name: "我的梦境", href: "#dreams", icon: User },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
                <div className="absolute inset-0 blur-lg bg-primary/30 group-hover:bg-secondary/30 transition-colors duration-300" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] group-hover:animate-border-flow">
                Dream Nebula Archive
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-primary/10 hover:border-primary/30",
                    "border border-transparent",
                    "transition-all duration-300"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-48" : "max-h-0"
          )}
        >
          <div className="px-4 py-3 space-y-2 border-t border-border">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-primary/10",
                  "transition-colors duration-300"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
