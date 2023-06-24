const allElements = document.body.getElementsByTagName("*");

for (let i = 0; i < allElements.length; i++) {
  allElements[i].innerHTML = allElements[i].innerHTML.replace("Yes", "No");
}
