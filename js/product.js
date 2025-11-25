document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  const res = await fetch("data/products.json");
  const products = await res.json();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // наполняем страницу
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-desc").textContent = product.desc;
  document.getElementById("product-price").textContent = `₽ ${product.price.toLocaleString()}`;
  document.getElementById("product-image").src = product.img;

  // добавление в корзину
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(i => i.name === product.name);
    if (existing) existing.qty++;
    else cart.push({ name: product.name, price: product.price, img: product.img, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`✅ ${product.name} добавлен в корзину!`);
  });

  // отзывы
  const reviewForm = document.getElementById("reviewForm");
  const reviewsBlock = document.getElementById("reviews");
  const reviews = JSON.parse(localStorage.getItem(`reviews-${productId}`)) || [];

  function renderReviews() {
    reviewsBlock.innerHTML = "";
    reviews.forEach(r => {
      const el = document.createElement("div");
      el.className = "review bg-light rounded-3 p-2 mb-2";
      el.innerHTML = `<strong>${r.user}</strong><p class="m-0">${r.text}</p>`;
      reviewsBlock.appendChild(el);
    });
  }

  renderReviews();

  reviewForm.addEventListener("submit", e => {
    e.preventDefault();
    const user = document.getElementById("reviewUser").value.trim();
    const text = document.getElementById("reviewText").value.trim();
    if (!user || !text) return;
    reviews.push({ user, text });
    localStorage.setItem(`reviews-${productId}`, JSON.stringify(reviews));
    reviewForm.reset();
    renderReviews();
  });
});
