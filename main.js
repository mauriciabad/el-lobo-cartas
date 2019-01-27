var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var traverse = require('traverse');
var fs = require('fs');
// const pdf = require('html-pdf');
var language = 'es';
var cards = filter_language(JSON.parse(fs.readFileSync('cards.json')), language)
    .reduce(function (obj, item) { obj[item.id] = item; return obj; }, {});
var deck = new Map([
    ["fortune_teller", 1],
    ["wolf", 2],
    ["cupid", 1],
    ["witch", 1],
    ["feral_child", 1],
    ["villager", 7],
    ["villager_female", 6],
    ["extra_life", 2],
    ["mad", 1],
]);
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
    var e_1, _a;
    var totalCards = {};
    var cardsHTML = '';
    try {
        for (var deck_1 = __values(deck), deck_1_1 = deck_1.next(); !deck_1_1.done; deck_1_1 = deck_1.next()) {
            var _b = __read(deck_1_1.value, 2), cardId = _b[0], cardAmount = _b[1];
            if (!totalCards[cards[cardId].type])
                totalCards[cards[cardId].type] = 0;
            totalCards[cards[cardId].type] += cardAmount;
            cardsHTML += generateCard(cards[cardId], cardAmount);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (deck_1_1 && !deck_1_1.done && (_a = deck_1["return"])) _a.call(deck_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var cardsBackHTML = '';
    for (var type in totalCards) {
        cardsBackHTML += generateCardBack(type, totalCards[type]);
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
// pdf.create(html).toFile('deck.pdf', function(err, res) {if (err) { console.error(err); }});
