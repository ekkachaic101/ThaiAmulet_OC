
const SUPABASE_URL = "https://labxpswxsaqzlubzqaoy.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y9rCpK1TISgMhRauvQLBSg_xpK4Mka2";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadAmulets() {
  const { data, error } = await supabase.from("amulets").select("*");

  if (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
    return;
  }

  const container = document.getElementById("product-grid");
  data.forEach((amulet) => {
    const card = document.createElement("div");
    card.className = "product-card";

    // รวมภาพทั้งหมด
    const images = [amulet.image_url1, amulet.image_url2, amulet.image_url3, amulet.image_url4]
      .filter(url => url)
      .map(url => `<img src="${url}" alt="${amulet.name}">`)
      .join("");

    card.innerHTML = `
      ${images}
      <h3>${amulet.name}</h3>
      <p>ราคา: ${amulet.price}</p>
      <p>${amulet.description}</p>
      <button onclick="editAmulet('${amulet.id}')">✏️ แก้ไข</button>
      <button onclick="deleteAmulet('${amulet.id}')">🗑️ ลบ</button>
    `;

    container.appendChild(card);
  });
}

// ฟังก์ชันลบพระเครื่อง
async function deleteAmulet(id) {
  if (!confirm("คุณต้องการลบพระเครื่องนี้ใช่หรือไม่?")) return;

  const { error } = await supabase.from("amulets").delete().eq("id", id);

  if (error) {
    alert("เกิดข้อผิดพลาดในการลบ: " + error.message);
  } else {
    alert("✅ ลบสำเร็จแล้ว");
    location.reload();
  }
}

// ฟังก์ชันแก้ไข (นำไปหน้าแก้ไขในอนาคต)
function editAmulet(id) {
  alert("ฟังก์ชันแก้ไขยังไม่เปิดใช้งาน");
  // location.href = `edit.html?id=${id}`;
}

loadAmulets();
