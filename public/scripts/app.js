// Client facing scripts here

// const { getFeaturedItems } = require("../../db/queries/users");

// function toggleFavourite(icon) {
//   // Check if the icon has the "fa-heart-o" class
//   if (icon.classList.contains("fa-heart-o")) {
//     // If yes, remove the "fa-heart-o" class and add the "fa-heart" class
//     icon.classList.remove("fa-heart-o");
//     icon.classList.add("fa-heart");
//   } else {
//     // If no, remove the "fa-heart" class and add the "fa-heart-o" class
//     icon.classList.remove("fa-heart");
//     icon.classList.add("fa-heart-o");
//   }

//   $.ajax({
//     url: "/favourites",
//     type: "POST",
//     data: {
//       listing_id: icon.dataset.id,
//     },
//     success: function (result) {
//       console.log(result);
//     },
//     error: function (error) {
//       console.error(error);
//     },
//   });
// }

async function toggleFavourite(event, id) {
  event.preventDefault();
  console.log("THE ID", id);
  const icon = event.target;
  const isFavorited = icon.classList.contains("favourited");

  // Send a GET request to check if the item is already in the favorites list
  const response = await fetch(`/favourites/${id}`);
  const data = await response.json();
  if (data.inFavorites) {
    // Item is already in the favorites, remove it
    const deleteResponse = await fetch(`/favourites/${id}`, {
      method: "DELETE",
    });
    if (deleteResponse.ok) {
      icon.classList.remove("favourited");
      // Update the page if necessary
    }
  } else {
    // Item is not in the favorites, add it
    const postResponse = await fetch("/favourites", {
      method: "POST",
      body: JSON.stringify({ listing_id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (postResponse.ok) {
      icon.classList.add("favourited");
      // Update the page if necessary
    }
  }
}

// async function unToggleFavourite(event, id) {
//   event.preventDefault();
//   const icon = event.target;
//   icon.classList.toggle("favourited");
//   const isFavourited = icon.classList.contains("favourited");
//   const data = { listing_id: id };

//   const response = await fetch("/favourites", {
//     method: isFavourited ? "DELETE" : "POST",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (response.ok) {
//     // remove the item from the UI if it was successfully unfavorited
//     if (!isFavourited) {
//       const item = document.querySelector(`[data-id="${id}"]`);
//       item.remove();
//     }
//   }
// }

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
