// Client facing scripts here

// const { getFeaturedItems } = require("../../db/queries/users");

function toggleFavourite(event, id) {
  event.preventDefault();
  console.log("THE ID", id);
  const icon = event.target;
  icon.classList.toggle("favourited");

  const data = { listing_id: id };

  // Send POST request to add/remove item from favourites list
  fetch("/favourites", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function updateFavoriteStatus(itemId, addToFavorites) {
  // Make a request to the server to update the favorite status of the item
  fetch("/update-favorite-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemId,
      addToFavorites,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Update the UI to reflect the updated favorite status of the item
      if (data.success) {
        const hearts = document.querySelectorAll(
          `.fa-heart[onclick="updateFavoriteStatus('${itemId}', ${!addToFavorites})"]`
        );
        hearts.forEach((heart) => {
          heart.style.color = addToFavorites ? "red" : "grey";
        });
      } else {
        console.error("Failed to update favorite status of item", itemId);
      }
    });
}

//drop down in partial header to send selection to get request
function submitForm() {
  const select = document.getElementById("price-range-select");
  const selectedValue = select.options[select.selectedIndex].value;
  const [minPrice, maxPrice] = selectedValue
    .split("-")
    .map((val) => val.trim());

  // Add the min_price and max_price as query parameters to the URL
  const queryParams = [];
  if (minPrice) {
    queryParams.push(`min_price=${minPrice.substring(1)}`);
  }

  if (maxPrice) {
    queryParams.push(`max_price=${maxPrice.substring(1)}`);
  }

  window.location.href = `/items?${queryParams.join("&")}`;
}
