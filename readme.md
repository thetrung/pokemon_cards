# Pokemon Cards on Deku

### INSTALL
```bash
npm i
```
Then build the module inside before running:
```bash
cd node_modules/deku_js_interop && npm i && npm run build
```

### RUN
0. Add alias first:
```bash
alias deku-cli='nix run github:marigold-dev/deku/parametric#deku-cli --'
```
1. mint :
```bash
deku-cli create-mock-transaction ./wallet.json '{ "Action": "mint", "params":["pikachu"]}' node pokemon.js
```
2. transfer :
```bash
deku-cli create-mock-transaction ./wallet.json '{ "Action": "transfer", "params":["tz1czX7tXfNDM9EtZUm1n9PCJusChbXiTPer","pikachu"]}' node pokemon.js
```

# DESCRIPTION OF THE TEST
We would like you implement a ledger to store and transfer Pokemon cards.
- A Pokemon card can be simplify to consider only « basic Pokemon » with fields « name », « energy_type »,  « hp », « attack » 
- A card collection can be a map of Card / Number (representing the number of time I have a card in my collection)
- A ledger is a map of account (a blockchain address) / Collection

For this ledger we would like you provide 2 functions: 
- mint a new Card
- transfer a card to another Address