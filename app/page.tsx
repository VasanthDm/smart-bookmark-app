"use client"

import { supabase } from "@/lib/supabaseClient"

export default function Home() {

  const login = async () => {
    alert(window.location.origin);
    
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}`
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
