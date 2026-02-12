export default function DocumentPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">文档阅读</h1>
        <div className="border rounded-lg p-8 text-center text-gray-500">
          {/* MarkdownRenderer 组件将由 Agent-2 实现 */}
          <p>文档渲染组件 - 待实现</p>
          <p className="text-sm mt-2">将使用 react-markdown + remark-gfm 实现</p>
        </div>
      </div>
    </main>
  )
}
