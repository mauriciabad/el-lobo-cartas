// ------ CODE -------- //

const fs = require('fs');
const pdf = require('html-pdf');

const cards = {
  normal: fs.readdirSync('./src/img/normal').filter((fileName) => /\.(svg|png|jpg|jpeg|gif)$/i.test(fileName) ),
  events: JSON.parse(fs.readFileSync('./src/data/events.json')),
}


var html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Lobo</title>
    <link href="main.css" rel="stylesheet">
  </head>
  <body>
    <div class="instructions">
      <h2>Instructions</h2>
      <b>Left click</b>: Duplicate card<br>
      <b>Right click</b>: Remove card<br>
      <b>Ctrl + P</b>: Print document
    </div>
    ${generateCards(cards)}
    <script src="script.js"></script>
  </body>
</html>`;

fs.writeFile("dist/index.html", html, (err) => {
  if (err) console.error(err);
}); 

// let options = {
//   "orientation": "landscape",
//   "border": "1cm",
//   "format": "A3"
// }
// pdf.create(html, options).toFile('./dist/cards.pdf', (err, res) => {
//   if (err) console.error(err);
// });



// ----------- FUNCTIONS ------------ //

function generateCards(cards){
  // Explanation: for each type of card we generate and combine the html of each card.
  // Note: the order of generation is important to match the front widhth the backs.
  return `
  <div class="deck">
    ${cards['normal'].reduce((total, card) => total + generateNormalCard(card), '')}
  </div>
  <div class="deck">
    ${cards['events'].reduce((total, card) => total + generateEventCard(card), '')}
  </div>
  <div class="deck">
    ${cards['normal'].reduce((total, card) => total + generateNormalMiniCard(card), '')}
  </div>`;
}

function generateNormalCard(src) {
  return `
    <div class="card card--normal">
      <img src="img/normal/${src}" class="card__img">
    </div>`;
}

function generateNormalMiniCard(src) {
  return `
    <div class="card card--mini">
      <img src="img/normal/${src}" class="card__img">
    </div>`;
}

function generateEventCard(info) {
  return `
    <div class="card card--event">
      <img src="img/events/${info.duration}.svg" class="card__img">
      <h2 class="card__title">${info.title}</h2>
      <p class="card__description">${info.description}</p>
    </div>`;
}


