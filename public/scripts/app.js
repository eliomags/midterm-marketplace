// Client facing scripts here

// const { getFeaturedItems } = require("../../db/queries/users");

// function toggleFavourite(event, id) {
//   event.preventDefault();
//   console.log("THE ID", id);
//   const icon = event.target;
//   icon.classList.toggle("favourited");

//   const data = { listing_id: id };

//   // Send POST request to add/remove item from favourites list
//   fetch("/favourites", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

function toggleFavourite(event, listingId) {
  event.preventDefault();

  // Check if the heart icon is already favourited or not
  const heartIcon = event.target;
  let isFavourited = heartIcon.classList.contains("favourited");

  // Make the AJAX call to update the favourite status in the database
  let url = "/favourites";
  let method = "POST";
  if (isFavourited) {
    url = `/favourites/${listingId}`;
    method = "DELETE";
  }

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listing_id: listingId }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Update the UI to reflect the change in favourite status
      if (isFavourited) {
        heartIcon.classList.remove("favourited");

        // Remove the item from the favourites page, if applicable
        const itemContainer = heartIcon.closest(".col-md-4");
        const favCont = heartIcon.closest(".favorites");
        if (itemContainer && favCont) {
          itemContainer.remove();
        }
      } else {
        heartIcon.classList.add("favourited");
      }
    })
    .catch((error) => {
      console.error(error);
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
