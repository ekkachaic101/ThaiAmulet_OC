const SUPABASE_URL = "https://labxpswxsaqzlubzqaoy.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y9rCpK1TISgMhRauvQLBSg_xpK4Mka2";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("add-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  const images = [];
  for (let i = 1; i <= 4; i++) {
    const file = document.getElementById(`image${i}`).files[0];
    if (file) {
      const { data, error } = await supabase.storage
        .from("amulet_images")
        .upload(`public/${Date.now()}-${file.name}`, file, {
          cacheControl: "3600",
          upsert: true,
        });
      if (error) {
        alert(`❌ อัปโหลดรูปภาพ ${i} ล้มเหลว: ${error.message}`);
        return;
      }
      images.push(data.path);
    }
  }

  const { error } = await supabase.from("amulets").insert([
    { name, price, description, image_urls: images },
  ]);
  if (error) {
    alert(`❌ บันทึกข้อมูลล้มเหลว: ${error.message}`);
  } else {
    alert("✅ บันทึกข้อมูลสำเร็จ!");
    document.getElementById("add-form").reset();
  }
});
