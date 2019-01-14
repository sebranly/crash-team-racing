var allItems = $.getJSON("data.json", function(data) {
  var items = [];
  console.log('Debug:');
  console.log(data);
  console.log(data.main);
  $.each(data.main, function(index, value) {
    console.log('index');
    console.log(index);
    console.log('value');
    console.log(value);
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