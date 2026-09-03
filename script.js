"use strict";

/* =========================================
   VS THREADS
   FRONTEND E-COMMERCE SYSTEM
========================================= */

const products = [
  {
    id: 1,
    name: "Essential Oversized Tee",
    category: "tees",
    price: 1299,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    description: "A clean oversized silhouette built for everyday wear."
  },
  {
    id: 2,
    name: "Core Heavyweight Hoodie",
    category: "hoodies",
    price: 2499,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    description: "Heavyweight comfort with a refined contemporary fit."
  },
  {
    id: 3,
    name: "Studio Relaxed Shirt",
    category: "shirts",
    price: 1999,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    description: "Relaxed everyday shirt with a modern editorial shape."
  },
  {
    id: 4,
    name: "Everyday Wide Trousers",
    category: "bottoms",
    price: 2199,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85",
    description: "Easy wide-leg trousers designed for movement."
  },
  {
    id: 5,
    name: "Signature Graphic Tee",
    category: "tees",
    price: 1499,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85",
    description: "Statement graphic tee with a premium everyday finish."
  },
  {
    id: 6,
    name: "Essential Zip Hoodie",
    category: "hoodies",
    price: 2699,
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85",
    description: "Minimal zip hoodie made for layering."
  },
  {
    id: 7,
    name: "Premium Oxford Shirt",
    category: "shirts",
    price: 2299,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85",
    description: "Clean Oxford styling with a relaxed modern fit."
  },
  {
    id: 8,
    name: "Utility Cargo Pant",
    category: "bottoms",
    price: 2399,
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=900&q=85",
    description: "Utility-inspired trousers with a contemporary silhouette."
  }
];

/* =========================================
   STORAGE
========================================= */

const STORAGE = {
  cart: "vs_threads_cart",
  wishlist: "vs_threads_wishlist",
  user: "vs_threads_user",
  orders: "vs_threads_orders"
};

function load(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let cart = load(STORAGE.cart);
let wishlist = load(STORAGE.wishlist);
let user = load(STORAGE.user, null);
let orders = load(STORAGE.orders);

/* =========================================
   ELEMENTS
========================================= */

const $ = id => document.getElementById(id);

const pageLoader = $("pageLoader");
const header = $("header");
const overlay = $("overlay");

const cartDrawer = $("cartDrawer");
const wishlistDrawer = $("wishlistDrawer");

const productGrid = $("productGrid");
const emptyState = $("emptyState");

const cartItems = $("cartItems");
const cartEmpty = $("cartEmpty");
const cartFooter = $("cartFooter");
const cartSubtotal = $("cartSubtotal");
const cartCount = $("cartCount");

const wishlistItems = $("wishlistItems");
const wishlistEmpty = $("wishlistEmpty");
const wishlistCount = $("wishlistCount");

const authModal = $("authModal");
const quickViewModal = $("quickViewModal");
const checkoutModal = $("checkoutModal");
const trackModal = $("trackModal");
const profilePage = $("profilePage");

/* =========================================
   INIT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    pageLoader.classList.add("hide");
  }, 500);

  renderProducts();
  renderCart();
  renderWishlist();
  updateCounters();
  updateProfile();

  setupEvents();
});

/* =========================================
   HEADER
========================================= */

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
});

/* =========================================
   PRODUCTS
========================================= */

let activeCategory = "all";
let searchTerm = "";

function renderProducts() {

  const filtered = products.filter(product => {

    const categoryMatch =
      activeCategory === "all" ||
      product.category === activeCategory;

    const searchMatch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = "";

  emptyState.classList.toggle("hidden", filtered.length !== 0);

  filtered.forEach(product => {

    const liked = wishlist.includes(product.id);

    const card = document.createElement("article");

    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">

        <img
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
        >

        <div class="product-actions">

          <button
            class="product-action ${liked ? "wish-active" : ""}"
            data-action="wishlist"
            data-id="${product.id}"
            aria-label="Wishlist"
          >
            ${liked ? "♥" : "♡"}
          </button>

          <button
            class="product-action"
            data-action="quickview"
            data-id="${product.id}"
            aria-label="Quick view"
          >
            +
          </button>

        </div>

      </div>

      <div class="product-info">

        <div class="product-category">
          ${product.category}
        </div>

        <h3 class="product-title">
          ${escapeHTML(product.name)}
        </h3>

        <div class="product-bottom">

          <span class="product-price">
            ${formatPrice(product.price)}
          </span>

          <button
            class="product-add"
            data-action="add"
            data-id="${product.id}"
          >
            ADD TO BAG →
          </button>

        </div>

      </div>
    `;

    productGrid.appendChild(card);
  });
}

/* =========================================
   CART
========================================= */

function addToCart(id, size = "M") {

  const existing = cart.find(
    item => item.id === id && item.size === size
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id,
      size,
      quantity: 1
    });
  }

  save(STORAGE.cart, cart);
  renderCart();
  updateCounters();

  const product = getProduct(id);

  toast(`${product.name} added to bag`);
}

function changeQuantity(id, size, change) {

  const item = cart.find(
    product => product.id === id && product.size === size
  );

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(
      product => !(product.id === id && product.size === size)
    );
  }

  save(STORAGE.cart, cart);

  renderCart();
  updateCounters();
}

function removeFromCart(id, size) {

  cart = cart.filter(
    item => !(item.id === id && item.size === size)
  );

  save(STORAGE.cart, cart);

  renderCart();
  updateCounters();

  toast("Item removed");
}

function renderCart() {

  cartItems.innerHTML = "";

  if (!cart.length) {

    cartEmpty.style.display = "flex";
    cartFooter.style.display = "none";

    return;
  }

  cartEmpty.style.display = "none";
  cartFooter.style.display = "block";

  cart.forEach(item => {

    const product = getProduct(item.id);

    if (!product) return;

    const row = document.createElement("div");

    row.className = "cart-row";

    row.innerHTML = `
      <img src="${product.image}" alt="${escapeHTML(product.name)}">

      <div>
        <h4>${escapeHTML(product.name)}</h4>
        <p>${formatPrice(product.price)} · Size ${item.size}</p>

        <div class="cart-controls">
          <button
            class="qty-btn"
            data-cart-action="minus"
            data-id="${item.id}"
            data-size="${item.size}"
          >−</button>

          <span>${item.quantity}</span>

          <button
            class="qty-btn"
            data-cart-action="plus"
            data-id="${item.id}"
            data-size="${item.size}"
          >+</button>
        </div>

        <button
          class="remove-btn"
          data-cart-action="remove"
          data-id="${item.id}"
          data-size="${item.size}"
        >
          REMOVE
        </button>
      </div>

      <strong>
        ${formatPrice(product.price * item.quantity)}
      </strong>
    `;

    cartItems.appendChild(row);
  });

  const total = cart.reduce((sum, item) => {

    const product = getProduct(item.id);

    return sum + (
      product ? product.price * item.quantity : 0
    );

  }, 0);

  cartSubtotal.textContent = formatPrice(total);
}

/* =========================================
   WISHLIST
========================================= */

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist = wishlist.filter(item => item !== id);

    toast("Removed from wishlist");

  } else {

    wishlist.push(id);

    toast("Added to wishlist");
  }

  save(STORAGE.wishlist, wishlist);

  renderProducts();
  renderWishlist();
  updateCounters();
  updateProfile();
}

function renderWishlist() {

  wishlistItems.innerHTML = "";

  if (!wishlist.length) {
    wishlistEmpty.style.display = "flex";
    return;
  }

  wishlistEmpty.style.display = "none";

  wishlist.forEach(id => {

    const product = getProduct(id);

    if (!product) return;

    const row = document.createElement("div");

    row.className = "cart-row";

    row.innerHTML = `
      <img src="${product.image}" alt="${escapeHTML(product.name)}">

      <div>
        <h4>${escapeHTML(product.name)}</h4>
        <p>${formatPrice(product.price)}</p>

        <button
          class="product-add"
          data-wish-action="add"
          data-id="${product.id}"
        >
          ADD TO BAG →
        </button>
      </div>

      <button
        class="remove-btn"
        data-wish-action="remove"
        data-id="${product.id}"
      >
        REMOVE
      </button>
    `;

    wishlistItems.appendChild(row);
  });
}

/* =========================================
   QUICK VIEW
========================================= */

let quickProductId = null;
let selectedSize = "M";

function openQuickView(id) {

  const product = getProduct(id);

  if (!product) return;

  quickProductId = id;
  selectedSize = "M";

  $("quickImage").src = product.image;
  $("quickImage").alt = product.name;
  $("quickCategory").textContent = product.category;
  $("quickTitle").textContent = product.name;
  $("quickPrice").textContent = formatPrice(product.price);
  $("quickDescription").textContent = product.description;

  document.querySelectorAll(".size-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === "M");
  });

  openModal(quickViewModal);
}

/* =========================================
   AUTH
========================================= */

let signupMode = false;

function openAuth() {

  if (user) {
    updateProfile();
    openProfile();
    return;
  }

  signupMode = false;
  updateAuthUI();

  openModal(authModal);
}

function updateAuthUI() {

  const signupFields = document.querySelectorAll(".signup-only");

  signupFields.forEach(field => {
    field.classList.toggle("hidden", !signupMode);
  });

  $("authEyebrow").textContent =
    signupMode ? "JOIN VS THREADS" : "WELCOME BACK";

  $("authTitle").textContent =
    signupMode
      ? "Create your account"
      : "Sign in to your account";

  $("authSubtitle").textContent =
    signupMode
      ? "Create an account to save your favourites and orders."
      : "Access your profile, orders and saved items.";

  $("authSubmit").textContent =
    signupMode ? "CREATE ACCOUNT" : "SIGN IN";

  $("authSwitchText").textContent =
    signupMode
      ? "Already have an account?"
      : "Don't have an account?";

  $("authSwitchBtn").textContent =
    signupMode ? "Sign in" : "Create one";
}

function handleAuth() {

  const email = $("authEmail").value.trim();
  const password = $("authPassword").value.trim();

  if (!email || !password) {
    toast("Please complete the form");
    return;
  }

  if (signupMode) {

    const name = $("authName").value.trim();

    if (!name) {
      toast("Enter your name");
      return;
    }

    user = {
      name,
      email
    };

    save(STORAGE.user, user);

    closeModal(authModal);

    toast("Account created");

  } else {

    user = {
      name: email.split("@")[0],
      email
    };

    save(STORAGE.user, user);

    closeModal(authModal);

    toast("Welcome back");
  }

  updateProfile();
}

/* =========================================
   PROFILE
========================================= */

function openProfile() {

  if (!user) {
    openAuth();
    return;
  }

  updateProfile();

  profilePage.classList.add("open");
  document.body.classList.add("locked");
}

function closeProfile() {

  profilePage.classList.remove("open");
  document.body.classList.remove("locked");
}

function updateProfile() {

  if (!user) return;

  $("profileName").textContent = user.name;
  $("profileEmail").textContent = user.email;

  const initials = user.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  $("profileAvatar").textContent = initials || "VS";

  $("profileOrderCount").textContent = orders.length;
  $("profileWishlistCount").textContent = wishlist.length;

  $("profileCartCount").textContent =
    cart.reduce((sum, item) => sum + item.quantity, 0);

  renderProfileOrders();
}

function renderProfileOrders() {

  const list = $("profileOrdersList");
  const empty = $("noOrders");

  list.innerHTML = "";

  if (!orders.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  orders.slice().reverse().forEach(order => {

    const card = document.createElement("div");

    card.className = "order-card";

    card.innerHTML = `
      <div>
        <strong>${order.id}</strong>
        <small>${order.date}</small>
      </div>

      <div>
        <strong>${formatPrice(order.total)}</strong>
        <small>${order.items} item(s)</small>
      </div>

      <span class="order-status">${order.status}</span>
    `;

    list.appendChild(card);
  });
}

/* =========================================
   CHECKOUT
========================================= */

function openCheckout() {

  if (!cart.length) {
    toast("Your bag is empty");
    return;
  }

  const summary = $("checkoutSummary");

  summary.innerHTML = "";

  cart.forEach(item => {

    const product = getProduct(item.id);

    if (!product) return;

    const row = document.createElement("div");

    row.className = "checkout-summary-row";

    row.innerHTML = `
      <span>${escapeHTML(product.name)} × ${item.quantity}</span>
      <strong>${formatPrice(product.price * item.quantity)}</strong>
    `;

    summary.appendChild(row);
  });

  if (user) {
    $("checkoutName").value = user.name;
  }

  openModal(checkoutModal);
}

function placeOrder() {

  if (!cart.length) {
    toast("Your bag is empty");
    return;
  }

  const name = $("checkoutName").value.trim();
  const phone = $("checkoutPhone").value.trim();
  const address = $("checkoutAddress").value.trim();

  if (!name || !phone || !address) {
    toast("Complete delivery details");
    return;
  }

  const total = cart.reduce((sum, item) => {

    const product = getProduct(item.id);

    return sum + (
      product ? product.price * item.quantity : 0
    );

  }, 0);

  const orderId =
    "VST-" +
    Math.floor(100000 + Math.random() * 900000);

  const order = {
    id: orderId,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),
    total,
    items: cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
    status: "ORDER PLACED"
  };

  orders.push(order);

  save(STORAGE.orders, orders);

  cart = [];

  save(STORAGE.cart, cart);

  closeModal(checkoutModal);

  renderCart();
  updateCounters();
  updateProfile();

  toast(`Order ${orderId} placed`);
}

/* =========================================
   TRACKING
========================================= */

function openTracking() {
  openModal(trackModal);
}

function trackOrder() {

  const value =
    $("trackInput").value.trim().toUpperCase();

  if (!value) {
    toast("Enter an order ID");
    return;
  }

  const result = $("trackingResult");

  const order = orders.find(
    item => item.id === value
  );

  result.classList.remove("hidden");

  if (order) {

    result.innerHTML = `
      <strong>${order.id}</strong>
      <p>
        Status: <b>${order.status}</b><br>
        Order placed: ${order.date}<br>
        Total: ${formatPrice(order.total)}
      </p>
    `;

  } else {

    result.innerHTML = `
      <strong>Order not found</strong>
      <p>
        We couldn't find that order ID in this demo store.
        Check the ID and try again.
      </p>
    `;
  }
}

/* =========================================
   MODALS / DRAWERS
========================================= */

function openModal(modal) {
  modal.classList.add("open");
  document.body.classList.add("locked");
}

function closeModal(modal) {
  modal.classList.remove("open");

  if (
    !cartDrawer.classList.contains("open") &&
    !wishlistDrawer.classList.contains("open") &&
    !profilePage.classList.contains("open")
  ) {
    document.body.classList.remove("locked");
  }
}

function openDrawer(drawer) {

  closeDrawer(cartDrawer);
  closeDrawer(wishlistDrawer);

  drawer.classList.add("open");
  overlay.classList.add("active");
  document.body.classList.add("locked");
}

function closeDrawer(drawer) {

  drawer.classList.remove("open");

  if (
    !cartDrawer.classList.contains("open") &&
    !wishlistDrawer.classList.contains("open")
  ) {
    overlay.classList.remove("active");
  }

  if (
    !cartDrawer.classList.contains("open") &&
    !wishlistDrawer.classList.contains("open") &&
    !profilePage.classList.contains("open")
  ) {
    document.body.classList.remove("locked");
  }
}

function closeEverything() {

  closeDrawer(cartDrawer);
  closeDrawer(wishlistDrawer);

  closeModal(authModal);
  closeModal(quickViewModal);
  closeModal(checkoutModal);
  closeModal(trackModal);

  closeProfile();

  overlay.classList.remove("active");

  document.body.classList.remove("locked");
}

/* =========================================
   EVENTS
========================================= */

function setupEvents() {

  $("mobileMenuBtn").addEventListener("click", () => {
    $("mobileNav").classList.toggle("open");
  });

  document.querySelectorAll(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      $("mobileNav").classList.remove("open");
    });
  });

  $("cartBtn").addEventListener("click", () => {
    renderCart();
    openDrawer(cartDrawer);
  });

  $("wishlistBtn").addEventListener("click", () => {
    renderWishlist();
    openDrawer(wishlistDrawer);
  });

  $("profileBtn").addEventListener("click", openProfile);

  $("closeCart").addEventListener("click", () => {
    closeDrawer(cartDrawer);
  });

  $("closeWishlist").addEventListener("click", () => {
    closeDrawer(wishlistDrawer);
  });

  overlay.addEventListener("click", closeEverything);

  $("startShoppingBtn").addEventListener("click", () => {
    closeDrawer(cartDrawer);
    document.querySelector("#shop").scrollIntoView({
      behavior: "smooth"
    });
  });

  $("searchBtn").addEventListener("click", () => {

    document.querySelector("#shop").scrollIntoView({
      behavior: "smooth"
    });

    setTimeout(() => {
      $("productSearch").focus();
    }, 500);
  });

  $("productSearch").addEventListener("input", event => {
    searchTerm = event.target.value;
    renderProducts();
  });

  $("filterButtons").addEventListener("click", event => {

    const button =
      event.target.closest(".filter-btn");

    if (!button) return;

    activeCategory =
      button.dataset.category;

    document.querySelectorAll(".filter-btn")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    renderProducts();
  });

  productGrid.addEventListener("click", event => {

    const button =
      event.target.closest("[data-action]");

    if (!button) return;

    const id =
      Number(button.dataset.id);

    const action =
      button.dataset.action;

    if (action === "add") {
      addToCart(id);
    }

    if (action === "wishlist") {
      toggleWishlist(id);
    }

    if (action === "quickview") {
      openQuickView(id);
    }
  });

  cartItems.addEventListener("click", event => {

    const button =
      event.target.closest("[data-cart-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const size = button.dataset.size;
    const action = button.dataset.cartAction;

    if (action === "plus") {
      changeQuantity(id, size, 1);
    }

    if (action === "minus") {
      changeQuantity(id, size, -1);
    }

    if (action === "remove") {
      removeFromCart(id, size);
    }
  });

  wishlistItems.addEventListener("click", event => {

    const button =
      event.target.closest("[data-wish-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.dataset.wishAction === "remove") {
      toggleWishlist(id);
    }

    if (button.dataset.wishAction === "add") {
      addToCart(id);
    }
  });

  $("closeAuth").addEventListener(
    "click",
    () => closeModal(authModal)
  );

  $("authSwitchBtn").addEventListener("click", () => {

    signupMode = !signupMode;

    updateAuthUI();
  });

  $("authSubmit").addEventListener(
    "click",
    handleAuth
  );

  $("closeQuickView").addEventListener(
    "click",
    () => closeModal(quickViewModal)
  );

  $("sizeOptions").addEventListener("click", event => {

    const button =
      event.target.closest(".size-btn");

    if (!button) return;

    selectedSize = button.textContent;

    document.querySelectorAll(".size-btn")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");
  });

  $("quickAddBtn").addEventListener("click", () => {

    if (!quickProductId) return;

    addToCart(
      quickProductId,
      selectedSize
    );

    closeModal(quickViewModal);
  });

  $("checkoutBtn").addEventListener(
    "click",
    openCheckout
  );

  $("closeCheckout").addEventListener(
    "click",
    () => closeModal(checkoutModal)
  );

  $("confirmCheckout").addEventListener(
    "click",
    placeOrder
  );

  $("closeTrack").addEventListener(
    "click",
    () => closeModal(trackModal)
  );

  $("trackSubmit").addEventListener(
    "click",
    trackOrder
  );

  $("trackOrderFooter").addEventListener(
    "click",
    openTracking
  );

  $("profileTrackBtn").addEventListener(
    "click",
    openTracking
  );

  $("supportBtn").addEventListener(
    "click",
    openSupport
  );

  $("supportFab").addEventListener(
    "click",
    openSupport
  );

  $("footerAccountBtn").addEventListener(
    "click",
    openProfile
  );

  $("profileBackBtn").addEventListener(
    "click",
    closeProfile
  );

  $("profileWishlistBtn").addEventListener(
    "click",
    () => {
      closeProfile();
      openDrawer(wishlistDrawer);
    }
  );

  $("profileOrdersBtn").addEventListener(
    "click",
    () => {
      document.querySelector(".profile-orders")
        .scrollIntoView({ behavior: "smooth" });
    }
  );

  $("profileShopBtn").addEventListener(
    "click",
    () => {
      closeProfile();

      document.querySelector("#shop")
        .scrollIntoView({ behavior: "smooth" });
    }
  );

  $("logoutBtn").addEventListener(
    "click",
    logout
  );

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeEverything();
    }
  });
}

/* =========================================
   SUPPORT
========================================= */

function openSupport() {

  /*
    Add your official WhatsApp business number here
    when you are ready to connect WhatsApp.

    Example:
    const number = "91XXXXXXXXXX";
  */

  toast("WhatsApp support will be connected here");
}

/* =========================================
   LOGOUT
========================================= */

function logout() {

  user = null;

  localStorage.removeItem(STORAGE.user);

  closeProfile();

  toast("Logged out");
}

/* =========================================
   HELPERS
========================================= */

function getProduct(id) {
  return products.find(product => product.id === id);
}

function formatPrice(value) {

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function updateCounters() {

  const totalCart =
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  cartCount.textContent = totalCart;
  wishlistCount.textContent = wishlist.length;
}

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer;

function toast(message) {

  $("toastText").textContent = message;

  const toastElement = $("toast");

  toastElement.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2500);
}