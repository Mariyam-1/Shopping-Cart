 const apiURL = 'https://fakestoreapi.com/products';
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const totalItems = document.getElementById('totalItems');
    const totalPrice = document.getElementById('totalPrice');
    const cartCount = document.getElementById('cartCount');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    const productDetailModal = document.getElementById('productDetailModal');
    const closeModal = document.querySelector('.closeModal');
    const detailTitle = document.getElementById('detailTitle');
    const detailImage = document.getElementById('detailImage');
    const detailDescription = document.getElementById('detailDescription');
    const detailPrice = document.getElementById('detailPrice');

    let products = [];
    let cart = [];

    async function fetchProducts() {
      const res = await fetch(apiURL);
      products = await res.json();
      renderCategories();
      renderProducts(products);
    }

    function renderCategories() {
      const categories = [...new Set(products.map(p => p.category))];
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
      });
    }

    function renderProducts(productList) {
  productsContainer.innerHTML = '';
  productList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <div class="buttons-container">
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button onclick="showDetails(${product.id})">Details</button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

    function filterProducts() {
      let filtered = [...products];

      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm));
      }

      const category = categoryFilter.value;
      if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }

      const price = priceFilter.value;
      filtered = filtered.filter(p => {
        if (price === 'low') return p.price < 50;
        if (price === 'mid') return p.price >= 50 && p.price <= 100;
        if (price === 'high') return p.price > 100;
        return true;
      });

      renderProducts(filtered);
    }

    function addToCart(id) {
      const product = products.find(p => p.id === id);
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty++;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      updateCart();
    }

    function removeFromCart(id) {
      cart = cart.filter(item => item.id !== id);
      updateCart();
    }

    function changeQty(id, delta) {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) removeFromCart(id);
      updateCart();
    }

    function updateCart() {
      cartItemsContainer.innerHTML = '';
      let total = 0;
      let items = 0;

      cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        items += item.qty;

        const div = document.createElement('div');
        div.innerHTML = `
          <img src="${item.image}" alt="${item.title}" />
          <div>
            <h4>${item.title}</h4>
            <p>$${item.price} × ${item.qty} = $${itemTotal.toFixed(2)}</p>
            <button onclick="changeQty(${item.id}, 1)">+</button>
            <button onclick="changeQty(${item.id}, -1)">-</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        `;
        cartItemsContainer.appendChild(div);
      });

      totalItems.textContent = items;
      totalPrice.textContent = total.toFixed(2);
      cartCount.textContent = items;
    }

    function showDetails(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  detailTitle.textContent = product.title;
  detailImage.src = product.image;
  detailDescription.textContent = product.description;
  detailPrice.textContent = `$${product.price}`;
  
  productDetailModal.classList.remove('hidden');
}

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);

    closeModal.addEventListener('click', () => productDetailModal.classList.add('hidden'));
    // Open cart
document.getElementById('cartBtn').addEventListener('click', function() {
  document.getElementById('cartSidebar').classList.add('active');
  document.body.classList.add('cart-open');
});

// Close cart
document.querySelector('.cart-close-btn').addEventListener('click', function() {
  document.getElementById('cartSidebar').classList.remove('active');
  document.body.classList.remove('cart-open');
});

    fetchProducts();
