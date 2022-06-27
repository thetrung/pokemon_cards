/// basic operations
const { main, set, get } = require("deku_js_interop");

// initial dataset
const init_data = {
  'tz1cCUK2sqSmJCUNpoQUpy3Puy48H4Poic9s' : {
    collection: { 'pikachu':3, 'lizard':1 }
  },
  'tz1Ns1hCTCcvT3n3xDmFJu373B6H5kzmR3fU' : {
    collection: { 'lizard':2 }
  },
  'tz1czX7tXfNDM9EtZUm1n9PCJusChbXiTPer' : {
    collection: {}
  },
}

const POKEMON_CARDS = {
  'pikachu' : {
    hp: 36,
    attack: 6,
    energy_type: 'lightning'
  },

  'lizard' : {
    hp: 42,
    attack: 9,
    energy_type: 'fire'
  },
}

/**
 * remove a card from a collection
 * @param {*} collection 
 * @param {*} card 
 * @returns modified collection
 */
const remove_card = (collection, card) => {

  // exist ?
  if(collection[card]){
      
    // get amount
    let amount = Number.parseFloat(collection[card])
        
    // then decrement :
    if(amount > 1) {
      collection[card] = amount - 1 
    }
    else {
      collection = collection.filter(e => e != card)   
    }
  }

  return collection
}

/**
 * add a card to a collection
 * @param {*} collection 
 * @param {*} card 
 * @returns modified collection
 */
const add_card = (collection, card) => {

  // exist ?
  if(collection[card]){

    // get amount
    let amount = Number.parseFloat(collection[card])
    
    // then increment :
    collection[card] = amount + 1 
  } 
  else {
    // add new 
    collection[card] = 1
  }

  return collection
}

/**
 * mint a new card :
 * deku-cli create-mock-transaction ./wallet.json '{ "Action": "mint", "params":["pikachu"]}' node pokemon.js

 * @param {*} action 
 */
const mint = (sender, params) => {

  // card to mint
  const card = params[0]

  // log
  console.log(`\nmint: [${sender}] > ${card}`)

  // check if card exist :
  if(POKEMON_CARDS[card]){

    // read sender current collection :
    let collection = JSON.parse(get(sender).toString())['collection']
    console.log(`initial state:\n`, collection)

    // check if card exist :
    collection = add_card(collection, card)

    // stringify commit
    const commit = JSON.stringify({'collection': collection})

    // commit record
    set(sender.toString(), commit)

    // log
    console.log(`\nwritten changes:`)
    console.log(collection)
    console.log()
  }

}

/**
 * transfer a card to another address : 
 * deku-cli create-mock-transaction ./wallet.json '{ "Action": "transfer", "params":["tz1czX7tXfNDM9EtZUm1n9PCJusChbXiTPer","pikachu"]}' node pokemon.js
 * @param {*} action 
 */
const transfer = (sender, params) => {

  // destination
  const dest = params[0]

  // card to transfer
  const card = params[1]
  
  // log
  console.log(`transfer: [${sender}] > [${dest}] : ${card}\n`)

  // // check if card exist :
  if(POKEMON_CARDS[card]){


    // read dest/sender collections :
    let collection_dest = JSON.parse(get(dest).toString())['collection']
    let collection_sender = JSON.parse(get(sender).toString())['collection']

    // logs 
    console.log(`initial state:`)
    console.log(`${dest}:`, collection_dest)
    console.log(`${sender}:`, collection_sender)


    // check if sender has the card :
    if(collection_sender[card]){

      // remove from sender 
      collection_sender = remove_card(collection_sender, card)

      // add to dest
      collection_dest = add_card(collection_dest, card)

      // stringify commits
      const commit_dest = JSON.stringify({'collection': collection_dest})
      const commit_sender = JSON.stringify({'collection': collection_sender})

      // commit records
      set(dest, commit_dest)
      set(sender, commit_sender)

      // logs
      console.log(`\nwritten changes:`)
      console.log(`> ${dest} : ${commit_dest}`)
      console.log(`> ${sender} : ${commit_sender}\n`)
    } 
    else {
      // error
      throw new Error(`${sender} doesn't have any ${card} card.`)
    }

  }
}

// main ()
const execute = (sender, buffer) => {

  const action = JSON.parse(buffer.toString())

  console.log(`action:`, action)

  switch (action.Action) {
    
    case "mint": {
      mint(sender, action.params)
      return;
    }
    case "transfer": {
      transfer(sender, action.params)
      return;
    }
    default:
      throw new Error("Not known action")
  }
}

/// main ()
const transition = (sender, tx_hash, buffer) => {
  
  // log
  console.log(`sender: ${sender}`)
  
  // set
  execute(sender, buffer)
}

// execute tx
main(init_data, transition)