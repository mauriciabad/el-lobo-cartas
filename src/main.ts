// ------ Declaration of types -------- //
type Card = CharacterCard | EventCard | ProfessionCard | MarkerCard;
interface Deck {
  characters: Array<CharacterCard>,
  professions: Array<ProfessionCard>,
  events: Array<EventCard>,
  markers: Array<MarkerCard>,
}
interface CharacterCard {
  title:   string,
  description: string,
  img:    string | Array<string>,
  amount: number,
  team:   Team,
}
interface ProfessionCard {
  title:  string,
  description: string,
  img:    string | Array<string>,
  amount: number,
}
interface EventCard {
  title:    string,
  description: string,
  duration: EventDuration,
  amount:   number,
}
interface MarkerCard {
  title:  string,
  img:    string | Array<string>,
  amount: number,
}
enum EventDuration{
  temporal   = 'temporal',
  inmediato  = 'inmediata',
  permanente = 'permanente',
}
enum CardType{
  event      = 'event',
  character  = 'character',
  profession = 'profession',
  marker     = 'marker',
}

interface Team {
  title: string,
  objective: string,
  color: string
}
interface Teams{
  lobos: Team,
  aldeanos: Team,
  solitario: Team,
  ambuguo: Team,
}

// ------ CODE -------- //

const fs = require('fs');
const pdf = require('html-pdf');

const cards: Deck = {
  characters:  JSON.parse(fs.readFileSync('data/characters.json')),
  professions: JSON.parse(fs.readFileSync('data/professions.json')),
  events:      JSON.parse(fs.readFileSync('data/events.json')),
  markers:     JSON.parse(fs.readFileSync('data/markers.json')),
};
//console.log(cards);

const teams: Teams = JSON.parse(fs.readFileSync('data/teams.json'));

var html = '<link href="/media/css/main.css" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i" rel="stylesheet">';

html += generateCardDeck(cards);
// console.log(html);
fs.writeFile("dist/deck.html", html, (err) => {
  if(err) return console.log(err);
}); 

pdf.create(html).toFile('./dist/deck.pdf', function(err, res) {if (err) { console.error(err); }});



// ----------- FUNCTIONS ------------ //

function generateCardDeck(deck: Deck): string{
  // Explanation: for each type of card we generate and combine the html of each card.
  // Note: the order of generation is important to match the front widhth the backs.
  return `
  <div class="deck">
    ${deck['characters'].reduce( (total, card) => total + generateCharacterCard(card),  '')}
    ${deck['professions'].reduce((total, card) => total + generateProfessionCard(card), '')}
    ${deck['events'].reduce(     (total, card) => total + generateEventCard(card),      '')}
    ${deck['markers'].reduce(    (total, card) => total + generateMarkerCard(card),     '')}
  </div>
  <div class="deck deck--back">
    ${deck['characters'].reduce( (total, card) => total + generateCardBack(CardType.character,  card.amount), '')}
    ${deck['professions'].reduce((total, card) => total + generateCardBack(CardType.profession, card.amount), '')}
    ${deck['events'].reduce(     (total, card) => total + generateCardBack(CardType.event,      card.amount), '')}
    ${deck['markers'].reduce(    (total, card) => total + generateCardBack(CardType.marker,     card.amount), '')}
  </div>`;
}

function generateCharacterCard(info: CharacterCard): string{
  if(Array.isArray(info.img)){    
    let cardHTML = '';
    for (let i = 0; i < info.amount; i++) {      
      cardHTML += `
      <div class="card card--character">
        <img src="/media/img/${info.img[i%info.img.length]}" class="card__img">
        <h2 class="card__title">${info.title}</h2>
        <p class="card__description">${info.description}</p>
      </div>`;
    }
    return cardHTML;
  }else{
  return `
    <div class="card card--character">
      <img src="/media/img/${info.img}" class="card__img">
      <h2 class="card__title">${info.title}</h2>
      <p class="card__description">${info.description}</p>
    </div>`.repeat(info.amount || 1);
  }
}

function generateProfessionCard(info: ProfessionCard): string {
  if(Array.isArray(info.img)){    
    let cardHTML = '';
    for (let i = 0; i < info.amount; i++) {      
      cardHTML += `
      <div class="card card--profession">
        <img src="/media/img/${info.img[i%info.img.length]}" class="card__img">
        <h2 class="card__title">${info.title}</h2>
        <p class="card__description">${info.description}</p>
      </div>`;
    }
    return cardHTML;
  }else{
  return `
    <div class="card card--profession">
      <img src="/media/img/${info.img}" class="card__img">
      <h2 class="card__title">${info.title}</h2>
      <p class="card__description">${info.description}</p>
    </div>`.repeat(info.amount || 1);
  }
}

function generateEventCard(info: EventCard): string {
  return `
    <div class="card card--event">
      <img src="/media/img/events/${info.duration}.svg" class="card__img--event">
      <h2 class="card__title">${info.title}</h2>
      <p class="card__description">${info.description}</p>
    </div>`.repeat(info.amount || 1);
}

function generateMarkerCard(info: MarkerCard): string {
  if(Array.isArray(info.img)){    
    let cardHTML = '';
    for (let i = 0; i < info.amount; i++) {      
      cardHTML += `
      <div class="card card--marker">
        <img src="/media/img/${info.img[i%info.img.length]}" class="card__img--marker">
      </div>`;
    }
    return cardHTML;
  }else{
  return `
    <div class="card card--marker">
      <img src="/media/img/${info.img}" class="card__img--marker">
    </div>`.repeat(info.amount || 1);
  }
}

function generateCardBack(type:CardType ,times: number=1): string {  
  switch(type){
    case CardType.character:
      return `
        <div class="card card--back card--${type}">
          <img src="/media/img/detective.svg" class="card__img--back card__img--${type}--back">
        </div>`.repeat(times);
    case CardType.profession:
      return `
        <div class="card card--back card--${type}">
          <img src="/media/img/detective.svg" class="card__img--back card__img--${type}--back">
        </div>`.repeat(times);
    case CardType.event:
      return `
        <div class="card card--back card--${type}">
          <img src="/media/img/detective.svg" class="card__img--back card__img--${type}--back">
        </div>`.repeat(times);
    case CardType.marker:
      return `
        <div class="card card--back card--${type}">
          <img src="/media/img/detective.svg" class="card__img--back card__img--${type}--back">
        </div>`.repeat(times);
  }
}

