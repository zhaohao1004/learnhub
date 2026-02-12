'use client'

import { useCallback, useRef, useState, useEffect } from 'react'

interface VideoControlsProps {
  playing: boolean
  played: number
  playedSeconds: number
  duration: number
  volume: number
  playbackRate: number
  onPlayPause: () => void
  onSeek: (seconds: number) => void
  onSeekMouseDown: () => void
  onSeekMouseUp: (value: number) => void
  onVolumeChange: (volume: number) => void
  onPlaybackRateChange: (rate: number) => void
  onForward: () => void
  onBackward: () => void
}

const PLAYBACK_RATES = [0.5, 1, 1.5, 2]

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function VideoControls({
  playing,
  played,
  playedSeconds,
  duration,
  volume,
  playbackRate,
  onPlayPause,
  onSeek,
  onSeekMouseDown,
  onSeekMouseUp,
  onVolumeChange,
  onPlaybackRateChange,
  onForward,
  onBackward,
}: VideoControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showRateMenu, setShowRateMenu] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const rateMenuRef = useRef<HTMLDivElement>(null)

  // 关闭倍速菜单当点击外部时
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rateMenuRef.current && !rateMenuRef.current.contains(event.target as Node)) {
        setShowRateMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration === 0) return
      const rect = progressRef.current.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      onSeek(pos * duration)
    },
    [duration, onSeek]
  )

  const handleProgressDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return
      handleProgressClick(e)
    },
    [handleProgressClick]
  )

  return (
    <div className="bg-gray-900 text-white px-4 py-3 rounded-b-lg">
      {/* 进度条 */}
      <div
        ref={progressRef}
        className="relative h-1 bg-gray-600 rounded cursor-pointer mb-3 group"
        onClick={handleProgressClick}
        onMouseDown={onSeekMouseDown}
        onMouseUp={() => onSeekMouseUp(played)}
        onMouseMove={handleProgressDrag}
      >
        <div
          className="absolute h-full bg-blue-500 rounded"
          style={{ width: `${played * 100}%` }}
        />
        <div
          className="absolute h-3 w-3 bg-white rounded-full -top-1 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${played * 100}%` }}
        />
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-between">
        {/* 左侧控制 */}
        <div className="flex items-center space-x-4">
          {/* 快退 */}
          <button
            onClick={onBackward}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="快退 10 秒"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>

          {/* 播放/暂停 */}
          <button
            onClick={onPlayPause}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title={playing ? '暂停' : '播放'}
          >
            {playing ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* 快进 */}
          <button
            onClick={onForward}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="快进 10 秒"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
            </svg>
          </button>

          {/* 时间显示 */}
          <span className="text-sm text-gray-300">
            {formatTime(playedSeconds)} / {formatTime(duration)}
          </span>
        </div>

        {/* 右侧控制 */}
        <div className="flex items-center space-x-4">
          {/* 音量控制 */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title={volume > 0 ? '静音' : '取消静音'}
            >
              {volume === 0 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : volume < 0.5 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            {/* 音量滑块 */}
            <div
              className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 rounded transition-opacity ${
                showVolumeSlider ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 accent-blue-500"
                style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
              />
            </div>
          </div>

          {/* 倍速控制 */}
          <div className="relative" ref={rateMenuRef}>
            <button
              onClick={() => setShowRateMenu(!showRateMenu)}
              className="px-3 py-1 hover:bg-gray-700 rounded transition-colors text-sm font-medium"
              title="播放速度"
            >
              {playbackRate}x
            </button>

            {/* 倍速菜单 */}
            {showRateMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded shadow-lg overflow-hidden">
                {PLAYBACK_RATES.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      onPlaybackRateChange(rate)
                      setShowRateMenu(false)
                    }}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                      playbackRate === rate ? 'bg-blue-500 text-white' : 'text-gray-300'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
