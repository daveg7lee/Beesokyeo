chrome.storage.local.get("wordList", function (result) {
  const badWords = result.wordList || [];
  let words = [];

  // 가시적인 요소들에서 비속어 필터링 수행
  function filterVisibleElements() {
    var elements = document.querySelectorAll(
      ":not(script):not(style):not(meta):not(head):not(title)"
    );
    elements.forEach(function (element) {
      filterTextNodes(element);
    });
    purifyBadWords();
  }

  // 텍스트 노드에서 비속어 필터링
  function filterTextNodes(element) {
    var treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var currentNode = treeWalker.nextNode();
    while (currentNode) {
      filterBadWords(currentNode);
      currentNode = treeWalker.nextNode();
    }
  }

  // 비속어 필터링 함수
  async function filterBadWords(node) {
    badWords.map((word) => {
      if (node.nodeValue.includes(word) && !words.includes(node)) {
        words.push(node);
      }
    });
  }

  function create2DArray(arr, size) {
    const result = [];
    const length = arr.length;

    for (let i = 0; i < length; i += size) {
      result.push(arr.slice(i, i + size));
    }

    return result;
  }

  async function purifyBadWords() {
    formattedWords = create2DArray(words, 20);

    await Promise.all(
      formattedWords.map(async (words) => {
        const values = words.map((word) => word.nodeValue);

        const res = await fetch("http://118.67.132.115/purify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: `[${values.toString()}]` }),
        });

        const json = await res.json();
        const resArray = JSON.parse(JSON.stringify(json["res"]));

        JSON.parse(resArray).map((res, index) => {
          console.log(res, words[index]["nodeValue"]);
          words[index]["nodeValue"] = res;
        });
      })
    );
  }

  chrome.storage.local.get("urlList", function (result) {
    const currentUrl = window.location.href;
    const isBlocked = result.urlList.map((url) => url.includes(currentUrl));

    if (!isBlocked.includes(true)) {
      console.log("Filtering...");
      filterVisibleElements();
    } else {
      console.log("Blocked!");
    }
  });
});
