'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import VideoControls from './VideoControls'
import type { Video, VideoProgress } from '@/types'

// 动态导入 ReactPlayer，禁用 SSR 以避免 hydration 问题
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

// ReactPlayer 类型
type ReactPlayerType = {
  seekTo: (amount: number, type?: 'seconds' | 'fraction') => void
  getCurrentTime: () => number
}

interface VideoPlayerProps {
  video: Video
  onProgress?: (progress: VideoProgress) => void
  initialTime?: number
}

export default function VideoPlayer({
  video,
  onProgress,
  initialTime = 0,
}: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayerType>(null)

  // 播放状态
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [seeking, setSeeking] = useState(false)
  const [ready, setReady] = useState(false)

  // 初始化播放位置
  useEffect(() => {
    if (ready && initialTime > 0 && playerRef.current) {
      playerRef.current.seekTo(initialTime, 'seconds')
    }
  }, [ready, initialTime])

  // 播放进度回调
  const handleProgress = useCallback(
    (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
      if (!seeking) {
        setPlayed(state.played)
        setPlayedSeconds(state.playedSeconds)

        // 触发进度回调
        if (onProgress) {
          onProgress({
            videoId: video.id,
            currentTime: state.playedSeconds,
            completed: state.played >= 0.95,
          })
        }
      }
    },
    [seeking, onProgress, video.id]
  )

  // 视频时长
  const handleDuration = useCallback((duration: number) => {
    setDuration(duration)
  }, [])

  // 视频就绪
  const handleReady = useCallback(() => {
    setReady(true)
  }, [])

  // 播放/暂停
  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => !prev)
  }, [])

  // 跳转
  const handleSeek = useCallback(
    (seconds: number) => {
      if (playerRef.current) {
        playerRef.current.seekTo(seconds, 'seconds')
        setPlayedSeconds(seconds)
        setPlayed(seconds / duration)
      }
    },
    [duration]
  )

  // 进度条拖拽开始
  const handleSeekMouseDown = useCallback(() => {
    setSeeking(true)
  }, [])

  // 进度条拖拽结束
  const handleSeekMouseUp = useCallback(
    (value: number) => {
      setSeeking(false)
      if (playerRef.current) {
        playerRef.current.seekTo(value, 'fraction')
      }
    },
    []
  )

  // 音量调节
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume)
  }, [])

  // 倍速调节
  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate)
  }, [])

  // 快进 10 秒
  const handleForward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime()
      const newTime = Math.min(currentTime + 10, duration)
      playerRef.current.seekTo(newTime, 'seconds')
    }
  }, [duration])

  // 快退 10 秒
  const handleBackward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime()
      const newTime = Math.max(currentTime - 10, 0)
      playerRef.current.seekTo(newTime, 'seconds')
    }
  }, [])

  // 视频结束
  const handleEnded = useCallback(() => {
    setPlaying(false)
    if (onProgress) {
      onProgress({
        videoId: video.id,
        currentTime: duration,
        completed: true,
      })
    }
  }, [onProgress, video.id, duration])

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-xl">
      {/* 视频标题 */}
      <div className="bg-gray-800 px-4 py-3">
        <h2 className="text-lg font-semibold text-white truncate">{video.title}</h2>
        {video.description && (
          <p className="text-sm text-gray-400 mt-1 truncate">{video.description}</p>
        )}
      </div>

      {/* 视频播放器 */}
      <div className="relative aspect-video bg-black">
        <ReactPlayer
          ref={playerRef}
          url={video.url}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onEnded={handleEnded}
          progressInterval={100}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true,
              },
            },
          }}
        />

        {/* 加载状态 */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 点击播放/暂停 */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={handlePlayPause}
        />
      </div>

      {/* 播放控制 */}
      <VideoControls
        playing={playing}
        played={played}
        playedSeconds={playedSeconds}
        duration={duration}
        volume={volume}
        playbackRate={playbackRate}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onSeekMouseDown={handleSeekMouseDown}
        onSeekMouseUp={handleSeekMouseUp}
        onVolumeChange={handleVolumeChange}
        onPlaybackRateChange={handlePlaybackRateChange}
        onForward={handleForward}
        onBackward={handleBackward}
      />
    </div>
  )
}
