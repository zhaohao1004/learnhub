'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, MoreVertical, Shield, User as UserIcon, Ban, CheckCircle } from 'lucide-react'
import UserForm from './UserForm'
import type { Profile, CreateUserRequest, UpdateUserRequest } from '@/types'

type UserFormData = CreateUserRequest | UpdateUserRequest

export default function UserList() {
  const [users, setUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 获取用户列表
  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '获取用户列表失败')
      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户列表失败')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 创建用户
  const handleCreate = async (userData: UserFormData) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '创建用户失败')
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      throw err
    }
  }

  // 更新用户
  const handleUpdate = async (userData: UserFormData) => {
    if (!editingUser) return
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '更新用户失败')
      setEditingUser(null)
      fetchUsers()
    } catch (err) {
      throw err
    }
  }

  // 删除用户
  const handleDelete = async (userId: string) => {
    if (!confirm('确定要删除此用户吗？此操作不可撤销。')) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '删除用户失败')
      fetchUsers()
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除用户失败')
    }
  }

  // 过滤用户列表
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索用户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加用户
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 用户表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  最后登录
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    暂无用户数据
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user.name || '未设置姓名'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300 rounded">
                          <Shield className="w-3 h-3" />
                          管理员
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">
                          <UserIcon className="w-3 h-3" />
                          普通用户
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded">
                          <CheckCircle className="w-3 h-3" />
                          正常
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded">
                          <Ban className="w-3 h-3" />
                          禁用
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString('zh-CN')
                        : '从未登录'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建用户表单 */}
      {showForm && (
        <UserForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* 编辑用户表单 */}
      {editingUser && (
        <UserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  )
}
