const traverse = require('traverse');
const fs = require('fs');
// const pdf = require('html-pdf');

const language: string = 'es';
const cards: Object = filter_language(JSON.parse(fs.readFileSync('cards.json')), language)
                      .reduce((obj: Object, item) => { obj[item.id] = item; return obj; }, {});  

const deck: Object = JSON.parse(fs.readFileSync('deck.json'));

function filter_language(obj: Object, language: string, ) {
  return traverse(obj).map(function(item) {
    if (this.key === language) this.parent.update(item);
  });
};

interface Card {
  id: string,
  img: string,
  imgAlt: Array<string>,
  title: string,
  description: string,
  type: CardType
}

enum CardType{
  character,
  attribute,
  bonus
}

enum CardTypeName{
  character = 'personaje',
  attribute = 'atributo',
  bonus = 'ventaja'
}

function generateCardDeck(cards: Object, deck: Object){
  let cardsHTML  = '';
  let cardsBackHTML = '';  
  for (const id in deck) {
    if(cards[id]){
      cardsHTML  += generateCard(cards[id], deck[id]);
      cardsBackHTML += generateCardBack(cards[id].type, deck[id]);
    }else{
      console.log('there is no card with id '+ id);
    }
  }
  return `
  <div class="deck">
    ${cardsHTML}
  </div>
  <div class="deck deck--back">
    ${cardsBackHTML}
  </div>`;
}

function generateCard(info: Card, times: number=1){
  if(info.imgAlt){    
    let cardHTML = '';
    for (let i = 0; i < times; i++) {      
      cardHTML += `
      <div class="card card--${info.type}" data-card="${info.id}" >
        <img src="${info.imgAlt[i%info.imgAlt.length]}" class="card__img">
        <h2 class="card__title">${info.title}</h2>
        <p class="card__description">${info.description}</p>
      </div>`;
    }
    return cardHTML;
  }else{
  return `
    <div class="card card--${info.type}" data-card="${info.id}" >
      <img src="${info.img}" class="card__img">
      <h2 class="card__title">${info.title}</h2>
      <p class="card__description">${info.description}</p>
    </div>`.repeat(times);
  }
}

function generateCardBack(type:string ,times: number=1) {  
  return `
  <div class="card card--back card--${type}">
    <img src="media/img/detective.svg" class="card__img--back">
    </div>`.repeat(times);
  }

var html = '<link href="main.css" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i" rel="stylesheet">';

html += generateCardDeck(cards, deck);
// console.log(html);
fs.writeFile("deck.html", html, (err) => {
  if(err) return console.log(err);
}); 
// tsc main.ts --lib ESNext --downlevelIteration && node main.js

// pdf.create(html).toFile('./deck.pdf', function(err, res) {if (err) { console.error(err); }});
