// Client facing scripts here

function toggleFavourite(icon) {
  icon.classList.toggle("fa-heart");
  icon.classList.toggle("fa-heart-o");

  $.ajax({
    url: "/favourites",
    type: "POST",
    data: {
      listing_id: icon.dataset.id,
    },
    success: function (result) {
      console.log(result);
    },
    error: function (error) {
      console.error(error);
    },
  });
}
