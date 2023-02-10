$(document).ready(function () {
  console.log("ready");
  // --- our code goes here ---


  const $sold = $(".sold-button");

  $sold.on("click", function (event) {
    const $image = $(`#${event.target.name} .sold-image`);
    const isSold = $image.hasClass("sold-image-visable")
    $image.toggleClass("sold-image-visable");
    const listingId = event.target.name;

    if (listingId) {
      url = `/admin/items/${listingId}/update`;
      method = "PUT";

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listing_id: listingId ,sold_status:isSold }),
      }).then((response) => response.json());
    }
  });

  const $delete = $(".delete-button");

  $delete.on("click", function (event) {
    event.preventDefault();
    const listingId = event.target.name;

    if (listingId) {
      url = `/admin/items/${listingId}/delete`;
      method = "DELETE";
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listing_id: listingId }),
      })
        .then((response) => (response.json()))
        .catch((error) => console.error("Error:", error));
    }
    window.location.href = '/admin';
  });

});
