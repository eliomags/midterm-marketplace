$(document).ready(function () {
  console.log("ready");
  // --- our code goes here ---

  const $sold = $(".sold-button");
  
  $sold.on("click", function (event) {
    const $image = $(`#${event.target.name} .sold-image`)
    $image.toggleClass("sold-image-visable");

  })
  });
