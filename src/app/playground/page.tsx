export default function PlaygroundPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">代码练习</h1>
        <div className="border rounded-lg p-8 text-center text-gray-500">
          {/* CodeEditor 组件将由 Agent-3 实现 */}
          <p>代码编辑器组件 - 待实现</p>
          <p className="text-sm mt-2">将使用 Monaco Editor + Pyodide 实现</p>
        </div>
      </div>
    </main>
  )
}
