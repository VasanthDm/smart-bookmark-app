"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { isValidUrl } from "@/utils/validators"
import toast from "react-hot-toast"

export default function Dashboard() {

  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const fetchBookmarks = async () => {
    const { data } = await supabase.from("bookmarks").select("*")
    setBookmarks(data || [])
  }

useEffect(() => {
  fetchBookmarks()

  const channel = supabase
    .channel("bookmarks-live")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      (payload) => {
        console.log("Realtime payload:", payload)

        // simplest reliable way
        fetchBookmarks()
      }
    )
    .subscribe((status) => {
      console.log("Realtime status:", status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}, [])



  const addBookmark = async () => {

  if (!title.trim()) {
    toast.error("Title is required")
    return
  }

  if (!url.trim()) {
     toast.error("URL is required")
    return
  }

  if (!isValidUrl(url)) {
     toast.error("Enter a valid URL (https://example.com)")
    return
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from("bookmarks").insert({
    title,
    url,
    user_id: user?.id
  })

  if (!error){
     toast.success("Bookmark successfully added")
fetchBookmarks()
  } 

  setTitle("")
  setUrl("")
}


  const deleteBookmark = async (id: string) => {
    const { error }=await supabase.from("bookmarks").delete().eq("id", id);
    if(!error){
       fetchBookmarks()   
    }
  }

  const logout = async () => {
  await supabase.auth.signOut()
  window.location.href = "/"
}


  return (
    <div className="p-10">
<div className="flex justify-between mb-6">
  <h1 className="text-2xl font-bold">My Bookmarks</h1>

  <button
    onClick={logout}
    className="bg-black text-white px-4 py-2 rounded"
  >
    Logout
  </button>
</div>
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white px-4"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.map((b) => (
          <div key={b.id} className="border p-3 flex justify-between">
            <div>
              <p className="font-semibold">{b.title}</p>
              <a href={b.url} className="text-blue-600">{b.url}</a>
            </div>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
