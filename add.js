
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient('https://srzqmhgdaedfoyakqmpg.supabase.co', 'public-anon-key')

async function uploadImage(file) {
  if (!file) return null
  const fileName = `${Date.now()}_${file.name}`
  const { data, error } = await supabase.storage.from("amulet-images").upload(fileName, file, { upsert: true })
  if (error) return null
  const { data: publicData } = supabase.storage.from("amulet-images").getPublicUrl(fileName)
  return publicData.publicUrl
}

document.addEventListener("DOMContentLoaded", async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    window.location.href = "login.html"
    return
  }

  document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault()
    const name = document.getElementById("name").value.trim()
    const price = document.getElementById("price").value.trim()
    const description = document.getElementById("description").value.trim()
    const file = document.getElementById("image1").files[0]
    const image_url = await uploadImage(file)

    const { error } = await supabase.from("amulets").insert([
      { name, price, description, image_url1: image_url, user_id: user.id, created_at: new Date().toISOString() }
    ])
    if (!error) {
      alert("✅ บันทึกสำเร็จแล้ว!")
      document.getElementById("add-form").reset()
    }
  })

  document.getElementById("logout").addEventListener("click", async () => {
    await supabase.auth.signOut()
    window.location.href = "login.html"
  })
})
