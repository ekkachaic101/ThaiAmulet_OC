
// ✅ เชื่อมต่อ Supabase
const supabase = createClient(
  'https://your-project-id.supabase.co',
  'public-anon-key'
);

// ✅ โหลดรายการพระเครื่อง
async function loadAmulets() {
  const { data, error } = await supabase.from('amulets').select('*');
  if (error) {
    console.error('เกิดข้อผิดพลาดในการโหลด:', error);
    return;
  }
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${item.image_url}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p><strong>ราคา:</strong> ${item.price} บาท</p>
      <button onclick="editAmulet(${item.id})">✏️ แก้ไข</button>
      <button onclick="deleteAmulet(${item.id})">🗑️ ลบ</button>
    `;
    grid.appendChild(card);
  });
}

// ✅ เพิ่มพระเครื่อง
async function addAmulet() {
  const name = document.getElementById('name').value;
  const image_url = document.getElementById('image_url').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;

  const { error } = await supabase.from('amulets').insert([
    { name, image_url, price, description }
  ]);

  if (error) {
    alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    console.error(error);
  } else {
    alert('เพิ่มพระเครื่องเรียบร้อยแล้ว');
    loadAmulets();
    document.getElementById('add-form').style.display = 'none';
  }
}

// ✅ ลบพระเครื่อง
async function deleteAmulet(id) {
  const confirmDelete = confirm('คุณต้องการลบพระเครื่องนี้ใช่หรือไม่?');
  if (!confirmDelete) return;

  const { error } = await supabase.from('amulets').delete().eq('id', id);
  if (error) {
    alert('เกิดข้อผิดพลาดในการลบ');
    console.error(error);
  } else {
    alert('ลบเรียบร้อยแล้ว');
    loadAmulets();
  }
}

// ✅ แก้ไขพระเครื่อง
async function editAmulet(id) {
  const newName = prompt('ชื่อพระใหม่:');
  const newPrice = prompt('ราคาที่แก้ไข:');
  const newDescription = prompt('คำอธิบายใหม่:');

  const { error } = await supabase.from('amulets').update({
    name: newName,
    price: newPrice,
    description: newDescription
  }).eq('id', id);

  if (error) {
    alert('เกิดข้อผิดพลาดในการแก้ไข');
    console.error(error);
  } else {
    alert('แก้ไขข้อมูลเรียบร้อยแล้ว');
    loadAmulets();
  }
}

// ✅ แสดงฟอร์มเพิ่มพระ
function showAddForm() {
  document.getElementById('add-form').style.display = 'block';
}

// ✅ โหลดข้อมูลเมื่อเปิดหน้าเว็บ
window.onload = loadAmulets;
