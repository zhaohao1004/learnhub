'use client'

import { VideoPlayer } from '@/components/video'
import type { Video, VideoProgress } from '@/types'

// Demo 视频数据
const demoVideo: Video = {
  id: 'demo-1',
  title: 'Big Buck Bunny - 测试视频',
  description: '这是一个用于测试视频播放器的示例视频',
  url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
  duration: 10,
  thumbnail: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
}

export default function VideoPage() {
  const handleProgress = (progress: VideoProgress) => {
    console.log('Video Progress:', progress)
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">视频播放</h1>

        {/* 视频播放器 */}
        <VideoPlayer
          video={demoVideo}
          onProgress={handleProgress}
          initialTime={0}
        />

        {/* 功能说明 */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">功能说明</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
              点击视频区域或播放按钮控制播放/暂停
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
              拖拽进度条跳转到指定位置
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
              点击快进/快退按钮跳转 10 秒
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
              鼠标悬停在音量图标上调节音量
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
              点击倍速按钮选择 0.5x / 1x / 1.5x / 2x 播放速度
            </li>
          </ul>
        </div>

        {/* 其他视频源示例 */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">技术栈</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              react-player
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              React Hooks
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Tailwind CSS
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              TypeScript
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
