import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  const response = NextResponse.redirect(`${origin}/dashboard`)

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.headers.get("cookie")?.match(
              new RegExp(`${name}=([^;]+)`)
            )?.[1]
          },
          set(name: string, value: string, options: any) {
            response.cookies.set(name, value, options)
          },
          remove(name: string, options: any) {
            response.cookies.set(name, "", options)
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  return response
}
