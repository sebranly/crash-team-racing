var rawData = {
  "responseJSON": {
    "main": [
      {
        "id": 1,
        "tags": ["gameplay"],
        "text": "CTR:NF should have the same game mechanics as CTR"
      },
      {
        "id": 2,
        "text": "CTR:NF should have an online multiplayer mode"
      }
    ]
  }
};

var getNormalizedText = (text) => {
  var replacements = [
    ['CTR:NF', 'CTRNF']
  ];
  var newText = text;
  replacements.forEach((replacement) => {
    newText = newText.replace(new RegExp(replacement[0], 'g'), replacement[1]);
  });
  return newText;
};

var data = {
  ...rawData,
  responseJSON: {
    ...rawData.responseJSON,
    main: rawData.responseJSON.main.map((el) => {
      var currentTags = el.tags || [];
      var automatedTags = ['CTR', 'CTR:NF', 'multiplayer', 'online'];
      var newTags = [];
      var text = getNormalizedText(el.text);
      automatedTags.forEach((automatedTag) => {
        var normalizedAutomatedTag = getNormalizedText(automatedTag);
        var regexWholeWord = new RegExp("(^|\\W)" + normalizedAutomatedTag + "($|\\W)");
        if (!currentTags.includes(automatedTag) && regexWholeWord.test(text)) {
          newTags.push(automatedTag)
        }
      });
      return { ...el, tags: [...currentTags, ...newTags] };
    })
  }
};

// alert(JSON.stringify(data.responseJSON.main, null, 4));

function updateList() {
  clearScreen();
  var items = "";
  var searchText = $("#category_text_search").val();

  var items = [];
  if (searchText === "") {
    $.each(data.responseJSON.main, function(index, value) {
      items.push(value);
    });
  } else {
    $.each(data.responseJSON.main, function(index, value) {
      if (value.tags.includes(searchText)) {
        items.push(value);
      }
    });
  }

  if (items.length > 0) {
    liItems = items.map((item) => "<li id='" + item.id + "'>" + item.text + "</li>").join("");
    $("#raw_list").html("<ul>" + liItems + "</ul><button id='clear_screen'>Clear List</button>");
    $("#clear_screen").click(function() {
      clearScreen();
    });
  }
}

function clearScreen() {
  $("#raw_list").html('');
}

function clickTag(tag) {
  $("#category_text_search").val(tag);
  $("#search_button").click();
}

function clearTextSearch() {
  $("#category_text_search").val("");
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

  var allTags = [];
  data.responseJSON.main.map((el) => {
    if (el.tags) {
      el.tags.forEach((tag) => {
        if (!allTags.includes(tag)) {
          allTags.push(tag);
        }
      });
    }
  });
  $("#available_tags").html("<ul>" + allTags.sort().map(
    (tag) => `<li><button id='click_tag_${tag}' class='click_tag'>${tag}</button></li>`
  ).join("") + "</ul>");
  $(".click_tag").click(function() {
    clickTag(this.id.replace('click_tag_', ''));
  });
  $("#clear_text_search_button").click(function() {
    clearTextSearch();
  });
});