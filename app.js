// app.js
const { createClient } = supabase;

// ใช้ค่า Project URL + anon key ของคุณ
const SUPABASE_URL = "https://srzqmhgdaedfoyakqmpg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyenFtaGdkYWVkZm95YWtxbXBnIiwicm9sZSI6ImFub3..."
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ฟังก์ชันเพิ่มพระเครื่องพร้อมอัปโหลดรูป 4 รูป
async function uploadImage(file) {
  if (!file) return null;
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabaseClient.storage
    .from("amulet-images")       // Bucket ที่คุณสร้าง
    .upload(fileName, file);
  if (error) {
    console.error("Upload Error:", error);
    return null;
  }
  const { data: { publicUrl } } = supabaseClient.storage
    .from("amulet-images")
    .getPublicUrl(fileName);
  return publicUrl;
}

async function addAmulet() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const description = document.getElementById("description").value.trim();

  const files = [
    document.getElementById("image1").files[0],
    document.getElementById("image2").files[0],
    document.getElementById("image3").files[0],
    document.getElementById("image4").files[0]
  ];

  if (!name || !price || !files[0]) {
    alert("กรุณากรอกชื่อพระ, ราคา และเลือกรูปภาพอย่างน้อย 1 รูป");
    return;
  }

  try {
    const image_urls = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        const url = await uploadImage(files[i]);
        if (url) image_urls.push(url);
      }
    }

    const { error } = await supabaseClient.from("amulets").insert([{
      name,
      price,
      description,
      image_url1: image_urls[0] || null,
      image_url2: image_urls[1] || null,
      image_url3: image_urls[2] || null,
      image_url4: image_urls[3] || null
    }]);

    if (error) throw error;
    alert("✅ บันทึกสำเร็จแล้ว!");
    document.getElementById("add-form").reset();

  } catch (err) {
    console.error(err);
    alert("❌ เกิดข้อผิดพลาด: " + err.message);
  }
}
