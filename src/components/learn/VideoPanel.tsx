'use client'

import { VideoPlayer } from '@/components/video'
import type { Video, VideoProgress } from '@/types'

interface VideoPanelProps {
  video: Video
  onProgress?: (progress: VideoProgress) => void
  initialTime?: number
}

export default function VideoPanel({
  video,
  onProgress,
  initialTime,
}: VideoPanelProps) {
  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* 面板标题栏 */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
        <svg
          className="w-5 h-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span className="text-sm font-medium text-gray-200">视频课程</span>
      </div>

      {/* 视频播放器 */}
      <div className="flex-1 overflow-hidden">
        <VideoPlayer
          video={video}
          onProgress={onProgress}
          initialTime={initialTime}
        />
      </div>
    </div>
  )
}
