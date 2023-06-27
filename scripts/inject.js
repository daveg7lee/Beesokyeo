chrome.storage.local.get(["wordList"], async function (result) {
  const badWords = result.wordList || [];
  let words = [];

  function wait(sec) {
    let start = Date.now(),
      now = start;
    while (now - start < sec * 1000) {
      now = Date.now();
    }
  }

  function filterVisibleElements() {
    var elements = document.querySelectorAll(
      ":not(script):not(style):not(meta):not(head):not(title)"
    );
    elements.forEach(function (element) {
      filterTextNodes(element);
    });
    purifyBadWords();
  }

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

  async function filterBadWords(node) {
    badWords.map((word) => {
      if (node.nodeValue.includes(word) && !words.includes(node)) {
        words.push(node);
      }
    });
  }

  async function purifyBadWords() {
    await Promise.all(
      words.map(async (word) => {
        const text = word.nodeValue;
        const res = await fetch("http://127.0.0.1:5000/purify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });
        const json = await res.json();
        word.nodeValue = json["res"];
        wait(1);
      })
    );
  }

  window.addEventListener("load", filterVisibleElements);
});
