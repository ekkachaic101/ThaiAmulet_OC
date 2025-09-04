
const supabaseUrl = 'https://srzqmhgdaedfoyakqmpg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyenFtaGdkYWVkZm95YWtxbXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzU0MTUsImV4cCI6MjA3MjMxMTQxNX0.rs0m4ibkOPvWADs7iLdgDxCLAnwS_Ko6PtHtvyugTsQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadAmulets() {
  const { data, error } = await supabase.from('amulets').select('*');
  if (error) {
    console.error('Error loading amulets:', error);
    return;
  }
  const grid = document.getElementById("product-grid");
  grid.innerHTML = '';
  data.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description || ''}</p>
      <strong>${product.price}</strong><br>
      <button onclick="showEditForm(${product.id}, '${product.name}', '${product.image_url}', '${product.price}', '${product.description || ''}')">✏️ แก้ไข</button>
      <button onclick="deleteAmulet(${product.id})">🗑️ ลบ</button>
    `;
    grid.appendChild(card);
  });
}

function showAddForm() {
  document.getElementById("add-form").style.display = "block";
}

async function addAmulet() {
  const name = document.getElementById("name").value;
  const image_url = document.getElementById("image_url").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const { error } = await supabase.from('amulets').insert([{ name, image_url, price, description }]);
  if (error) {
    alert("เกิดข้อผิดพลาดในการเพิ่มพระ: " + error.message);
  } else {
    alert("เพิ่มพระเครื่องเรียบร้อยแล้ว");
    loadAmulets();
    document.getElementById("add-form").reset();
    document.getElementById("add-form").style.display = "none";
  }
}

function showEditForm(id, name, image_url, price, description) {
  const form = document.createElement("div");
  form.innerHTML = `
    <h4>แก้ไขพระเครื่อง</h4>
    <input type="text" id="edit-name" value="${name}">
    <input type="text" id="edit-image_url" value="${image_url}">
    <input type="text" id="edit-price" value="${price}">
    <input type="text" id="edit-description" value="${description}">
    <button onclick="updateAmulet(${id})">💾 บันทึก</button>
  `;
  const grid = document.getElementById("product-grid");
  grid.innerHTML = '';
  grid.appendChild(form);
}

async function updateAmulet(id) {
  const name = document.getElementById("edit-name").value;
  const image_url = document.getElementById("edit-image_url").value;
  const price = document.getElementById("edit-price").value;
  const description = document.getElementById("edit-description").value;
  const { error } = await supabase.from('amulets').update({ name, image_url, price, description }).eq('id', id);
  if (error) {
    alert("แก้ไขไม่สำเร็จ: " + error.message);
  } else {
    alert("บันทึกการแก้ไขเรียบร้อยแล้ว");
    loadAmulets();
  }
}

async function deleteAmulet(id) {
  if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบพระเครื่องนี้?")) {
    const { error } = await supabase.from('amulets').delete().eq('id', id);
    if (error) {
      alert("ลบไม่สำเร็จ: " + error.message);
    } else {
      alert("ลบเรียบร้อยแล้ว");
      loadAmulets();
    }
  }
}

loadAmulets();
