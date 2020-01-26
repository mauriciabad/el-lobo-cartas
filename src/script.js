for (const element of document.getElementsByClassName('card')) {
  element.addEventListener('click', duplicate);
  element.addEventListener('contextmenu', removeNode);
}

function duplicate(event) {
  const node = event.currentTarget;
  const newNode = node.cloneNode(true);
  newNode.addEventListener('click', duplicate)
  newNode.addEventListener('contextmenu', removeNode);

  node.parentNode.insertBefore(newNode, node);
}

function removeNode(event) {
  event.preventDefault();
  event.currentTarget.remove();
}