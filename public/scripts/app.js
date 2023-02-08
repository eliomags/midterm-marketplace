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

function toggleFavourite(event, id) {
  event.preventDefault();
  console.log("THE ID", id)
  const icon = event.target;
  icon.classList.toggle("favourited");

  const data = { listing_id: id};

  // Send POST request to add/remove item from favourites list
  fetch("/favourites", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
