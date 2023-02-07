// Client facing scripts here

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

function toggleFavorite(event) {
  const icon = event.target;
  icon.classList.toggle("favorited");

  // Send POST request to add/remove item from favorites list
  fetch("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ itemId: featuredItems[i].id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
