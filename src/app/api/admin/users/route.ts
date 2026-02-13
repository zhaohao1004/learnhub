import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { CreateUserRequest } from '@/types'

// 获取用户列表
export async function GET() {
  try {
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()

    // 验证当前用户是否为管理员
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { data: currentUser } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single()

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 使用 admin client 获取所有用户（绕过 RLS）
    const { data: users, error } = await adminSupabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}

// 创建用户
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()
    const body: CreateUserRequest = await request.json()

    // 验证当前用户是否为管理员
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { data: currentUser } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single()

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 验证必填字段
    if (!body.email || !body.password) {
      return NextResponse.json({ error: '邮箱和密码为必填项' }, { status: 400 })
    }

    // 使用 admin API 创建用户
    const { data: { user: newUser }, error: createError } = await adminSupabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        name: body.name,
        role: body.role || 'user',
      },
    })

    if (createError || !newUser) {
      return NextResponse.json({ error: createError?.message || '创建用户失败' }, { status: 400 })
    }

    // 更新 profile（触发器已创建基础 profile，这里更新角色）
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .update({
        name: body.name || null,
        role: body.role || 'user',
      })
      .eq('id', newUser.id)
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ user: profile })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}
