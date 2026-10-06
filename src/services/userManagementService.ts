import pb from '@/lib/pocketbase/client'

export interface AdminUserItem {
  id: string
  email: string
  name?: string
  role: 'admin' | 'user' | string
  verified: boolean
  is_active: boolean
  created: string
  updated: string
}

export interface ListUsersResponse {
  success: boolean
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: AdminUserItem[]
  message?: string
}

export interface CreateUserData {
  email: string
  password: string
  name?: string
  role?: 'admin' | 'user'
  verified?: boolean
  is_active?: boolean
}

export interface UpdateUserData {
  email?: string
  name?: string
  role?: 'admin' | 'user'
  verified?: boolean
  is_active?: boolean
}

export const UserManagementService = {
  // Listar usuários via endpoint administrativo protegido em pb_hooks
  async listUsers(options?: {
    page?: number
    perPage?: number
    search?: string
  }): Promise<ListUsersResponse> {
    const page = options?.page ?? 1
    const perPage = options?.perPage ?? 50
    const search = (options?.search ?? '').trim()

    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('perPage', String(perPage))
    if (search) {
      params.set('search', search)
    }

    return pb.send<ListUsersResponse>(`/backend/v1/fac/admin/users?${params.toString()}`, {
      method: 'GET',
    })
  },

  // Criar nova conta
  async createUser(data: CreateUserData): Promise<{
    success: boolean
    message: string
    user?: AdminUserItem
  }> {
    return pb.send<{
      success: boolean
      message: string
      user?: AdminUserItem
    }>('/backend/v1/fac/admin/users', {
      method: 'POST',
      body: data,
    })
  },

  // Editar conta existente
  async updateUser(
    id: string,
    data: UpdateUserData,
  ): Promise<{
    success: boolean
    message: string
    user?: AdminUserItem
  }> {
    return pb.send<{
      success: boolean
      message: string
      user?: AdminUserItem
    }>(`/backend/v1/fac/admin/users/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: data,
    })
  },

  // Redefinir senha da conta diretamente (sem senha antiga)
  async resetPassword(
    id: string,
    newPassword: string,
  ): Promise<{
    success: boolean
    message: string
  }> {
    return pb.send<{
      success: boolean
      message: string
    }>(`/backend/v1/fac/admin/users/${encodeURIComponent(id)}/reset-password`, {
      method: 'POST',
      body: { password: newPassword },
    })
  },

  // Excluir conta permanentemente
  async deleteUser(id: string): Promise<{
    success: boolean
    message: string
  }> {
    return pb.send<{
      success: boolean
      message: string
    }>(`/backend/v1/fac/admin/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },
}
