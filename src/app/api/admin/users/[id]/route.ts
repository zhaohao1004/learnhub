import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { UpdateUserRequest } from '@/types'

// 更新用户
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()
    const body: UpdateUserRequest = await request.json()

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

    // 更新 profile
    const updateData: Record<string, unknown> = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.role !== undefined) updateData.role = body.role
    if (body.status !== undefined) updateData.status = body.status

    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // 如果需要重置密码
    if (body.password) {
      const { error: passwordError } = await adminSupabase.auth.admin.updateUserById(id, {
        password: body.password,
      })
      if (passwordError) {
        return NextResponse.json({ error: passwordError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ user: profile })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}

// 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // 不能删除自己
    if (id === authUser.id) {
      return NextResponse.json({ error: '不能删除自己的账号' }, { status: 400 })
    }

    // 删除用户（会级联删除 profile）
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    )
  }
}
