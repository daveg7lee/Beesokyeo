badWords = ["좆병신"];
let words = [];

function wait(sec) {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
}

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
