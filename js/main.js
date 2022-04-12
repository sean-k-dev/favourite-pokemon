function apiRequest() {
// ----------------------------------------
// Pokémon battle stats API request
// ----------------------------------------
fetch(`https://pokeapi.co/api/v2/pokemon/${activePokemon}`)
.then(res => res.json())
.then (data => {
    // console.log(data)

    document.querySelector('#regularButton').style.display = "none"
    document.querySelector('#shinyButton').style.display = "block"
    document.querySelector('#megaEvoButton').style.display = "none"
    document.querySelector('.statbox').style.opacity = "1"

    // Sprite Data
    function spriteDefault() {
      document.querySelector('#pokeImg').src = `https://play.pokemonshowdown.com/sprites/ani/${data.name.replaceAll('low-key','lowkey')}.gif`
      document.querySelector('#frontSprite').src = data.sprites.versions['generation-v']['black-white'].front_default
      document.querySelector('#backSprite').src = data.sprites.versions['generation-v']['black-white'].back_default
    }

    function spriteShiny() {
      document.querySelector('#frontSprite').src = data.sprites.versions['generation-v']['black-white'].front_shiny
      document.querySelector('#backSprite').src = data.sprites.versions['generation-v']['black-white'].back_shiny
      document.querySelector('#pokeImg').src = `https://play.pokemonshowdown.com/sprites/${'ani-shiny'}/${data.name.replaceAll('low-key','lowkey')}.gif`
    }

    function spriteMega() {
      activePokemon = `${activePokemon}-mega`
      // console.log(activePokemon)
      apiRequest()
    
    }
  
    spriteDefault()

    // Shiny Button
    document.querySelector('#shinyButton').addEventListener('click', () => {
      spriteShiny()
      document.querySelector('#regularButton').style.display = "block"
      document.querySelector('#shinyButton').style.display = "none"
    })
    // Revert Sprite
    document.querySelector('#regularButton').addEventListener('click', () => {
      spriteDefault()
      document.querySelector('#regularButton').style.display = "none"
      document.querySelector('#shinyButton').style.display = "block"
    })
    // Switch to Mega Evolution form
    document.querySelector('#megaEvoButton').addEventListener('click', () => {
        spriteMega()
    })

      // Match Type Images to API data
    document.querySelector('#typeOne').src = `img/types/${data.types[0].type.name}.png`
    if (data.types.length < 2) {
      document.querySelector('#typeTwo').src = `img/types/placeholder.png`
      } else { document.querySelector('#typeTwo').src = `img/types/${data.types[1].type.name}.png`
    }

    document.querySelector('#height').innerText = `${data.height / 10}m`
    document.querySelector('#weight').innerText = `${data.weight / 10}kg`
    document.querySelector('#abilityOne').innerText = data.abilities[0].ability.name.replaceAll('-', ' ')
    if (data.abilities.length < 2) {
      document.querySelector('#abilityTwo').innerText = "N/A"
    } else { document.querySelector('#abilityTwo').innerText = data.abilities[1].ability.name.replaceAll('-', ' ')
    }
    if (data.abilities.length != 3) {
      document.querySelector('#abilityThree').innerText = "N/A"
      document.querySelector('#isHidden').src = "img/cancel.png"
      document.querySelector('#hiddenText').innerText = "No hidden ability"
    } else { 
      document.querySelector('#abilityThree').innerText = data.abilities[2].ability.name.replaceAll('-', ' ')
      document.querySelector('#isHidden').src = "img/confirm.png"
      document.querySelector('#hiddenText').innerText = "Hidden: "
    }

     // Move Lists
   list.innerText = ""
   let moveNameArr = []
   for (let i = 0; i < data.moves.length - 1; i++) {
   moveNameArr.push(data.moves[i].move.name.replace("-", " "))
   var entry = document.createElement('li')
   entry.className = 'item'
   entry.appendChild(document.createTextNode(moveNameArr[i]))
   list.appendChild(entry)
    }

  const statField = document.getElementsByClassName('statfield')
    for(x in statField) {
           statField[x].innerText = data.stats[x].base_stat;
    }

  })
.catch(err => {console.log(`error ${err}`)})

// ----------------------------------------
// Pokemon species info API request
// ----------------------------------------
fetch(`https://pokeapi.co/api/v2/pokemon-species/${activeSpecies}`)
.then(res => res.json())
.then (data => {
    // console.log(data)
    document.querySelector('#name').innerText = `${data.name.charAt(0).toUpperCase()}${data.name.substring(1).toLowerCase()}`
    document.querySelector('#speciesText').innerText = data.genera[7].genus
    document.querySelector('#dexNo').innerText = `#${data.pokedex_numbers[0].entry_number}`

    // Filtering out non-English Pokédex entries
    let dexArr = []
    dexArr = data.flavor_text_entries.filter((element) => element.language.name === "en")
    const dexEntry = document.querySelector('#dexEntry')
    const version = document.querySelector('#version')
    dexEntry.innerText = dexArr[0].flavor_text.replaceAll("\f", " ").replaceAll("\n", " ")
    version.innerText = `${dexArr[0].version.name.charAt(0).toUpperCase()}${dexArr[0].version.name.substring(1).toLowerCase()}`

    // Random Pokédex Entry from dexArr[]
    document.querySelector('#randomEntry').addEventListener('click', () => {
      let random = Math.floor(Math.random()*dexArr.length)
      dexEntry.innerText = dexArr[random].flavor_text.replaceAll("\f", " ").replaceAll("\n", " ")
      version.innerText = `${dexArr[random].version.name.charAt(0).toUpperCase()}${dexArr[random].version.name.substring(1).toLowerCase()}`
    })

    document.querySelector('#generation').innerText = `Gen ${data.generation.name.substring(11).toUpperCase()}`
   
    // Check to see if Pokémon has mega evolution
    if (data.varieties[1].pokemon.name.match("mega")){
      document.querySelector('#megaEvoButton').style.display = "block"
      console.log("Can Mega Evolve")
    } 
  })

    .catch(err => {console.log(`error ${err}`)})
 }

// ----------------------------------------
// Pokemon ability info API request
// ----------------------------------------

 function abilityCheck() {
  fetch(` https://pokeapi.co/api/v2/ability/${currentAbility}`)
  .then(res => res.json())
  .then (data => {
      // console.log(data)
      document.querySelector('#tooltipHeading').innerText = data.name.replaceAll('-', " ")
      let abilityArr = []
      abilityArr = data.flavor_text_entries.filter((element) => element.language.name === "en")
      document.querySelector('#description').innerText = abilityArr[abilityArr.length-1].flavor_text.replace("\n", " ")
      if (data.effect_entries.length < 1) {
        document.querySelector('#effect').innerText = "No effect entry found."
      } else {
      document.querySelector('#effect').innerText = data.effect_entries[1].effect.replaceAll('×', "x")
      }
     })
     .catch(err => {console.log(`error ${err}`)})
    }

// ----------------------------------------
// Pokemon move info API request
// ----------------------------------------
  function moveCheck() {
  fetch(` https://pokeapi.co/api/v2/move/${currentMove}`)
  .then(res => res.json())
  .then (data => {
      // console.log(data)
      document.querySelector('#moveName').innerText = data.name.replaceAll('-', " ")
      document.querySelector('#movePP').innerText = data.pp
      if (data.power != null) {
      document.querySelector('#movePower').innerText = data.power
      } else {
        document.querySelector('#movePower').innerText = "N/A"
      }
      document.querySelector('#moveAcc').innerText = data.accuracy
      let moveArr = []
      moveArr = data.flavor_text_entries.filter((element) => element.language.name === "en")
      document.querySelector('#moveDesc').innerText = moveArr[moveArr.length-1].flavor_text.replace("\n", " ")
     })
     .catch(err => {console.log(`error ${err}`)})
    }
    
    

let activePokemon = ""
let activeSpecies = ""
let currentAbility = ""
let currentMove = ""


// ----------------------------------------
// Searching for Pokémon
// ----------------------------------------
let searchQuery = document.querySelector('input')

document.querySelector('#search').addEventListener('click', () => {
  activePokemon = searchQuery.value.toLowerCase()
  activeSpecies = searchQuery.value.toLowerCase()
  document.querySelector('body').style.backgroundColor = "rgba(172, 172, 172)"
  document.querySelector('.stattitle').style.backgroundColor = "rgba(172, 172, 172)";
  apiRequest()
})

// Activate search upon pressing Enter key
document.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search").click();
  }
});

// ----------------------------------------
// Special Function Calls for my Favourite Pokémon
// ----------------------------------------
document.getElementById('marowak').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgba(81,241,183)'
  document.querySelector('body').style.color = 'rgb(124,111,115)'
  activePokemon = "marowak-alola"
  activeSpecies = "marowak"
  apiRequest()
})

document.getElementById('crobat').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgba(113,50,116,1)'
  document.querySelector('body').style.color = 'rgb(89,145,157)'
  activePokemon = "crobat"
  activeSpecies = "crobat"
  apiRequest()
})

document.getElementById('scizor').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgba(231,108,104)'
  document.querySelector('body').style.color = 'rgb(129,122,123)'
  activePokemon = "scizor"
  activeSpecies = "scizor"
  apiRequest()
})

document.getElementById('houndoom').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgba(253,155,99)'
  document.querySelector('body').style.color = 'rgb(104,92,88)'
  activePokemon = "houndoom"
  activeSpecies = "houndoom"
  apiRequest()
})

document.getElementById('mudkip').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgba(169,235,254)'
  document.querySelector('body').style.color = 'rgb(240,163,73)'
  activePokemon = "mudkip"
  activeSpecies = "mudkip"
  apiRequest()
})

document.getElementById('glalie').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgba(218,226,250)'
  document.querySelector('body').style.color = 'rgb(76,76,76)'
  activePokemon = "glalie"
  activeSpecies = "glalie"
  apiRequest()
})

document.getElementById('trevenant').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgb(76,186,148)'
  document.querySelector('body').style.color = 'rgb(166,139,113)'
  activePokemon = "trevenant"
  activeSpecies = "trevenant"
  apiRequest()
})

document.getElementById('zeraora').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgba(254,252,100)'
  document.querySelector('body').style.color = 'rgb(138,194,247)'
  activePokemon = "zeraora"
  activeSpecies = "zeraora"
  apiRequest()
})

document.getElementById('toxtricity').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = 'rgba(185,143,217)'
  document.querySelector('body').style.color = 'rgb(13,84,104)'
  activePokemon = "toxtricity-low-key"
  activeSpecies = "toxtricity"
  apiRequest()
})


// ----------------------------------------
// Draggable window
// ----------------------------------------

dragElement(document.getElementById("tooltipBlock"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

document.querySelector('#closeTooltip').addEventListener('click', closeTooltip)
function closeTooltip() {
    document.querySelector('#tooltipBlock').style.visibility = "hidden"
}

// ----------------------------------------
// API triggers
// ----------------------------------------

function abilityOne() {
  document.querySelector('.tooltipblock').style.visibility = "visible"
  currentAbility = document.querySelector('#abilityOne').innerText.toLowerCase().replaceAll(" ", "-")
  abilityCheck()
}

function abilityTwo() {
  document.querySelector('.tooltipblock').style.visibility = "visible"
  currentAbility = document.querySelector('#abilityTwo').innerText.toLowerCase().replaceAll(" ", "-")
  abilityCheck()
}

function abilityThree() {
  if (document.querySelector('#abilityThree').innerText == "N/A") {
  } else {
  document.querySelector('.tooltipblock').style.visibility = "visible"
  currentAbility = document.querySelector('#abilityThree').innerText.toLowerCase().replaceAll(" ", "-")
  abilityCheck()
  }
}

let list = document.getElementById('moveFieldA');

document.getElementById("moveFieldA").addEventListener("click",function(e) {
  if (e.target && e.target.matches("li.item")) {
    e.target.className = "move_element"; 
    currentMove = e.target.innerText.toLowerCase().replaceAll(" ", "-")
    moveCheck()
    }
});

