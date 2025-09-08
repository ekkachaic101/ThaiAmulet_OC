
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
  const table = document.createElement("table");
  table.border = "1";
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  table.innerHTML = `
    <thead>
      <tr style="background-color:#f7e49b;">
        <th>ชื่อพระ</th>
        <th>ภาพด้านหน้า</th>
        <th>ภาพด้านหลัง</th>
        <th>ราคา</th>
        <th>คำอธิบาย</th>
        <th>จัดการ</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  if (data.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" style="text-align:center; padding:20px;">ไม่มีข้อมูลพระเครื่องในระบบ</td>`;
    tbody.appendChild(row);
  }

  data.forEach((amulet) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${amulet.name}</td>
      <td><img src="${amulet.image_url1}" width="100"></td>
      <td><img src="${amulet.image_url2}" width="100"></td>
      <td>${amulet.price}</td>
      <td>${amulet.description}</td>
      <td>
        <button onclick="editAmulet('${amulet.id}')">✏️</button>
        <button onclick="deleteAmulet('${amulet.id}')">🗑️</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  container.appendChild(table);
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
