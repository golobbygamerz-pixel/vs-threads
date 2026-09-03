/* =========================================================
   VS THREADS
   CART + WISHLIST + AUTH + PROFILE
========================================================= */


/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [

  {
    id: "vs001",
    name: "Essential Oversized Tee",
    category: "tees",
    price: 1299,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    description: "A clean oversized silhouette made for everyday rotation."
  },

  {
    id: "vs002",
    name: "Core Heavy Hoodie",
    category: "hoodies",
    price: 2499,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    description: "Heavyweight comfort with a refined contemporary shape."
  },

  {
    id: "vs003",
    name: "Studio Relaxed Shirt",
    category: "shirts",
    price: 2199,
    tag: "EDITOR'S PICK",
    image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85",
    description: "Relaxed tailoring designed for effortless styling."
  },

  {
    id: "vs004",
    name: "Everyday Wide Pants",
    category: "bottoms",
    price: 2299,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85",
    description: "Wide-leg everyday trousers with a clean modern finish."
  },

  {
    id: "vs005",
    name: "Signature Box Tee",
    category: "tees",
    price: 1399,
    tag: "SIGNATURE",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85",
    description: "Structured cotton tee with a premium boxy fit."
  },

  {
    id: "vs006",
    name: "Minimal Zip Hoodie",
    category: "hoodies",
    price: 2699,
    tag: "LIMITED",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85",
    description: "Minimal zip hoodie built around comfort and clean lines."
  },

  {
    id: "vs007",
    name: "Premium Overshirt",
    category: "shirts",
    price: 2399,
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85",
    description: "Layer-ready overshirt with an elevated everyday feel."
  },

  {
    id: "vs008",
    name: "Relaxed Utility Pants",
    category: "bottoms",
    price: 2499,
    tag: "CORE",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    description: "Relaxed utility-inspired trousers with functional detailing."
  }

];


/* =========================================================
   LOCAL STORAGE
========================================================= */

const STORAGE_KEYS = {
  cart: "vs_threads_cart",
  wishlist: "vs_threads_wishlist",
  user: "vs_threads_user",
  orders: "vs_threads_orders"
};


function loadStorage(key, fallback) {

  try {

    const saved = localStorage.getItem(key);

    return saved ? JSON.parse(saved) : fallback;

  } catch (error) {

    return fallback;

  }

}


function saveStorage(key, value) {

  localStorage.setItem(key, JSON.stringify(value));

}


/* =========================================================
   STATE
========================================================= */

let cart = loadStorage(STORAGE_KEYS.cart, []);
let wishlist = loadStorage(STORAGE_KEYS.wishlist, []);
let currentUser = loadStorage(STORAGE_KEYS.user, null);
let orders = loadStorage(STORAGE_KEYS.orders, []);

let activeCategory = "all";
let authMode = "login";
let quickViewProductId = null;


/* =========================================================
   DOM
========================================================= */

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");

const cartDrawer = document.getElementById("cartDrawer");
const wishlistDrawer = document.getElementById("wishlistDrawer");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCount = document.getElementById("cartCount");

const wishlistItems = document.getElementById("wishlistItems");
const wishlistEmpty = document.getElementById("wishlistEmpty");
const wishlistCount = document.getElementById("wishlistCount");

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);

}


/* =========================================================
   PRODUCT RENDER
========================================================= */

function renderProducts() {

  const searchInput = document.getElementById("productSearch");

  const searchTerm = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const filtered = products.filter(product => {

    const categoryMatch =
      activeCategory === "all" ||
      product.category === activeCategory;

    const searchMatch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return categoryMatch && searchMatch;

  });


  productGrid.innerHTML = "";


  if (!filtered.length) {

    emptyState.classList.add("show");

    return;

  }


  emptyState.classList.remove("show");


  filtered.forEach(product => {

    const isWishlisted = wishlist.includes(product.id);

    const card = document.createElement("article");

    card.className = "product-card";

    card.dataset.productId = product.id;


    card.innerHTML = `

      <div class="product-image-wrap" data-action="quick-view">

        <span class="product-tag">
          ${product.tag}
        </span>

        <button
          class="product-wishlist ${isWishlisted ? "active" : ""}"
          data-action="wishlist"
          aria-label="Add to wishlist"
        >
          ${isWishlisted ? "♥" : "♡"}
        </button>

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          decoding="async"
        >

      </div>


      <div class="product-info">

        <div class="product-info-top">

          <h3 class="product-name">
            ${product.name}
          </h3>

          <span class="product-price">
            ${formatPrice(product.price)}
          </span>

        </div>

        <p class="product-category">
          ${product.category}
        </p>

        <button
          class="product-add"
          data-action="add-cart"
        >
          ADD TO CART
        </button>

      </div>

    `;


    productGrid.appendChild(card);

  });

}


/* =========================================================
   CART
========================================================= */

function addToCart(productId, size = "M") {

  const product = products.find(item => item.id === productId);

  if (!product) return;


  const existing = cart.find(
    item => item.id === productId && item.size === size
  );


  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      id: productId,
      size,
      quantity: 1
    });

  }


  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();

  showToast(`${product.name} added to cart`);

  openDrawer(cartDrawer);

}


function decreaseCart(productId, size) {

  const item = cart.find(
    cartItem => cartItem.id === productId && cartItem.size === size
  );

  if (!item) return;


  item.quantity -= 1;


  if (item.quantity <= 0) {

    cart = cart.filter(
      cartItem =>
        !(cartItem.id === productId && cartItem.size === size)
    );

  }


  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();

}


function increaseCart(productId, size) {

  const item = cart.find(
    cartItem => cartItem.id === productId && cartItem.size === size
  );

  if (!item) return;

  item.quantity += 1;

  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();

}


function removeFromCart(productId, size) {

  cart = cart.filter(
    item =>
      !(item.id === productId && item.size === size)
  );

  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();

  showToast("Item removed");

}


function getCartQuantity() {

  return cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

}


function getCartSubtotal() {

  return cart.reduce((total, item) => {

    const product = products.find(
      product => product.id === item.id
    );

    return total + (product ? product.price * item.quantity : 0);

  }, 0);

}


function updateCartUI() {

  const quantity = getCartQuantity();

  const subtotal = getCartSubtotal();


  cartCount.textContent = quantity;

  cartSubtotal.textContent = formatPrice(subtotal);


  cartItems.innerHTML = "";


  if (!cart.length) {

    cartEmpty.classList.add("show");

    cartFooter.style.display = "none";

    return;

  }


  cartEmpty.classList.remove("show");

  cartFooter.style.display = "block";


  cart.forEach(item => {

    const product = products.find(
      product => product.id === item.id
    );

    if (!product) return;


    const element = document.createElement("div");

    element.className = "cart-item";


    element.innerHTML = `

      <div class="cart-item-image">

        <img
          src="${product.image}"
          alt="${product.name}"
        >

      </div>


      <div class="cart-item-info">

        <h4>${product.name}</h4>

        <small>Size: ${item.size}</small>

        <p>${formatPrice(product.price)}</p>


        <div class="quantity-control">

          <button
            data-cart-action="decrease"
            data-id="${product.id}"
            data-size="${item.size}"
          >
            −
          </button>

          <span>${item.quantity}</span>

          <button
            data-cart-action="increase"
            data-id="${product.id}"
            data-size="${item.size}"
          >
            +
          </button>

        </div>

      </div>


      <button
        class="remove-item"
        data-cart-action="remove"
        data-id="${product.id}"
        data-size="${item.size}"
      >
        REMOVE
      </button>

    `;


    cartItems.appendChild(element);

  });

}


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist(productId) {

  const product = products.find(
    item => item.id === productId
  );

  if (!product) return;


  if (wishlist.includes(productId)) {

    wishlist = wishlist.filter(
      id => id !== productId
    );

    showToast("Removed from wishlist");

  } else {

    wishlist.push(productId);

    showToast("Added to wishlist");

  }


  saveStorage(STORAGE_KEYS.wishlist, wishlist);

  updateWishlistUI();

  renderProducts();

}


function updateWishlistUI() {

  wishlistCount.textContent = wishlist.length;

  wishlistItems.innerHTML = "";


  if (!wishlist.length) {

    wishlistEmpty.classList.add("show");

    return;

  }


  wishlistEmpty.classList.remove("show");


  wishlist.forEach(productId => {

    const product = products.find(
      item => item.id === productId
    );

    if (!product) return;


    const element = document.createElement("div");

    element.className = "wishlist-item";


    element.innerHTML = `

      <div class="wishlist-item-image">
        <img
          src="${product.image}"
          alt="${product.name}"
        >
      </div>

      <div>

        <h4>${product.name}</h4>

        <p>${formatPrice(product.price)}</p>

        <button
          data-wishlist-action="cart"
          data-id="${product.id}"
        >
          ADD TO CART
        </button>

      </div>

    `;


    wishlistItems.appendChild(element);

  });

}


/* =========================================================
   DRAWERS
========================================================= */

function openDrawer(drawer) {

  closeAllDrawers();

  drawer.classList.add("open");

  overlay.classList.add("active");

  document.body.classList.add("no-scroll");

}


function closeDrawer(drawer) {

  drawer.classList.remove("open");

  overlay.classList.remove("active");

  document.body.classList.remove("no-scroll");

}


function closeAllDrawers() {

  cartDrawer.classList.remove("open");

  wishlistDrawer.classList.remove("open");

  overlay.classList.remove("active");

  document.body.classList.remove("no-scroll");

}


/* =========================================================
   AUTH
========================================================= */

const authModal = document.getElementById("authModal");
const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");

const authTitle = document.getElementById("authTitle");
const authEyebrow = document.getElementById("authEyebrow");
const authSubtitle = document.getElementById("authSubtitle");
const authSubmit = document.getElementById("authSubmit");

const signupOnly = document.querySelector(".signup-only");

const authSwitchText = document.getElementById("authSwitchText");
const authSwitchBtn = document.getElementById("authSwitchBtn");


function openAuth(mode = "login") {

  authMode = mode;

  updateAuthMode();

  authModal.classList.add("active");

  document.body.classList.add("no-scroll");

}


function closeAuth() {

  authModal.classList.remove("active");

  if (
    !cartDrawer.classList.contains("open") &&
    !wishlistDrawer.classList.contains("open")
  ) {
    document.body.classList.remove("no-scroll");
  }

}


function updateAuthMode() {

  if (authMode === "signup") {

    authEyebrow.textContent = "JOIN VS THREADS";

    authTitle.textContent = "Create your account";

    authSubtitle.textContent =
      "Create your profile and keep everything in one place.";

    authSubmit.textContent = "CREATE ACCOUNT";

    authSwitchText.textContent =
      "Already have an account?";

    authSwitchBtn.textContent =
      "Sign in";

    signupOnly.classList.remove("hidden");

  } else {

    authEyebrow.textContent = "WELCOME BACK";

    authTitle.textContent =
      "Sign in to your account";

    authSubtitle.textContent =
      "Access your profile, orders and saved items.";

    authSubmit.textContent = "SIGN IN";

    authSwitchText.textContent =
      "Don't have an account?";

    authSwitchBtn.textContent =
      "Create one";

    signupOnly.classList.add("hidden");

  }

}


function handleAuth() {

  const email = authEmail.value.trim();
  const password = authPassword.value.trim();
  const name = authName.value.trim();


  if (!email || !password) {

    showToast("Enter your email and password");

    return;

  }


  if (!email.includes("@")) {

    showToast("Enter a valid email");

    return;

  }


  if (authMode === "signup" && !name) {

    showToast("Enter your full name");

    return;

  }


  if (authMode === "signup") {

    currentUser = {
      name,
      email
    };

    saveStorage(
      STORAGE_KEYS.user,
      currentUser
    );

    showToast("Account created");

  } else {

    if (
      currentUser &&
      currentUser.email.toLowerCase() === email.toLowerCase()
    ) {

      currentUser = {
        ...currentUser,
        email
      };

    } else {

      currentUser = {
        name: email.split("@")[0],
        email
      };

    }


    saveStorage(
      STORAGE_KEYS.user,
      currentUser
    );

    showToast("Signed in successfully");

  }


  authName.value = "";
  authEmail.value = "";
  authPassword.value = "";

  closeAuth();

  setTimeout(() => {

    openProfile();

  }, 250);

}


/* =========================================================
   PROFILE
========================================================= */

const profilePage = document.getElementById("profilePage");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAvatar = document.getElementById("profileAvatar");

const profileOrderCount = document.getElementById("profileOrderCount");
const profileWishlistCount = document.getElementById("profileWishlistCount");
const profileCartCount = document.getElementById("profileCartCount");

const profileOrdersList = document.getElementById("profileOrdersList");
const noOrders = document.getElementById("noOrders");


function getInitials(name) {

  if (!name) return "VS";


  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);


  if (words.length === 1) {

    return words[0]
      .slice(0, 2)
      .toUpperCase();

  }


  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();

}


function openProfile() {

  if (!currentUser) {

    openAuth("login");

    return;

  }


  closeAllDrawers();

  profilePage.classList.add("active");

  document.body.classList.add("no-scroll");

  updateProfileUI();

}


function closeProfile() {

  profilePage.classList.remove("active");

  document.body.classList.remove("no-scroll");

}


function updateProfileUI() {

  if (!currentUser) return;


  profileName.textContent =
    currentUser.name || "VS THREADS Member";

  profileEmail.textContent =
    currentUser.email || "";

  profileAvatar.textContent =
    getInitials(currentUser.name);


  profileOrderCount.textContent =
    orders.length;

  profileWishlistCount.textContent =
    wishlist.length;

  profileCartCount.textContent =
    getCartQuantity();


  profileOrdersList.innerHTML = "";


  if (!orders.length) {

    noOrders.style.display = "block";

    return;

  }


  noOrders.style.display = "none";


  orders.slice().reverse().forEach(order => {

    const element = document.createElement("div");

    element.className = "profile-order";


    element.innerHTML = `

      <div>

        <div class="profile-order-id">
          ${order.id}
        </div>

        <div class="profile-order-date">
          ${order.date}
        </div>

      </div>


      <div class="profile-order-total">

        <strong>
          ${formatPrice(order.total)}
        </strong>

        <br>

        <span class="order-status">
          ${order.status}
        </span>

      </div>

    `;


    profileOrdersList.appendChild(element);

  });

}


function logout() {

  currentUser = null;

  localStorage.removeItem(STORAGE_KEYS.user);

  closeProfile();

  showToast("Logged out successfully");

}


/* =========================================================
   QUICK VIEW
========================================================= */

const quickViewModal =
  document.getElementById("quickViewModal");

const quickImage =
  document.getElementById("quickImage");

const quickCategory =
  document.getElementById("quickCategory");

const quickTitle =
  document.getElementById("quickTitle");

const quickPrice =
  document.getElementById("quickPrice");

const quickDescription =
  document.getElementById("quickDescription");

const quickAddBtn =
  document.getElementById("quickAddBtn");

const sizeOptions =
  document.getElementById("sizeOptions");


function openQuickView(productId) {

  const product = products.find(
    item => item.id === productId
  );

  if (!product) return;


  quickViewProductId = productId;

  quickImage.src = product.image;
  quickImage.alt = product.name;

  quickCategory.textContent =
    product.category.toUpperCase();

  quickTitle.textContent =
    product.name;

  quickPrice.textContent =
    formatPrice(product.price);

  quickDescription.textContent =
    product.description;


  sizeOptions
    .querySelectorAll(".size-btn")
    .forEach(button => {

      button.classList.remove("active");

    });


  sizeOptions
    .querySelector(".size-btn:nth-child(2)")
    ?.classList.add("active");


  quickViewModal.classList.add("active");

  document.body.classList.add("no-scroll");

}


function closeQuickView() {

  quickViewModal.classList.remove("active");

  document.body.classList.remove("no-scroll");

}


/* =========================================================
   CHECKOUT
========================================================= */

const checkoutModal =
  document.getElementById("checkoutModal");

const checkoutSummary =
  document.getElementById("checkoutSummary");


function openCheckout() {

  if (!cart.length) {

    showToast("Your cart is empty");

    return;

  }


  if (!currentUser) {

    closeDrawer(cartDrawer);

    showToast("Please sign in before checkout");

    setTimeout(() => {

      openAuth("login");

    }, 300);

    return;

  }


  renderCheckoutSummary();

  checkoutModal.classList.add("active");

  document.body.classList.add("no-scroll");

}


function renderCheckoutSummary() {

  checkoutSummary.innerHTML = "";


  cart.forEach(item => {

    const product = products.find(
      product => product.id === item.id
    );

    if (!product) return;


    const line = document.createElement("div");

    line.className = "checkout-line";


    line.innerHTML = `

      <span>
        ${product.name} × ${item.quantity}
      </span>

      <strong>
        ${formatPrice(product.price * item.quantity)}
      </strong>

    `;


    checkoutSummary.appendChild(line);

  });


  const total = document.createElement("div");

  total.className = "checkout-line";

  total.style.marginTop = "10px";
  total.style.paddingTop = "12px";
  total.style.borderTop = "1px solid #e5e8f0";
  total.style.fontWeight = "800";


  total.innerHTML = `

    <span>TOTAL</span>

    <strong>
      ${formatPrice(getCartSubtotal())}
    </strong>

  `;


  checkoutSummary.appendChild(total);

}


function closeCheckout() {

  checkoutModal.classList.remove("active");

  document.body.classList.remove("no-scroll");

}


function createOrder() {

  if (!cart.length) return;


  const name =
    document.getElementById("checkoutName").value.trim();

  const phone =
    document.getElementById("checkoutPhone").value.trim();

  const address =
    document.getElementById("checkoutAddress").value.trim();


  if (!name || !phone || !address) {

    showToast("Please complete delivery details");

    return;

  }


  const orderNumber =
    Math.floor(100000 + Math.random() * 900000);


  const order = {

    id: `VST-${orderNumber}`,

    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),

    total: getCartSubtotal(),

    status: "ORDER PLACED",

    items: [...cart],

    customer: {
      name,
      phone,
      address
    }

  };


  orders.push(order);

  saveStorage(STORAGE_KEYS.orders, orders);


  cart = [];

  saveStorage(STORAGE_KEYS.cart, cart);


  updateCartUI();

  updateProfileUI();


  document.getElementById("checkoutName").value = "";
  document.getElementById("checkoutPhone").value = "";
  document.getElementById("checkoutAddress").value = "";


  closeCheckout();

  closeDrawer(cartDrawer);


  setTimeout(() => {

    showToast(`Order ${order.id} placed successfully`);

  }, 300);


  setTimeout(() => {

    openProfile();

  }, 1000);

}


/* =========================================================
   ORDER TRACKING
========================================================= */

const trackModal =
  document.getElementById("trackModal");

const trackInput =
  document.getElementById("trackInput");

const trackingResult =
  document.getElementById("trackingResult");


function openTrackModal() {

  trackModal.classList.add("active");

  document.body.classList.add("no-scroll");

}


function closeTrackModal() {

  trackModal.classList.remove("active");

  document.body.classList.remove("no-scroll");

  trackingResult.classList.add("hidden");

  trackingResult.innerHTML = "";

}


function trackOrder() {

  const id =
    trackInput.value.trim().toUpperCase();


  if (!id) {

    showToast("Enter an order ID");

    return;

  }


  const order = orders.find(
    order => order.id === id
  );


  trackingResult.classList.remove("hidden");


  if (!order) {

    trackingResult.innerHTML = `

      <h3>Order not found</h3>

      <p>
        We couldn't find an order with ID
        <strong>${id}</strong>.
      </p>

    `;

    return;

  }


  trackingResult.innerHTML = `

    <h3>${order.status}</h3>

    <p>
      Order <strong>${order.id}</strong>
      was placed on ${order.date}.
    </p>

    <p>
      Total: <strong>${formatPrice(order.total)}</strong>
    </p>

  `;

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

  toastText.textContent = message;

  toast.classList.add("show");


  clearTimeout(toastTimer);


  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2600);

}


/* =========================================================
   EVENT DELEGATION
   THIS FIXES ADD TO CART RELIABILITY
========================================================= */

productGrid.addEventListener("click", event => {

  const card =
    event.target.closest(".product-card");

  if (!card) return;


  const productId =
    card.dataset.productId;


  const action =
    event.target.closest("[data-action]")?.dataset.action;


  if (action === "add-cart") {

    event.stopPropagation();

    addToCart(productId);

    return;

  }


  if (action === "wishlist") {

    event.stopPropagation();

    toggleWishlist(productId);

    return;

  }


  if (action === "quick-view") {

    openQuickView(productId);

  }

});


/* CART EVENTS */

cartItems.addEventListener("click", event => {

  const button =
    event.target.closest("[data-cart-action]");

  if (!button) return;


  const action =
    button.dataset.cartAction;

  const id =
    button.dataset.id;

  const size =
    button.dataset.size;


  if (action === "increase") {

    increaseCart(id, size);

  }


  if (action === "decrease") {

    decreaseCart(id, size);

  }


  if (action === "remove") {

    removeFromCart(id, size);

  }

});


/* WISHLIST EVENTS */

wishlistItems.addEventListener("click", event => {

  const button =
    event.target.closest("[data-wishlist-action]");

  if (!button) return;


  const productId =
    button.dataset.id;


  if (button.dataset.wishlistAction === "cart") {

    addToCart(productId);

  }

});


/* =========================================================
   HEADER EVENTS
========================================================= */

document.getElementById("cartBtn")
  .addEventListener("click", () => {

    updateCartUI();

    openDrawer(cartDrawer);

  });


document.getElementById("wishlistBtn")
  .addEventListener("click", () => {

    updateWishlistUI();

    openDrawer(wishlistDrawer);

  });


document.getElementById("profileBtn")
  .addEventListener("click", () => {

    openProfile();

  });


document.getElementById("searchBtn")
  .addEventListener("click", () => {

    document
      .getElementById("shop")
      .scrollIntoView({
        behavior: "smooth"
      });


    setTimeout(() => {

      document
        .getElementById("productSearch")
        .focus();

    }, 500);

  });


/* =========================================================
   DRAWER CLOSE
========================================================= */

document.getElementById("closeCart")
  .addEventListener("click", () => {

    closeDrawer(cartDrawer);

  });


document.getElementById("closeWishlist")
  .addEventListener("click", () => {

    closeDrawer(wishlistDrawer);

  });


overlay.addEventListener("click", () => {

  closeAllDrawers();

});


document.getElementById("startShoppingBtn")
  .addEventListener("click", () => {

    closeDrawer(cartDrawer);

    document
      .getElementById("shop")
      .scrollIntoView({
        behavior: "smooth"
      });

  });


/* =========================================================
   FILTERS
========================================================= */

document
  .getElementById("filterButtons")
  .addEventListener("click", event => {

    const button =
      event.target.closest(".filter-btn");

    if (!button) return;


    document
      .querySelectorAll(".filter-btn")
      .forEach(btn =>
        btn.classList.remove("active")
      );


    button.classList.add("active");


    activeCategory =
      button.dataset.category;


    renderProducts();

  });


/* SEARCH */

document
  .getElementById("productSearch")
  .addEventListener("input", () => {

    renderProducts();

  });


/* =========================================================
   AUTH EVENTS
========================================================= */

document.getElementById("closeAuth")
  .addEventListener("click", closeAuth);


authSwitchBtn.addEventListener("click", () => {

  authMode =
    authMode === "login"
      ? "signup"
      : "login";

  updateAuthMode();

});


authSubmit.addEventListener("click", handleAuth);


/* ENTER KEY LOGIN */

[authName, authEmail, authPassword].forEach(input => {

  input.addEventListener("keydown", event => {

    if (event.key === "Enter") {

      handleAuth();

    }

  });

});


/* =========================================================
   PROFILE EVENTS
========================================================= */

document.getElementById("profileBackBtn")
  .addEventListener("click", closeProfile);


document.getElementById("logoutBtn")
  .addEventListener("click", logout);


document.getElementById("profileShopBtn")
  .addEventListener("click", () => {

    closeProfile();

    setTimeout(() => {

      document
        .getElementById("shop")
        .scrollIntoView({
          behavior: "smooth"
        });

    }, 200);

  });


document.getElementById("profileWishlistBtn")
  .addEventListener("click", () => {

    closeProfile();

    setTimeout(() => {

      updateWishlistUI();

      openDrawer(wishlistDrawer);

    }, 200);

  });


document.getElementById("profileOrdersBtn")
  .addEventListener("click", () => {

    document
      .querySelector(".profile-orders")
      .scrollIntoView({
        behavior: "smooth"
      });

  });


document.getElementById("profileTrackBtn")
  .addEventListener("click", () => {

    openTrackModal();

  });


/* =========================================================
   QUICK VIEW EVENTS
========================================================= */

document.getElementById("closeQuickView")
  .addEventListener("click", closeQuickView);


sizeOptions.addEventListener("click", event => {

  const button =
    event.target.closest(".size-btn");

  if (!button) return;


  sizeOptions
    .querySelectorAll(".size-btn")
    .forEach(btn =>
      btn.classList.remove("active")
    );


  button.classList.add("active");

});


quickAddBtn.addEventListener("click", () => {

  const selectedSize =
    sizeOptions
      .querySelector(".size-btn.active")
      ?.textContent || "M";


  if (quickViewProductId) {

    addToCart(
      quickViewProductId,
      selectedSize
    );

    closeQuickView();

  }

});


/* =========================================================
   CHECKOUT EVENTS
========================================================= */

document.getElementById("checkoutBtn")
  .addEventListener("click", openCheckout);


document.getElementById("closeCheckout")
  .addEventListener("click", closeCheckout);


document.getElementById("confirmCheckout")
  .addEventListener("click", createOrder);


/* =========================================================
   TRACKING EVENTS
========================================================= */

document.getElementById("closeTrack")
  .addEventListener("click", closeTrackModal);


document.getElementById("trackSubmit")
  .addEventListener("click", trackOrder);


trackInput.addEventListener("keydown", event => {

  if (event.key === "Enter") {

    trackOrder();

  }

});


document.getElementById("trackOrderFooter")
  .addEventListener("click", openTrackModal);


/* =========================================================
   FOOTER ACCOUNT
========================================================= */

document.getElementById("footerAccountBtn")
  .addEventListener("click", openProfile);


/* =========================================================
   SUPPORT
========================================================= */

function openSupport() {

  /*
    Add your real WhatsApp number here later.
    Example:
    const whatsappNumber = "91XXXXXXXXXX";
  */

  showToast("WhatsApp support will be connected next");

}


document.getElementById("supportBtn")
  .addEventListener("click", openSupport);


document.getElementById("supportFab")
  .addEventListener("click", openSupport);


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenuBtn =
  document.getElementById("mobileMenuBtn");

const mobileNav =
  document.getElementById("mobileNav");


mobileMenuBtn.addEventListener("click", () => {

  mobileNav.classList.toggle("active");

});


mobileNav.addEventListener("click", event => {

  if (event.target.tagName === "A") {

    mobileNav.classList.remove("active");

  }

});


/* MOBILE NAV CSS HELPER */

const mobileNavStyle = document.createElement("style");

mobileNavStyle.textContent = `

  @media (max-width: 800px) {

    .mobile-nav {
      max-height: 0;
      overflow: hidden;
      background: white;
      transition: max-height .3s ease;
      border-top: 0 solid var(--line);
    }

    .mobile-nav.active {
      max-height: 300px;
      border-top: 1px solid var(--line);
      padding: 10px 6% 18px;
    }

    .mobile-nav a {
      display: block;
      padding: 13px 0;
      font-size: 13px;
      font-weight: 700;
      color: var(--ink);
    }

  }

`;

document.head.appendChild(mobileNavStyle);


/* =========================================================
   PROFILE AUTO LOGIN
========================================================= */

if (currentUser) {

  updateProfileUI();

}


/* =========================================================
   INITIAL UI
========================================================= */

renderProducts();

updateCartUI();

updateWishlistUI();


/* =========================================================
   PAGE LOADER
========================================================= */

window.addEventListener("load", () => {

  setTimeout(() => {

    document
      .getElementById("pageLoader")
      .classList.add("hide");

  }, 500);

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", event => {

  if (event.key !== "Escape") return;


  closeAllDrawers();

  closeAuth();

  closeQuickView();

  closeCheckout();

  closeTrackModal();

  closeProfile();

});


/* =========================================================
   LOGO
========================================================= */

document.getElementById("logoLink")
  .addEventListener("click", event => {

    event.preventDefault();

    closeProfile();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });


console.log("VS THREADS loaded successfully.");