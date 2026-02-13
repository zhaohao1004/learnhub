'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import UserMenu from '@/components/auth/UserMenu'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          LearnHub
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/learn" className="text-sm hover:underline">
            课程
          </Link>
          <ThemeToggle />
          <UserMenu />
        </nav>
      </div>
    </header>
  )
}
