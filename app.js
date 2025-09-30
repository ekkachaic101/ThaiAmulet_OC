document.getElementById("add-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = document.getElementById("name").value.trim()
  const price = document.getElementById("price").value.trim()
  const description = document.getElementById("description").value.trim()
const category = document.getElementById("category").value.trim()

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
      console.log(`Image ${i + 1} URL:`, url) // ✅ เพิ่มตรวจสอบ
      image_urls.push(url || null)
    }

    const { error } = await supabase.from("amulets").insert([
      {
        name,
        price,
        description,
category,
        image_url1: image_urls[0],
        image_url2: image_urls[1],
        image_url3: image_urls[2],
        image_url4: image_urls[3],
        created_at: new Date().toISOString(),
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
