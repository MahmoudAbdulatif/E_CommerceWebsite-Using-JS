const reviewForm = document.getElementById("reviewForm");
const reviewsContainer = document.getElementById("reviewsContainer");
const productId = new URLSearchParams(window.location.search).get("id");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser || currentUser.role !== "customer") {
    alert("You must be logged in as a customer to leave a review.");
    return;
  }

  const rating = parseInt(document.getElementById("rating").value);
  const comment = document.getElementById("comment").value.trim();

  const review = {
    productId: productId,
    userId: currentUser.id,
    username: currentUser.username,
    rating: rating,
    comment: comment
  };

  await fetch("http://localhost:3000/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review)
  });

  alert("Review submitted!");
  reviewForm.reset();
  loadReviews();
});

async function loadReviews() {
  const res = await fetch(`http://localhost:3000/reviews?productId=${productId}`);
  const reviews = await res.json();

  const html = reviews.map(r => `
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 10px;">
      <strong>${r.username}</strong> - ⭐ ${r.rating}
      <p>${r.comment || ''}</p>
    </div>
  `).join("");

  reviewsContainer.innerHTML = `<h3>Reviews</h3>${html}`;
}

loadReviews();
