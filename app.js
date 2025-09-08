const SUPABASE_URL = "https://labxpswxsaqzlubzqaoy.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y9rCpK1TISgMhRauvQLBSg_xpK4Mka2";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadImage(file) {
  if (!file) return null;
  const fileName = `public/${Date.now()}-${file.name}`;
  console.log("Uploading file:", file.name);
  const { data, error } = await client.storage.from("amulet-images").upload(fileName, file, { upsert: true });
  if (error) { console.error("Upload error:", error); alert("❌ Upload failed: " + error.message); return null; }
  const { data: publicData } = client.storage.from("amulet-images").getPublicUrl(fileName);
  console.log("Uploaded URL:", publicData.publicUrl);
  return publicData.publicUrl;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const description = document.getElementById("description").value.trim();
    const files = [
      document.getElementById("image1").files[0],
      document.getElementById("image2").files[0],
      document.getElementById("image3").files[0],
      document.getElementById("image4").files[0],
    ];
    if (!name || !price || !files[0]) { alert("กรุณากรอกชื่อพระ, ราคา และเลือกรูปอย่างน้อย 1 รูป"); return; }
    try {
      const image_urls = [];
      for (let i = 0; i < files.length; i++) { if (files[i]) { const url = await uploadImage(files[i]); image_urls.push(url); } }
      console.log("Ready to insert:", { name, price, description, image_urls });
      const { error } = await client.from("amulets").insert([{ name, price, description, image_url1: image_urls[0] || null, image_url2: image_urls[1] || null, image_url3: image_urls[2] || null, image_url4: image_urls[3] || null }]);
      if (error) throw error;
      alert("✅ บันทึกสำเร็จแล้ว!"); document.getElementById("add-form").reset();
    } catch (err) { console.error("Insert error:", err); alert("❌ เกิดข้อผิดพลาด: " + err.message); }
  });
});
