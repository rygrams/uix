export const API_URL =
  (import.meta.env['VITE_API_URL'] as string | undefined) ??
  'http://localhost:3000'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string
      code?: string
    } | null
    throw new ApiError(
      response.status,
      body?.message ?? `Request failed (${response.status})`,
      body?.code,
    )
  }

  return response.json() as Promise<T>
}
