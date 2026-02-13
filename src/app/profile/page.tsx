'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { PasswordForm } from '@/components/profile/PasswordForm'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // 未登录状态（等待重定向）
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          个人中心
        </h1>

        <div className="space-y-6">
          <ProfileForm />
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}
