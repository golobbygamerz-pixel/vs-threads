/* =========================================================
   VS THREADS — STEP 3
========================================================= */


// ===============================
// GLOBAL STATE
// ===============================

let cart = JSON.parse(localStorage.getItem("vs_cart")) || [];

let wishlist =
  JSON.parse(localStorage.getItem("vs_wishlist")) || [];

let authMode = "login";


// ===============================
// DOM
// ===============================

const loader =
  document.getElementById("loader");

const overlay =
  document.getElementById("overlay");

const cartDrawer =
  document.getElementById("cartDrawer");

const wishlistDrawer =
  document.getElementById("wishlistDrawer");

const authModal =
  document.getElementById("authModal");

const checkoutModal =
  document.getElementById("checkoutModal");

const trackingModal =
  document.getElementById("trackingModal");

const toast =
  document.getElementById("toast");

const cartItems =
  document.getElementById("cartItems");

const wishlistItems =
  document.getElementById("wishlistItems");

const cartCount =
  document.getElementById("cartCount");

const wishlistCount =
  document.getElementById("wishlistCount");

const cartSubtotal =
  document.getElementById("cartSubtotal");


// ===============================
// PAGE LOADER
// ===============================

window.addEventListener("load", () => {

  setTimeout(() => {

    loader.classList.add("hide");

  }, 600);

});


// ===============================
// TOAST
// ===============================

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 1800);

}


// ===============================
// MOBILE MENU
// ===============================

const menuBtn =
  document.getElementById("menuBtn");

const mobileNav =
  document.getElementById("mobileNav");

menuBtn.addEventListener("click", () => {

  mobileNav.classList.toggle("open");

});

document
  .querySelectorAll(".mobile-nav a")
  .forEach(link => {

    link.addEventListener("click", () => {

      mobileNav.classList.remove("open");

    });

  });


// ===============================
// PRODUCT DATA
// ===============================

const products = {

  1: {
    id: 1,
    name: "Essential Oversized Tee",
    price: 1499,
    category: "tshirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85"
  },

  2: {
    id: 2,
    name: "Everyday Oversized Shirt",
    price: 1999,
    category: "shirt",
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85"
  },

  3: {
    id: 3,
    name: "Signature Hoodie",
    price: 2999,
    category: "hoodie",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85"
  },

  4: {
    id: 4,
    name: "Relaxed Denim",
    price: 2799,
    category: "denim",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85"
  }

};


// ===============================
// CART
// ===============================

function saveCart() {

  localStorage.setItem(
    "vs_cart",
    JSON.stringify(cart)
  );

}


function addToCart(id) {

  const product = products[id];

  if (!product) return;

  const existing =
    cart.find(item => item.id === id);

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }

  saveCart();

  updateCart();

  showToast(
    `${product.name} added to cart`
  );

}


function removeFromCart(id) {

  cart =
    cart.filter(item => item.id !== id);

  saveCart();

  updateCart();

}


function updateCart() {

  const totalQuantity =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  cartCount.textContent =
    totalQuantity;


  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="cart-empty">
        Your cart is empty.
      </div>
    `;

    cartSubtotal.textContent = "₹0";

    return;

  }


  cartItems.innerHTML =
    cart.map(item => `

      <div class="cart-item">

        <img
          src="${item.image}"
          alt="${item.name}"
        >

        <div>

          <h4>
            ${item.name}
          </h4>

          <p>
            ₹${item.price.toLocaleString("en-IN")}
            × ${item.quantity}
          </p>

        </div>

        <button
          class="remove-item"
          onclick="removeFromCart(${item.id})"
        >
          REMOVE
        </button>

      </div>

    `).join("");


  const subtotal =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

  cartSubtotal.textContent =
    `₹${subtotal.toLocaleString("en-IN")}`;

}


function openCart() {

  closeDrawers();

  cartDrawer.classList.add("open");

  overlay.classList.add("open");

}


document
  .getElementById("cartBtn")
  .addEventListener(
    "click",
    openCart
  );


// ===============================
// PRODUCT ADD BUTTONS
// ===============================

document
  .querySelectorAll(".quick-add, .mobile-add")
  .forEach(button => {

    button.addEventListener("click", event => {

      const product =
        event.target.closest(".product");

      const id =
        Number(product.dataset.id);

      addToCart(id);

    });

  });


// ===============================
// WISHLIST
// ===============================

function saveWishlist() {

  localStorage.setItem(
    "vs_wishlist",
    JSON.stringify(wishlist)
  );

}


function toggleWishlist(id, button) {

  const exists =
    wishlist.includes(id);

  if (exists) {

    wishlist =
      wishlist.filter(
        item => item !== id
      );

    button.classList.remove("liked");

    button.textContent = "♡";

    showToast("Removed from wishlist");

  } else {

    wishlist.push(id);

    button.classList.add("liked");

    button.textContent = "♥";

    showToast("Added to wishlist");

  }

  saveWishlist();

  updateWishlistCount();

}


function updateWishlistCount() {

  wishlistCount.textContent =
    wishlist.length;

}


document
  .querySelectorAll(".product-heart")
  .forEach(button => {

    const product =
      button.closest(".product");

    const id =
      Number(product.dataset.id);

    if (wishlist.includes(id)) {

      button.classList.add("liked");

      button.textContent = "♥";

    }

    button.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        toggleWishlist(
          id,
          button
        );

      }
    );

  });


function openWishlist() {

  closeDrawers();

  renderWishlist();

  wishlistDrawer.classList.add("open");

  overlay.classList.add("open");

}


document
  .getElementById("wishlistBtn")
  .addEventListener(
    "click",
    openWishlist
  );


function renderWishlist() {

  if (!wishlist.length) {

    wishlistItems.innerHTML = `
      <div class="cart-empty">
        Your wishlist is empty.
      </div>
    `;

    return;

  }


  wishlistItems.innerHTML =
    wishlist.map(id => {

      const item =
        products[id];

      return `

        <div class="wishlist-item">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div>

            <h4>
              ${item.name}
            </h4>

            <p>
              ₹${item.price.toLocaleString("en-IN")}
            </p>

          </div>

          <button
            class="remove-item"
            onclick="removeWishlist(${id})"
          >
            REMOVE
          </button>

        </div>

      `;

    }).join("");

}


function removeWishlist(id) {

  wishlist =
    wishlist.filter(
      item => item !== id
    );

  saveWishlist();

  updateWishlistCount();

  renderWishlist();

}


// ===============================
// SEARCH + FILTER
// ===============================

const searchInput =
  document.getElementById("productSearch");

const filterButtons =
  document.querySelectorAll(".filter");

const productCards =
  document.querySelectorAll(".product");

const emptyState =
  document.getElementById("emptyState");


let currentFilter = "all";


function filterProducts() {

  const query =
    searchInput.value
      .toLowerCase()
      .trim();

  let visible = 0;


  productCards.forEach(card => {

    const name =
      card.dataset.name.toLowerCase();

    const category =
      card.dataset.category;


    const matchesSearch =
      name.includes(query);

    const matchesFilter =
      currentFilter === "all" ||
      category === currentFilter;


    if (
      matchesSearch &&
      matchesFilter
    ) {

      card.style.display = "";

      visible++;

    } else {

      card.style.display = "none";

    }

  });


  emptyState.style.display =
    visible === 0
      ? "block"
      : "none";

}


searchInput.addEventListener(
  "input",
  filterProducts
);


filterButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      filterButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      currentFilter =
        button.dataset.filter;

      filterProducts();

    }
  );

});


// ===============================
// SEARCH NAV BUTTON
// ===============================

document
  .getElementById("searchBtn")
  .addEventListener(
    "click",
    () => {

      document
        .getElementById("shop")
        .scrollIntoView({
          behavior: "smooth"
        });

      setTimeout(() => {

        searchInput.focus();

      }, 500);

    }
  );


// ===============================
// AUTH
// ===============================

function openAuth() {

  closeDrawers();

  authModal.classList.add("open");

}


function closeModals() {

  authModal.classList.remove("open");

  checkoutModal.classList.remove("open");

  trackingModal.classList.remove("open");

}


function updateAuthUI() {

  const title =
    document.getElementById("authTitle");

  const text =
    document.getElementById("authText");

  const switchBtn =
    document.getElementById("authSwitch");


  if (authMode === "login") {

    title.textContent =
      "Welcome back.";

    text.textContent =
      "New to VS THREADS?";

    switchBtn.textContent =
      "Create account";

  } else {

    title.textContent =
      "Create your account.";

    text.textContent =
      "Already have an account?";

    switchBtn.textContent =
      "Login";

  }

}


document
  .getElementById("accountBtn")
  .addEventListener(
    "click",
    openAuth
  );


document
  .getElementById("authSwitch")
  .addEventListener(
    "click",
    () => {

      authMode =
        authMode === "login"
          ? "signup"
          : "login";

      updateAuthUI();

    }
  );


document
  .getElementById("authForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();

      showToast(
        authMode === "login"
          ? "Login demo successful"
          : "Account created successfully"
      );

      closeModals();

    }
  );


// ===============================
// CHECKOUT
// ===============================

function openCheckout() {

  if (!cart.length) {

    showToast(
      "Your cart is empty"
    );

    return;

  }

  closeDrawers();

  checkoutModal.classList.add("open");

}


document
  .getElementById("checkoutForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const orderId =
        "VS" +
        Math.floor(
          100000 +
          Math.random() * 900000
        );

      localStorage.setItem(
        "vs_last_order",
        orderId
      );

      cart = [];

      saveCart();

      updateCart();

      closeModals();

      showToast(
        `Order ${orderId} placed`
      );

    }
  );


// ===============================
// ORDER TRACKING
// ===============================

function openTracking() {

  closeDrawers();

  trackingModal.classList.add("open");

}


function trackOrder() {

  const input =
    document.getElementById(
      "trackingInput"
    );

  const result =
    document.getElementById(
      "trackingResult"
    );

  const orderId =
    input.value.trim();


  if (!orderId) {

    result.innerHTML = `
      <p>
        Please enter your order ID.
      </p>
    `;

    return;

  }


  result.innerHTML = `

    <p>
      ORDER ID:
      <strong>${orderId}</strong>
    </p>

    <br>

    <p class="tracking-status">
      Order confirmed ✓
    </p>

    <p>
      Your order has been received and
      is being prepared for dispatch.
    </p>

    <br>

    <p>
      Next:
      Shipping partner pickup
    </p>

  `;

}


// ===============================
// CLOSE DRAWERS
// ===============================

function closeDrawers() {

  cartDrawer.classList.remove("open");

  wishlistDrawer.classList.remove("open");

  overlay.classList.remove("open");

}


overlay.addEventListener(
  "click",
  () => {

    closeDrawers();

    closeModals();

  }
);


function closeAll() {

  closeDrawers();

  closeModals();

}


// ===============================
// ESCAPE KEY
// ===============================

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeAll();

    }

  }
);


// ===============================
// INITIALIZE
// ===============================

updateCart();

updateWishlistCount();

updateAuthUI();