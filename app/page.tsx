"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { json } from "stream/consumers"

export default function Home() {

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
redirectTo: `${window.location.origin}/auth/callback`
      },
    })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={login}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Login with Google
      </button>
    </div>
  )
}
