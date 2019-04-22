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
        "confirmed": true,
        "confirmedSource": "https://youtu.be/WgwA1gYDb5Q?t=29",
        "text": "CTR:NF will have an online multiplayer mode"
      },
      {
        "id": 3,
        "tags": ["multiplayer", "options", "split-screen"],
        "text": "CTR:NF should allow players to split the screen vertically or horizontally when there are two players"
      },
      {
        "id": 4,
        "tags": ["graphics"],
        "text": "CTR:NF should have 60 FPS support (with smart fallback mechanism for multiplayer)"
      },
      {
        "id": 5,
        "tags": ["platform"],
        "text": "CTR:NF should be available on PC"
      },
      {
        "id": 6,
        "tags": ["platform"],
        "text": "CTR:NF should enable cross-play for online gaming (between PS4, Switch, Xbox One [beg_dep_id=5]and PC[end_dep_id])"
      },
      {
        "id": 7,
        "text": "CTR:NF should have online split-screen (at the same time, [beg_ext=https://callofduty.fandom.com/wiki/Split_Screen]like Call Of Duty: Black Ops[end_ext] for instance)"
      },
      {
        "id": 8,
        "tags": ["graphics"],
        "text": "CTR:NF should have 4K support (with smart fallback mechanism for multiplayer)"
      },
      {
        "id": 9,
        "correction": "It is being developed by [beg_ext=https://twitter.com/BeenoxTeam]Beenox[end_ext] instead",
        "text": "CTR:NF should be developed by Naughty Dog like CTR"
      }
    ]
  }
};

var getNormalizedText = (text) => {
  if (!text) return undefined;
  var replacements = [
    ['CTR:NF', 'CTRNF'],
    ["single-player", "singleplayer"],
    ["split-screen", "splitscreen"]
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
      var text = getNormalizedText(el.text);
      var correction = getNormalizedText(el.correction);
      var newTags = correction ? ['deprecated'] : [];

      var automatedTags = [
        'Beenox',
        'CTR',
        'CTR:NF',
        'multiplayer',
        'Naughty Dog',
        'online',
        'PC',
        'PS4',
        'split-screen',
        'Switch',
        'Xbox One'
      ];
      automatedTags.forEach((automatedTag) => {
        var normalizedAutomatedTag = getNormalizedText(automatedTag);
        var regexWholeWord = new RegExp("(^|\\W)" + normalizedAutomatedTag + "($|\\W)");
        if (!currentTags.includes(automatedTag) && (regexWholeWord.test(text) || regexWholeWord.test(correction))) {
          newTags.push(automatedTag)
        }
      });

      var dependentTags = [
        ['online', 'multiplayer'],
        ['graphics', 'options']
      ];
      dependentTags.forEach(([dependentTag, parentTag]) => {
        var normalizedDependentTag = getNormalizedText(dependentTag);
        var regexWholeWord = new RegExp("(^|\\W)" + normalizedDependentTag + "($|\\W)");
        if (!currentTags.includes(parentTag) && !newTags.includes(parentTag) && (regexWholeWord.test(text) || currentTags.includes(dependentTag))) {
          newTags.push(parentTag)
        }
      });

      return { ...el, tags: [...currentTags, ...newTags] };
    })
  }
};

// alert(JSON.stringify(data.responseJSON.main, null, 4));

function linkId(id) {
  $("#category_text_search").val(`id=${id}`);
  $("#search_button").click();
}

function safeLinkAttributes() {
  return "target='_blank' rel='noopener noreferrer'";
}

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
    var exactIdRegex = /^id=(\d+)$/;
    if (exactIdRegex.test(searchText)) {
      var exactId = parseInt(searchText.match(exactIdRegex)[1], 10);
      $.each(data.responseJSON.main, function(index, value) {
        if (value.id === exactId) {
          items.push(value);
        }
      });
    } else {
      $.each(data.responseJSON.main, function(index, value) {
        if (value.tags.includes(searchText)) {
          items.push(value);
        }
      });
    }
  }

  if (items.length > 0) {
    function makeTextReplacements(text) {
      if (!text) return undefined;
      return text
        .replace(new RegExp('\\[beg_dep_id=', 'g'), "<div class='link_id' id='link_id_")
        .replace(new RegExp('\\[end_dep_id\\]', 'g'), '</div>')
        .replace(new RegExp('\\[beg_ext=', 'g'), `<a class='link_ext' ${safeLinkAttributes()} href='`)
        .replace(new RegExp('\\[end_ext\\]', 'g'), '</a>')
        .replace(/\]/g, "'>");
    }

    liItems = items.map((item) => {
      var rawText = makeTextReplacements(item.text);
      var rawCorrection = makeTextReplacements(item.correction);
      var confirmed = item.confirmed;
      var confirmedSource = item.confirmedSource;

      var htmlString = "<li id='" + item.id + "'>";

      if (rawCorrection) {
        htmlString += "<div class='deprecated_text'>" + rawText + "</div>" + rawCorrection;
      } else if (confirmed) {
        htmlString += "<div class='confirmed_text'>" + rawText + "</div>";
        if (confirmedSource) {
          htmlString += `<a class='link_ext' ${safeLinkAttributes()} href='${confirmedSource}'>(source)</a>`;
        }
      } else {
        htmlString += rawText;
      }
      return htmlString + " [" + item.tags.join(', ') + "]" + "</li>";
    }).join("");
    $("#raw_list").html("<ul>" + liItems + "</ul><button id='clear_screen'>Clear List</button>");

    $(".link_id").click(function() {
      linkId(this.id.replace('link_id_', ''));
    });
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
  $("#available_tags").html("<ul>" + allTags.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }).map(
    (tag) => `<li><button id='click_tag_${tag}' class='click_tag'>${tag}</button></li>`
  ).join("") + "</ul>");
  $(".click_tag").click(function() {
    clickTag(this.id.replace('click_tag_', ''));
  });
  $("#clear_text_search_button").click(function() {
    clearTextSearch();
  });
});