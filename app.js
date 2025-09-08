import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = "https://srzqmhgdaedfoyakqmpg.supabase.co"
const SUPABASE_KEY = "sb_publishable_Y9rCpK1TISgMhRauvQLBSg_xpK4Mka2"
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function generateFilename(originalName) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split('.').pop()
  return `public/${timestamp}_${random}.${ext}`
}

async function uploadImage(file) {
  if (!file) return null
  const fileName = generateFilename(file.name)

  const { data, error } = await supabase.storage
    .from("amulet-images")
    .upload(fileName, file, { upsert: true })

  if (error) {
    console.error("Upload error:", error.message)
    return null
  }

  const { data: publicData } = supabase.storage
    .from("amulet-images")
    .getPublicUrl(fileName)

  return publicData.publicUrl
}

document.getElementById("add-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = document.getElementById("name").value.trim()
  const price = document.getElementById("price").value.trim()
  const description = document.getElementById("description").value.trim()

  const files = [
    document.getElementById("image1").files[0],
    document.getElementById("image2").files[0],
    document.getElementById("image3").files[0],
    document.getElementById("image4").files[0],
  ]

  if (!name || !price || !files[0]) {
    alert("กรุณากรอกชื่อพระ, ราคา และเลือกรูปอย่างน้อย 1 รูป")
    return
  }

  try {
    const image_urls = []

    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i])
      image_urls.push(url || null)
    }

    const { error } = await supabase.from("amulets").insert([
      {
        name,
        price,
        description,
        image_url1: image_urls[0],
        image_url2: image_urls[1],
        image_url3: image_urls[2],
        image_url4: image_urls[3],
      },
    ])

    if (error) throw error

    alert("✅ บันทึกสำเร็จแล้ว!")
    document.getElementById("add-form").reset()

  } catch (err) {
    console.error("Insert error:", err)
    alert("❌ เกิดข้อผิดพลาด: " + err.message)
  }
})
