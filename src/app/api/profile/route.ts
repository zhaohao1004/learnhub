import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface UpdateProfileRequest {
  name?: string
  avatar?: string
}

// 更新当前用户的个人信息
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 验证用户身份
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body: UpdateProfileRequest = await request.json()

    // 构建更新对象，只更新提供的字段
    const updates: Record<string, string | null> = {}
    if (body.name !== undefined) {
      updates.name = body.name || null
    }
    if (body.avatar !== undefined) {
      updates.avatar = body.avatar || null
    }

    // 如果没有要更新的字段，返回成功
    if (Object.keys(updates).length === 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()
      return NextResponse.json({ profile })
    }

    // 更新 profiles 表
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authUser.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}

// 获取当前用户的个人信息
export async function GET() {
  try {
    const supabase = await createClient()

    // 验证用户身份
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 获取 profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}
