"use strict";

/* =========================================
   VS THREADS
   COMPLETE FRONTEND
========================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Essential Oversized Tee",
    category: "tees",
    price: 1299,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=90",
    description: "A clean oversized silhouette built for everyday wear."
  },
  {
    id: 2,
    name: "Core Heavyweight Hoodie",
    category: "hoodies",
    price: 2499,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=90",
    description: "Heavyweight comfort with a refined contemporary fit."
  },
  {
    id: 3,
    name: "Studio Relaxed Shirt",
    category: "shirts",
    price: 1999,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=90",
    description: "Relaxed everyday shirt with a modern editorial shape."
  },
  {
    id: 4,
    name: "Everyday Wide Trousers",
    category: "bottoms",
    price: 2199,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=90",
    description: "Easy wide-leg trousers designed for movement."
  },
  {
    id: 5,
    name: "Signature Graphic Tee",
    category: "tees",
    price: 1499,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=90",
    description: "Statement graphic tee with a premium everyday finish."
  },
  {
    id: 6,
    name: "Essential Zip Hoodie",
    category: "hoodies",
    price: 2699,
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=90",
    description: "Minimal zip hoodie made for layering."
  },
  {
    id: 7,
    name: "Premium Oxford Shirt",
    category: "shirts",
    price: 2299,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=90",
    description: "Clean Oxford styling with a relaxed modern fit."
  },
  {
    id: 8,
    name: "Utility Cargo Pant",
    category: "bottoms",
    price: 2399,
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=900&q=90",
    description: "Utility-inspired trousers with a contemporary silhouette."
  }
];

/* =========================================
   STORAGE
========================================= */

const KEYS = {
  cart: "vs_threads_cart_v4",
  wishlist: "vs_threads_wishlist_v4",
  user: "vs_threads_user_v4",
  orders: "vs_threads_orders_v4"
};

function getStorage(key, fallback){
  try{
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  }catch{
    return fallback;
  }
}

function setStorage(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
  }catch{}
}

let cart = getStorage(KEYS.cart, []);
let wishlist = getStorage(KEYS.wishlist, []);
let currentUser = getStorage(KEYS.user, null);
let orders = getStorage(KEYS.orders, []);

let activeCategory = "all";
let searchQuery = "";
let quickProduct = null;
let selectedSize = "M";
let signupMode = false;
let toastTimer = null;

/* =========================================
   HELPERS
========================================= */

const $ = id => document.getElementById(id);

function productById(id){
  return PRODUCTS.find(product => product.id === Number(id));
}

function money(value){
  return new Intl.NumberFormat("en-IN", {
    style:"currency",
    currency:"INR",
    maximumFractionDigits:0
  }).format(value);
}

function safe(text){
  return String(text)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function totalItems(){
  return cart.reduce((sum,item) => sum + item.quantity, 0);
}

function cartTotal(){
  return cart.reduce((sum,item) => {
    const product = productById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  },0);
}

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {
    $("loader").classList.add("hide");
  },700);

  renderProducts();
  renderCart();
  renderWishlist();
  updateCounters();
  updateProfile();
  setupReveal();

  bindEvents();
});

/* =========================================
   SCROLL
========================================= */

window.addEventListener("scroll", () => {
  $("header").classList.toggle(
    "scrolled",
    window.scrollY > 30
  );
});

/* =========================================
   PRODUCTS
========================================= */

function renderProducts(){

  const filtered = PRODUCTS.filter(product => {

    const categoryOk =
      activeCategory === "all" ||
      product.category === activeCategory;

    const searchOk =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryOk && searchOk;
  });

  const container = $("products");

  container.innerHTML = "";

  $("noProducts").classList.toggle(
    "hidden",
    filtered.length > 0
  );

  filtered.forEach((product,index) => {

    const liked = wishlist.includes(product.id);

    const card = document.createElement("article");

    card.className = "product";

    card.style.animationDelay = `${index * 45}ms`;

    card.innerHTML = `
      <div class="product-image">

        <img
          src="${product.image}"
          alt="${safe(product.name)}"
          loading="lazy"
        >

        <div class="product-buttons">

          <button
            class="round-action ${liked ? "liked" : ""}"
            data-action="wishlist"
            data-id="${product.id}"
            aria-label="Add to wishlist"
          >
            ${liked ? "♥" : "♡"}
          </button>

          <button
            class="round-action"
            data-action="quick"
            data-id="${product.id}"
            aria-label="Quick view"
          >
            +
          </button>

        </div>

        <button
          class="product-add-overlay"
          data-action="add"
          data-id="${product.id}"
        >
          <span>ADD TO BAG</span>
          <span>→</span>
        </button>

      </div>

      <div class="product-info">

        <div class="product-category">
          ${safe(product.category)}
        </div>

        <h3>${safe(product.name)}</h3>

        <div class="product-row">
          <strong>${money(product.price)}</strong>

          <button
            class="mobile-add"
            data-action="add"
            data-id="${product.id}"
          >
            ADD TO BAG →
          </button>
        </div>

      </div>
    `;

    container.appendChild(card);
  });
}

/* =========================================
   CART
========================================= */

function addToCart(id,size="M"){

  id = Number(id);

  const existing = cart.find(
    item => Number(item.id) === id &&
            item.size === size
  );

  if(existing){
    existing.quantity += 1;
  }else{
    cart.push({
      id:id,
      size:size,
      quantity:1
    });
  }

  setStorage(KEYS.cart,cart);

  renderCart();
  updateCounters();
  updateProfile();

  const product = productById(id);

  showToast(
    `${product ? product.name : "Product"} added to bag`
  );

  animateCartIcon();
}

function changeQuantity(id,size,change){

  const item = cart.find(
    cartItem =>
      Number(cartItem.id) === Number(id) &&
      cartItem.size === size
  );

  if(!item) return;

  item.quantity += change;

  if(item.quantity <= 0){
    cart = cart.filter(
      cartItem =>
        !(
          Number(cartItem.id) === Number(id) &&
          cartItem.size === size
        )
    );
  }

  setStorage(KEYS.cart,cart);

  renderCart();
  updateCounters();
  updateProfile();
}

function removeCartItem(id,size){

  cart = cart.filter(
    item =>
      !(
        Number(item.id) === Number(id) &&
        item.size === size
      )
  );

  setStorage(KEYS.cart,cart);

  renderCart();
  updateCounters();
  updateProfile();

  showToast("Item removed");
}

function renderCart(){

  const content = $("cartContent");
  const empty = $("cartEmpty");
  const footer = $("cartFooter");

  content.innerHTML = "";

  if(cart.length === 0){

    empty.style.display = "flex";
    footer.style.display = "none";

    return;
  }

  empty.style.display = "none";
  footer.style.display = "block";

  cart.forEach(item => {

    const product = productById(item.id);

    if(!product) return;

    const row = document.createElement("div");

    row.className = "cart-item";

    row.innerHTML = `
      <img
        src="${product.image}"
        alt="${safe(product.name)}"
      >

      <div>

        <h4>${safe(product.name)}</h4>

        <div class="item-meta">
          ${money(product.price)} · Size ${safe(item.size)}
        </div>

        <div class="qty">

          <button
            data-cart-action="minus"
            data-id="${product.id}"
            data-size="${item.size}"
          >−</button>

          <span>${item.quantity}</span>

          <button
            data-cart-action="plus"
            data-id="${product.id}"
            data-size="${item.size}"
          >+</button>

        </div>

        <button
          class="remove"
          data-cart-action="remove"
          data-id="${product.id}"
          data-size="${item.size}"
        >
          REMOVE
        </button>

      </div>

      <strong>
        ${money(product.price * item.quantity)}
      </strong>
    `;

    content.appendChild(row);
  });

  $("subtotal").textContent = money(cartTotal());
}

/* =========================================
   WISHLIST
========================================= */

function toggleWishlist(id){

  id = Number(id);

  if(wishlist.includes(id)){

    wishlist =
      wishlist.filter(item => item !== id);

    showToast("Removed from wishlist");

  }else{

    wishlist.push(id);

    showToast("Added to wishlist");
  }

  setStorage(KEYS.wishlist,wishlist);

  renderProducts();
  renderWishlist();
  updateCounters();
  updateProfile();
}

function renderWishlist(){

  const content = $("wishlistContent");
  const empty = $("wishlistEmpty");

  content.innerHTML = "";

  if(wishlist.length === 0){

    empty.style.display = "flex";

    return;
  }

  empty.style.display = "none";

  wishlist.forEach(id => {

    const product = productById(id);

    if(!product) return;

    const row = document.createElement("div");

    row.className = "cart-item";

    row.innerHTML = `
      <img
        src="${product.image}"
        alt="${safe(product.name)}"
      >

      <div>
        <h4>${safe(product.name)}</h4>

        <div class="item-meta">
          ${money(product.price)}
        </div>

        <button
          class="mobile-add"
          style="display:block;margin-top:10px"
          data-wishlist-action="add"
          data-id="${product.id}"
        >
          ADD TO BAG →
        </button>
      </div>

      <button
        class="remove"
        data-wishlist-action="remove"
        data-id="${product.id}"
      >
        REMOVE
      </button>
    `;

    content.appendChild(row);
  });
}

/* =========================================
   QUICK VIEW
========================================= */

function openQuickView(id){

  const product = productById(id);

  if(!product) return;

  quickProduct = product;
  selectedSize = "M";

  $("quickImage").src = product.image;
  $("quickImage").alt = product.name;
  $("quickCategory").textContent = product.category;
  $("quickName").textContent = product.name;
  $("quickPrice").textContent = money(product.price);
  $("quickDescription").textContent = product.description;

  document.querySelectorAll("#sizes button")
    .forEach(button => {
      button.classList.toggle(
        "selected",
        button.dataset.size === "M"
      );
    });

  openModal($("quickModal"));
}

/* =========================================
   AUTH
========================================= */

function openAccount(){

  if(currentUser){
    updateProfile();
    openProfile();
    return;
  }

  signupMode = false;
  updateAuthMode();
  openModal($("authModal"));
}

function updateAuthMode(){

  document.querySelectorAll(".signup-field")
    .forEach(field => {
      field.classList.toggle(
        "hidden",
        !signupMode
      );
    });

  $("authLabel").textContent =
    signupMode ? "JOIN VS THREADS" : "WELCOME BACK";

  $("authTitle").textContent =
    signupMode
      ? "Create your account"
      : "Sign in to your account";

  $("authDescription").textContent =
    signupMode
      ? "Create your account to save favourites and manage orders."
      : "Access your profile, orders and saved items.";

  $("authSubmit").textContent =
    signupMode ? "CREATE ACCOUNT" : "SIGN IN";

  $("authSwitchText").textContent =
    signupMode
      ? "Already have an account?"
      : "Don't have an account?";

  $("authSwitch").textContent =
    signupMode ? "Sign in" : "Create one";
}

function handleAuth(event){

  event.preventDefault();

  const email =
    $("authEmail").value.trim();

  const password =
    $("authPassword").value.trim();

  if(!email || !password){

    showToast("Please complete the form");

    return;
  }

  if(password.length < 4){

    showToast("Password must be at least 4 characters");

    return;
  }

  if(signupMode){

    const name =
      $("authName").value.trim();

    if(!name){

      showToast("Please enter your name");

      $("authName").focus();

      return;
    }

    currentUser = {
      name:name,
      email:email
    };

    showToast("Account created successfully");

  }else{

    currentUser = {
      name:email
        .split("@")[0]
        .replace(/[._-]/g," ")
        .replace(/\b\w/g,c => c.toUpperCase()),
      email:email
    };

    showToast("Welcome back");
  }

  setStorage(KEYS.user,currentUser);

  $("authForm").reset();

  closeModal($("authModal"));

  updateProfile();

  setTimeout(() => {
    openProfile();
  },250);
}

/* =========================================
   PROFILE
========================================= */

function openProfile(){

  if(!currentUser){

    openAccount();

    return;
  }

  updateProfile();

  $("profile").classList.add("show");

  document.body.classList.add("lock");
}

function closeProfile(){

  $("profile").classList.remove("show");

  document.body.classList.remove("lock");
}

function updateProfile(){

  if(!currentUser) return;

  $("profileName").textContent =
    currentUser.name;

  $("profileEmail").textContent =
    currentUser.email;

  const initials =
    currentUser.name
      .split(" ")
      .filter(Boolean)
      .map(word => word[0])
      .join("")
      .slice(0,2)
      .toUpperCase();

  $("avatar").textContent =
    initials || "VS";

  $("orderCount").textContent =
    orders.length;

  $("savedCount").textContent =
    wishlist.length;

  $("bagCount").textContent =
    totalItems();

  renderOrders();
}

function renderOrders(){

  const list = $("ordersList");
  const empty = $("noOrders");

  list.innerHTML = "";

  if(orders.length === 0){

    empty.style.display = "block";

    return;
  }

  empty.style.display = "none";

  orders
    .slice()
    .reverse()
    .forEach(order => {

      const card =
        document.createElement("div");

      card.className = "order-card";

      card.innerHTML = `
        <div>
          <strong>${safe(order.id)}</strong>
          <small>${safe(order.date)}</small>
        </div>

        <div>
          <strong>${money(order.total)}</strong>
          <small>${order.items} item(s)</small>
        </div>

        <span class="order-status">
          ${safe(order.status)}
        </span>
      `;

      list.appendChild(card);
    });
}

/* =========================================
   CHECKOUT
========================================= */

function openCheckout(){

  if(cart.length === 0){

    showToast("Your bag is empty");

    return;
  }

  const summary =
    $("checkoutSummary");

  summary.innerHTML = "";

  cart.forEach(item => {

    const product =
      productById(item.id);

    if(!product) return;

    const row =
      document.createElement("div");

    row.className = "summary-row";

    row.innerHTML = `
      <span>
        ${safe(product.name)} × ${item.quantity}
      </span>

      <strong>
        ${money(product.price * item.quantity)}
      </strong>
    `;

    summary.appendChild(row);
  });

  if(currentUser){
    $("checkoutName").value =
      currentUser.name;
  }

  openModal($("checkoutModal"));
}

function placeOrder(event){

  event.preventDefault();

  if(cart.length === 0){

    showToast("Your bag is empty");

    closeModal($("checkoutModal"));

    return;
  }

  const name =
    $("checkoutName").value.trim();

  const phone =
    $("checkoutPhone").value.trim();

  const address =
    $("checkoutAddress").value.trim();

  if(!name || !phone || !address){

    showToast("Complete delivery details");

    return;
  }

  const orderId =
    "VST-" +
    Math.floor(
      100000 +
      Math.random() * 900000
    );

  const order = {

    id:orderId,

    date:new Date().toLocaleDateString(
      "en-IN",
      {
        day:"2-digit",
        month:"short",
        year:"numeric"
      }
    ),

    total:cartTotal(),

    items:totalItems(),

    status:"ORDER PLACED"
  };

  orders.push(order);

  setStorage(KEYS.orders,orders);

  cart = [];

  setStorage(KEYS.cart,cart);

  $("checkoutForm").reset();

  closeModal($("checkoutModal"));

  renderCart();
  updateCounters();
  updateProfile();

  showToast(`Order ${orderId} placed successfully`);
}

/* =========================================
   TRACKING
========================================= */

function trackOrder(event){

  event.preventDefault();

  const id =
    $("trackInput")
      .value
      .trim()
      .toUpperCase();

  if(!id){

    showToast("Enter your order ID");

    return;
  }

  const order =
    orders.find(
      item => item.id === id
    );

  const result =
    $("trackResult");

  result.classList.remove("hidden");

  if(order){

    result.innerHTML = `
      <strong>${safe(order.id)}</strong>

      <p>
        Status: <b>${safe(order.status)}</b><br>
        Order date: ${safe(order.date)}<br>
        Total: ${money(order.total)}
      </p>
    `;

  }else{

    result.innerHTML = `
      <strong>Order not found</strong>

      <p>
        This order ID isn't available in this
        demo store. Please check the ID and try again.
      </p>
    `;
  }
}

/* =========================================
   MODALS / DRAWERS
========================================= */

function openModal(element){

  element.classList.add("show");

  document.body.classList.add("lock");
}

function closeModal(element){

  element.classList.remove("show");

  if(
    !$("cartDrawer").classList.contains("open") &&
    !$("wishlistDrawer").classList.contains("open") &&
    !$("profile").classList.contains("show")
  ){
    document.body.classList.remove("lock");
  }
}

function openDrawer(element){

  closeDrawer($("cartDrawer"));
  closeDrawer($("wishlistDrawer"));

  element.classList.add("open");

  $("overlay").classList.add("show");

  document.body.classList.add("lock");
}

function closeDrawer(element){

  element.classList.remove("open");

  const cartOpen =
    $("cartDrawer").classList.contains("open");

  const wishlistOpen =
    $("wishlistDrawer").classList.contains("open");

  if(!cartOpen && !wishlistOpen){

    $("overlay").classList.remove("show");

    if(!$("profile").classList.contains("show")){
      document.body.classList.remove("lock");
    }
  }
}

function closeAll(){

  closeDrawer($("cartDrawer"));
  closeDrawer($("wishlistDrawer"));

  closeModal($("authModal"));
  closeModal($("quickModal"));
  closeModal($("checkoutModal"));
  closeModal($("trackModal"));

  closeProfile();

  $("overlay").classList.remove("show");

  document.body.classList.remove("lock");
}

/* =========================================
   COUNTERS
========================================= */

function updateCounters(){

  $("cartCount").textContent =
    totalItems();

  $("wishlistCount").textContent =
    wishlist.length;
}

/* =========================================
   CART ICON ANIMATION
========================================= */

function animateCartIcon(){

  const icon =
    $("cartButton");

  icon.animate(
    [
      {
        transform:"scale(1)"
      },
      {
        transform:"scale(1.16)"
      },
      {
        transform:"scale(1)"
      }
    ],
    {
      duration:400,
      easing:"ease-out"
    }
  );
}

/* =========================================
   TOAST
========================================= */

function showToast(message){

  $("toastText").textContent =
    message;

  $("toast").classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(() => {
      $("toast").classList.remove("show");
    },2600);
}

/* =========================================
   REVEAL ANIMATION
========================================= */

function setupReveal(){

  const elements =
    document.querySelectorAll(".reveal");

  if(!("IntersectionObserver" in window)){

    elements.forEach(
      element =>
        element.classList.add("visible")
    );

    return;
  }

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if(entry.isIntersecting){

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );
          }

        });

      },
      {
        threshold:.12
      }
    );

  elements.forEach(
    element => observer.observe(element)
  );
}

/* =========================================
   EVENTS
========================================= */

function bindEvents(){

  /* Mobile menu */

  $("menuToggle").addEventListener(
    "click",
    () => {
      $("mobileNav").classList.toggle("open");
    }
  );

  document
    .querySelectorAll(".mobile-nav a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {
          $("mobileNav")
            .classList.remove("open");
        }
      );

    });

  /* Search */

  $("searchButton").addEventListener(
    "click",
    () => {

      $("shop").scrollIntoView({
        behavior:"smooth"
      });

      setTimeout(
        () => $("searchInput").focus(),
        500
      );
    }
  );

  $("searchInput").addEventListener(
    "input",
    event => {

      searchQuery =
        event.target.value;

      renderProducts();
    }
  );

  /* Filters */

  $("filters").addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(".filter");

      if(!button) return;

      activeCategory =
        button.dataset.category;

      document
        .querySelectorAll(".filter")
        .forEach(
          item =>
            item.classList.remove("active")
        );

      button.classList.add("active");

      renderProducts();
    }
  );

  /* Product actions */

  $("products").addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-action]"
        );

      if(!button) return;

      const id =
        Number(button.dataset.id);

      const action =
        button.dataset.action;

      if(action === "add"){
        addToCart(id,"M");
      }

      if(action === "wishlist"){
        toggleWishlist(id);
      }

      if(action === "quick"){
        openQuickView(id);
      }

    }
  );

  /* Cart */

  $("cartButton").addEventListener(
    "click",
    () => {
      renderCart();
      openDrawer($("cartDrawer"));
    }
  );

  $("closeCart").addEventListener(
    "click",
    () =>
      closeDrawer($("cartDrawer"))
  );

  $("cartContent").addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-cart-action]"
        );

      if(!button) return;

      const id =
        Number(button.dataset.id);

      const size =
        button.dataset.size;

      const action =
        button.dataset.cartAction;

      if(action === "plus"){
        changeQuantity(id,size,1);
      }

      if(action === "minus"){
        changeQuantity(id,size,-1);
      }

      if(action === "remove"){
        removeCartItem(id,size);
      }

    }
  );

  $("shopFromCart").addEventListener(
    "click",
    () => {

      closeDrawer($("cartDrawer"));

      $("shop").scrollIntoView({
        behavior:"smooth"
      });
    }
  );

  /* Wishlist */

  $("wishlistButton").addEventListener(
    "click",
    () => {

      renderWishlist();

      openDrawer(
        $("wishlistDrawer")
      );
    }
  );

  $("closeWishlist").addEventListener(
    "click",
    () =>
      closeDrawer($("wishlistDrawer"))
  );

  $("wishlistContent").addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-wishlist-action]"
        );

      if(!button) return;

      const id =
        Number(button.dataset.id);

      const action =
        button.dataset.wishlistAction;

      if(action === "remove"){
        toggleWishlist(id);
      }

      if(action === "add"){
        addToCart(id,"M");
      }

    }
  );

  /* Account */

  $("accountButton").addEventListener(
    "click",
    openAccount
  );

  $("footerAccount").addEventListener(
    "click",
    openAccount
  );

  /* Auth */

  $("closeAuth").addEventListener(
    "click",
    () =>
      closeModal($("authModal"))
  );

  $("authSwitch").addEventListener(
    "click",
    () => {

      signupMode =
        !signupMode;

      updateAuthMode();
    }
  );

  $("authForm").addEventListener(
    "submit",
    handleAuth
  );

  /* Quick */

  $("closeQuick").addEventListener(
    "click",
    () =>
      closeModal($("quickModal"))
  );

  $("sizes").addEventListener(
    "click",
    event => {

      const button =
        event.target.closest("button");

      if(!button) return;

      selectedSize =
        button.dataset.size;

      document
        .querySelectorAll("#sizes button")
        .forEach(
          item =>
            item.classList.remove("selected")
        );

      button.classList.add("selected");
    }
  );

  $("quickAdd").addEventListener(
    "click",
    () => {

      if(!quickProduct) return;

      addToCart(
        quickProduct.id,
        selectedSize
      );

      closeModal($("quickModal"));

      setTimeout(
        () =>
          openDrawer($("cartDrawer")),
        250
      );
    }
  );

  /* Checkout */

  $("checkoutButton").addEventListener(
    "click",
    openCheckout
  );

  $("closeCheckout").addEventListener(
    "click",
    () =>
      closeModal($("checkoutModal"))
  );

  $("checkoutForm").addEventListener(
    "submit",
    placeOrder
  );

  /* Tracking */

  $("footerTrack").addEventListener(
    "click",
    () =>
      openModal($("trackModal"))
  );

  $("profileTracking").addEventListener(
    "click",
    () =>
      openModal($("trackModal"))
  );

  $("closeTrack").addEventListener(
    "click",
    () =>
      closeModal($("trackModal"))
  );

  $("trackForm").addEventListener(
    "submit",
    trackOrder
  );

  /* Profile */

  $("profileBack").addEventListener(
    "click",
    closeProfile
  );

  $("profileOrders").addEventListener(
    "click",
    () => {

      $("ordersList").scrollIntoView({
        behavior:"smooth"
      });
    }
  );

  $("profileWishlist").addEventListener(
    "click",
    () => {

      closeProfile();

      renderWishlist();

      openDrawer(
        $("wishlistDrawer")
      );
    }
  );

  $("profileShop").addEventListener(
    "click",
    () => {

      closeProfile();

      $("shop").scrollIntoView({
        behavior:"smooth"
      });
    }
  );

  $("logout").addEventListener(
    "click",
    () => {

      currentUser = null;

      localStorage.removeItem(
        KEYS.user
      );

      closeProfile();

      showToast("Logged out successfully");
    }
  );

  /* Overlay */

  $("overlay").addEventListener(
    "click",
    closeAll
  );

  /* Support */

  $("support").addEventListener(
    "click",
    () => {
      showToast(
        "WhatsApp support will be connected here"
      );
    }
  );

  $("footerSupport").addEventListener(
    "click",
    () => {
      showToast(
        "WhatsApp support will be connected here"
      );
    }
  );

  /* Escape */

  document.addEventListener(
    "keydown",
    event => {

      if(event.key === "Escape"){
        closeAll();
      }

    }
  );

  /* Modal background click */

  [
    $("authModal"),
    $("quickModal"),
    $("checkoutModal"),
    $("trackModal")
  ].forEach(modal => {

    modal.addEventListener(
      "click",
      event => {

        if(event.target === modal){
          closeModal(modal);
        }

      }
    );

  });
}