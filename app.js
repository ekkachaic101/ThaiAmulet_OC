
const products = [
  {
    name: "พระสมเด็จวัดระฆัง",
    description: "พิมพ์ใหญ่ เนื้อผง",
    price: "฿1,200,000",
    image: "https://via.placeholder.com/200x200?text=พระสมเด็จ"
  },
  {
    name: "พระรอดลำพูน",
    description: "กรุวัดมหาวัน",
    price: "฿850,000",
    image: "https://via.placeholder.com/200x200?text=พระรอด"
  }
];

const grid = document.getElementById("product-grid");

products.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <strong>${product.price}</strong>
  `;
  grid.appendChild(card);
});
