import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to LearnHub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">
          在线学习平台 - 视频课程、交互式文档和在线编程环境
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/video/demo"
            className="p-6 border rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">视频播放</h2>
            <p className="text-gray-600 dark:text-gray-400">
              观看视频课程，支持播放控制、倍速播放
            </p>
          </Link>

          <Link
            href="/document/demo"
            className="p-6 border rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">文档阅读</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Markdown 文档渲染，代码高亮，目录导航
            </p>
          </Link>

          <Link
            href="/playground"
            className="p-6 border rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">代码练习</h2>
            <p className="text-gray-600 dark:text-gray-400">
              在线编辑运行代码，支持 JS/TS/Python
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
