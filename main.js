var traverse = require('traverse');
var fs = require('fs');
// const pdf = require('html-pdf');
var language = 'es';
var cards = filter_language(JSON.parse(fs.readFileSync('cards.json')), language)
    .reduce(function (obj, item) { obj[item.id] = item; return obj; }, {});
var deck = JSON.parse(fs.readFileSync('deck.json'));
function filter_language(obj, language) {
    return traverse(obj).map(function (item) {
        if (this.key === language)
            this.parent.update(item);
    });
}
;
var CardType;
(function (CardType) {
    CardType[CardType["character"] = 0] = "character";
    CardType[CardType["attribute"] = 1] = "attribute";
    CardType[CardType["bonus"] = 2] = "bonus";
})(CardType || (CardType = {}));
var CardTypeName;
(function (CardTypeName) {
    CardTypeName["character"] = "personaje";
    CardTypeName["attribute"] = "atributo";
    CardTypeName["bonus"] = "ventaja";
})(CardTypeName || (CardTypeName = {}));
function generateCardDeck(cards, deck) {
    var cardsHTML = '';
    var cardsBackHTML = '';
    for (var id in deck) {
        if (cards[id]) {
            cardsHTML += generateCard(cards[id], deck[id]);
            cardsBackHTML += generateCardBack(cards[id].type, deck[id]);
        }
        else {
            console.log('there is no card with id ' + id);
        }
    }
    return "\n  <div class=\"deck\">\n    " + cardsHTML + "\n  </div>\n  <div class=\"deck deck--back\">\n    " + cardsBackHTML + "\n  </div>";
}
function generateCard(info, times) {
    if (times === void 0) { times = 1; }
    if (info.imgAlt) {
        var cardHTML = '';
        for (var i = 0; i < times; i++) {
            cardHTML += "\n      <div class=\"card card--" + info.type + "\" data-card=\"" + info.id + "\" >\n        <img src=\"" + info.imgAlt[i % info.imgAlt.length] + "\" class=\"card__img\">\n        <h2 class=\"card__title\">" + info.title + "</h2>\n        <p class=\"card__description\">" + info.description + "</p>\n      </div>";
        }
        return cardHTML;
    }
    else {
        return ("\n    <div class=\"card card--" + info.type + "\" data-card=\"" + info.id + "\" >\n      <img src=\"" + info.img + "\" class=\"card__img\">\n      <h2 class=\"card__title\">" + info.title + "</h2>\n      <p class=\"card__description\">" + info.description + "</p>\n    </div>").repeat(times);
    }
}
function generateCardBack(type, times) {
    if (times === void 0) { times = 1; }
    return ("\n  <div class=\"card card--back card--" + type + "\">\n    <img src=\"media/img/detective.svg\" class=\"card__img--back\">\n    </div>").repeat(times);
}
var html = '<link href="main.css" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i" rel="stylesheet">';
html += generateCardDeck(cards, deck);
// console.log(html);
fs.writeFile("deck.html", html, function (err) {
    if (err)
        return console.log(err);
});
// tsc main.ts --lib ESNext --downlevelIteration && node main.js
// pdf.create(html).toFile('./deck.pdf', function(err, res) {if (err) { console.error(err); }});
