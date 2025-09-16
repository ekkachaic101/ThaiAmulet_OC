
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://srzqmhgdaedfoyakqmpg.supabase.co',
  'public-anon-key'
)

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout")
  if (!logoutBtn) {
    console.warn("ไม่พบปุ่มออกจากระบบ (id='logout')")
    return
  }

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault()

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        alert("❌ ออกจากระบบไม่สำเร็จ: " + error.message)
      } else {
        window.location.href = "index.html"
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err)
      alert("❌ เกิดข้อผิดพลาดในการออกจากระบบ")
    }
  })
})
