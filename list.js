
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = "https://labxpswxsaqzlubzqaoy.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y9rCpK1TISgMhRauvQLBSg_xpK4Mka2";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadAmulets() {
  const { data, error } = await supabase.from("amulets").select("*");

  if (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
    return;
  }

  const container = document.getElementById("amulet-list");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `<p style="text-align:center;">ไม่มีข้อมูลพระเครื่องในระบบ</p>`;
    return;
  }

  data.forEach((amulet) => {
    const card = document.createElement("div");
    card.className = "amulet-card";
    card.innerHTML = `
      <h3>${amulet.name}</h3>
      <div class="images">
        ${amulet.image_url1 ? `<img src="${amulet.image_url1}" width="100">` : ""}
        ${amulet.image_url2 ? `<img src="${amulet.image_url2}" width="100">` : ""}
        ${amulet.image_url3 ? `<img src="${amulet.image_url3}" width="100">` : ""}
        ${amulet.image_url4 ? `<img src="${amulet.image_url4}" width="100">` : ""}
      </div>
      <p><strong>ราคา:</strong> ${amulet.price}</p>
      <p><strong>รายละเอียด:</strong> ${amulet.description}</p>
      <p><strong>เวลา:</strong> ${new Date(amulet.created_at).toLocaleString()}</p>
      <div class="actions">
        <button onclick="editAmulet('${amulet.id}')">✏️ แก้ไข</button>
        <button onclick="deleteAmulet('${amulet.id}')">🗑️ ลบ</button>
      </div>
    `;
    container.appendChild(card);
  });
}

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

function editAmulet(id) {
  alert("ฟังก์ชันแก้ไขยังไม่เปิดใช้งาน");
  // location.href = `edit.html?id=${id}`;
}

loadAmulets();
