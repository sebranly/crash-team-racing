var allItems = $.getJSON("data.json", function(data) {
  var items = [];
  $.each(data.main, function(index, value) {
    items.push("<li id='" + value.id + "'>" + value.text + "</li>");
  });
  return items;
});

function updateList() {
  $("#raw_list").html("<ul>" + allItems + "</ul>");
}

$(document).ready(function() {
  $("#category_text_search").keypress(function (e) {
    if (e.which == 13) {
      $("#search_button").click();
      return false;
    }
  });

  $("#search_button").click(function() {
    updateList();
  });
});