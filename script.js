// ==========================================
// VS THREADS — STEP 3
// Product interactions
// ==========================================


// SEARCH

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {

  searchBtn.addEventListener("click", () => {

    alert("Search system will be added in the next step.");

  });

}


// CART

const cartBtn = document.getElementById("cartBtn");

if (cartBtn) {

  cartBtn.addEventListener("click", () => {

    alert("Cart system will be added soon.");

  });

}


// ==========================================
// WISHLIST
// ==========================================

const wishlistButtons =
  document.querySelectorAll(".wishlist");

wishlistButtons.forEach((button) => {

  button.addEventListener("click", (event) => {

    event.stopPropagation();

    if (button.textContent.trim() === "♡") {

      button.textContent = "♥";

    } else {

      button.textContent = "♡";

    }

  });

});


// ==========================================
// QUICK ADD
// ==========================================

const quickAddButtons =
  document.querySelectorAll(".quick-add");

quickAddButtons.forEach((button) => {

  button.addEventListener("click", (event) => {

    event.stopPropagation();

    const card =
      button.closest(".product-card");

    const product =
      card.querySelector("h3").textContent;

    button.textContent = "✓";

    console.log(
      `${product} added to cart`
    );

    setTimeout(() => {

      button.textContent = "+";

    }, 1200);

  });

});