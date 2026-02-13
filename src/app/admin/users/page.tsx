import UserList from '@/components/admin/UserList'

export default function UsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          用户管理
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          管理系统用户、分配角色和权限
        </p>
      </div>

      <UserList />
    </div>
  )
}
