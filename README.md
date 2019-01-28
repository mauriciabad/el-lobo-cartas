# El Lobo
Takes cards.json and deck.json and generates a pdf file

To intall dependencies:
```bash
sudo npm install traverse
sudo npm install html-pdf
```

To run:
```bash
tsc main.ts --lib ESNext --downlevelIteration && sudo node main.js
```

It will output the card deck into /deck.html
