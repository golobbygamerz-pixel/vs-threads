// VS THREADS — Base interactions

const searchBtn = document.getElementById("searchBtn");
const cartBtn = document.getElementById("cartBtn");

searchBtn.addEventListener("click", () => {
  alert("Search system coming in the next step.");
});

cartBtn.addEventListener("click", () => {
  alert("Cart system coming soon.");
});


// Wishlist interaction

const wishlistButtons = document.querySelectorAll(".wishlist");

wishlistButtons.forEach((button) => {

  button.addEventListener("click", (event) => {

    event.stopPropagation();

    button.textContent =
      button.textContent === "♡" ? "♥" : "♡";

  });

});