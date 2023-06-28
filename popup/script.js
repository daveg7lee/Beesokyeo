document.addEventListener("DOMContentLoaded", function () {
  const wordForm = document.getElementById("wordForm");
  const wordInput = document.getElementById("wordInput");
  const wordList = document.getElementById("wordList");
  const getUrlButton = document.getElementById("getUrlButton");

  loadWords();

  getUrlButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentUrl = tabs[0].url;

      chrome.storage.local.get("urlList", function (data) {
        var urlList = data.urlList || [];

        if (!urlList.includes(currentUrl) && currentUrl !== "") {
          urlList.push(currentUrl);

          chrome.storage.local.set({ urlList: urlList }, function () {
            console.log("URL이 저장되었습니다.");
          });
        } else {
          console.log("중복된 URL이거나 유효하지 않은 URL입니다.");
        }
      });
    });
  });

  wordForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const word = wordInput.value.trim();
    if (word !== "") {
      addWord(word);
      wordInput.value = "";
      wordInput.focus();
    }
  });

  wordList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      const li = event.target.parentNode;
      const word = li.firstChild.textContent;
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
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = word;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    li.appendChild(span);
    li.appendChild(deleteButton);
    return li;
  }

  function saveWords() {
    const words = Array.from(wordList.getElementsByTagName("li")).map(function (
      li
    ) {
      return li.firstChild.textContent;
    });
    chrome.storage.local.set({ wordList: words });
  }

  function removeWord(word) {
    chrome.storage.local.get("wordList", function (result) {
      const words = result.wordList || [];
      const index = words.indexOf(word);
      if (index !== -1) {
        words.splice(index, 1);
        chrome.storage.local.set({ wordList: words });
      }
    });
  }

  function loadWords() {
    chrome.storage.local.get("wordList", function (result) {
      const words = result.wordList || [];
      words.forEach(function (word) {
        const li = createListItem(word);
        wordList.appendChild(li);
      });
    });
  }
});
