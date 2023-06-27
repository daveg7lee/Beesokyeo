document.addEventListener("DOMContentLoaded", function () {
  var wordForm = document.getElementById("wordForm");
  var wordInput = document.getElementById("wordInput");
  var wordList = document.getElementById("wordList");
  var getUrlButton = document.getElementById("getUrlButton");

  // Load existing words from storage
  loadWords();

  wordForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var word = wordInput.value.trim();
    if (word !== "") {
      addWord(word);
      wordInput.value = "";
      wordInput.focus();
    }
  });

  wordList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      var li = event.target.parentNode;
      var word = li.firstChild.textContent;
      deleteWord(li, word);
    }
  });

  function addWord(word) {
    var li = createListItem(word);
    wordList.appendChild(li);
    saveWords();
  }

  function deleteWord(li, word) {
    li.remove();
    removeWord(word);
    saveWords();
  }

  function createListItem(word) {
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.textContent = word;
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    li.appendChild(span);
    li.appendChild(deleteButton);
    return li;
  }

  function saveWords() {
    var words = Array.from(wordList.getElementsByTagName("li")).map(function (
      li
    ) {
      return li.firstChild.textContent;
    });
    chrome.storage.local.set({ wordList: words });
  }

  function removeWord(word) {
    chrome.storage.local.get("wordList", function (result) {
      var words = result.wordList || [];
      var index = words.indexOf(word);
      if (index !== -1) {
        words.splice(index, 1);
        chrome.storage.local.set({ wordList: words });
      }
    });
  }

  function loadWords() {
    chrome.storage.local.get("wordList", function (result) {
      var words = result.wordList || [];
      words.forEach(function (word) {
        var li = createListItem(word);
        wordList.appendChild(li);
      });
    });
  }
  function getCurrentURL() {
    return window.location.href;
  }

  // Event listener for the button click
  var getUrlButton = document.getElementById("getUrlButton");
  getUrlButton.addEventListener("click", function () {
    var currentURL = getCurrentURL();
    console.log(currentURL); // You can modify this line to do something with the URL
  });
});
