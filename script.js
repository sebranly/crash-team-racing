var allItems = $.getJSON("data.json", function(data) {
  var items = [];
  console.log(data);
  $.each(data, function(key, val) {
    items.push("<li id='" + key + "'>" + val + "</li>");
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