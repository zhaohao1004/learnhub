import Link from 'next/link'
import { Users, BookOpen, BarChart3 } from 'lucide-react'

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        管理后台
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/users"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <Users className="w-10 h-10 text-blue-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            用户管理
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            管理系统用户，分配角色权限
          </p>
        </Link>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed">
          <BookOpen className="w-10 h-10 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            课程管理
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            即将推出
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed">
          <BarChart3 className="w-10 h-10 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            数据统计
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            即将推出
          </p>
        </div>
      </div>
    </div>
  )
}
