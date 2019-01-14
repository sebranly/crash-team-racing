var data = $.getJSON("data.json");

function updateList() {
  var items = "";
  $.each(data.responseJSON.main, function(index, value) {
    items = items + "<li id='" + value.id + "'>" + value.text + "</li>";
  });
  $("#raw_list").html("<ul>" + items + "</ul>");
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