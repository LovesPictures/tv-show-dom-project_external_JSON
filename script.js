//You can edit ALL of the code here
//using cache to mitigate the delay in getting the data
//async await - modern way of fetching data

//Get the data
function getData(showID) {
  // to the URL - object where the value is not yey defined
  //fetching the main URL and the shows by the show ID
  fetch("https://api.tvmaze.com/shows/" + showID + "/episodes")
    //converting the object to JSON
    .then((response) => response.json())
    //waiting the the data to be finished Promise?
    .then((data) => {
      //calling the makePageForEpisode on the JSon
      makePageForEpisodes(data);
      // return data;
    })
    //this catch method is called when the promise is not successful. 200-299 ? > 400 ??
    .catch((e) => console.log(e));
}
// console.log(getData());

let currentEpisodes = [];

function setup() {
  //store the allshows data
  let allshowsData = getAllShows();

  for (let show of allshowsData) {
    //copy a template from the HTML for each show and clone it
    let showOption = document.querySelector(`.template-option`).cloneNode(true);

    //make the template visible (this needs to remain as a placeholder for javascript)
    showOption.classList.remove(`template-option`);

    //update show name
    showOption.innerHTML = show.name;
    // this the the dropdown values
    showOption.setAttribute(`value`, show.id); //not visible

    // add/append other elements in the card
    document.querySelector(`#showList`).appendChild(showOption);
  }

  //get the data / test sho id's here
  getData(33);
}

//async do this at the same time
async function makePageForEpisodes(episodeList) {
  //test page
  // const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  //clear the current episodes options on the page ------------
  document.querySelectorAll(`.episodeOption`).forEach((temp) => {
    //if this element does not include the template class remove it
    if (!temp.classList.contains(`template-option`)) temp.remove();
  });

  // CARD
  //for of - to loop over the episodes
  episodes = episodeList;
  for (let episode of episodeList) {
    // console.log(episode);
    // CARD---------------------------------------------------------------------------
    // create a card and clone it
    let card = document.querySelector(`.template`).cloneNode(true);
    //make the template visible (by removing the CSS class - this needs to remain as a placeholder for javascript)
    card.classList.remove(`template`);

    //update text
    card.querySelector(`.summary`).innerHTML = episode.summary;
    // set the card ID to the episode ID  ( first args the thing I need to change, the second is its value ~ from a key value pair)
    card.setAttribute(`id`, `episode` + episode.id); //not visible

    //update name
    card.querySelector(`.name`).innerHTML = episode.name;

    // combine season number and episode number into an episode code  e.g S02E07 becomes S2E7
    // update season and episode Number
    card.querySelector(`.season-episode`).innerHTML =
      `S` + episode.season + `E` + episode.number;

    //update image for the card
    card.querySelector(`img`).src = episode.image.medium;
    // add/append other elements in the card
    document.querySelector(`.wrapper`).appendChild(card);

    // EPISODE OPTION -----------------------------------------------------------------
    //create a dropdown option for each episode
    //copy a template from the HTML for each episode and clone it
    let episodeOption = document
      .querySelector(`.template-option`)
      .cloneNode(true);

    //adding the episodeOption class - so it can be removed in future
    episodeOption.classList.add(`episodeOption`);
    //make the template visible (by removing the CSS class - this needs to remain as a placeholder for javascript)
    episodeOption.classList.remove(`template-option`);

    //update episode name
    episodeOption.innerHTML =
      `S` + episode.season + `E` + episode.number + `⠀⠀⠀` + episode.name;

    // this the the dropdown values
    episodeOption.setAttribute(`value`, episode.id); //not visible

    // add/append other elements in the card
    document.querySelector(`#episodeList`).appendChild(episodeOption);
  }
  // update display for the the number of visible episodes
  updateDisplay();
}

// call the shows
console.log(`here`, getAllShows());
//select an episode
document.querySelector(`#episodeList`).addEventListener("input", function (e) {
  for (let episode of episodes) {
    //if episode id equals the one selected, display it
    //this.value = the input  //this.value = string and episodes.id = number therefore === does not work
    if (this.value == episode.id) {
      //remove the - hide class - this knows it is a class so you do not need the `.`
      //Using querySelector with IDs that are numbers
      document.querySelector(`#episode` + episode.id).classList.remove(`hide`);
    } else {
      //adds the - hide class
      document.querySelector(`#episode` + episode.id).classList.add(`hide`);
    }
  }
  // update display for the the number of visible episodes
  updateDisplay();
});

//select a shows
document.querySelector(`#showList`).addEventListener("input", function (e) {
  //clear the current card episodes on the page ------------
  document.querySelectorAll(`.card`).forEach((temp) => {
    //if this element does not include the template class remove it
    if (!temp.classList.contains(`template`)) temp.remove();
  });

  // console.log(this.value);
  // add the new episodes to the page
  getData(this.value);
});

//search support (start-of-word) using includes - search
document.querySelector(`.s-episodes`).addEventListener("input", function (e) {
  for (let episode of episodes) {
    //if episode name - includes - this.value = the input
    if (episode.name.toLowerCase().includes(this.value.toLowerCase())) {
      //remove the - hide class - this knows it is a class so you do not need the `.`
      //Using querySelector with IDs that are numbers
      document.querySelector(`#episode` + episode.id).classList.remove(`hide`);
    } else {
      //adds the - hide class
      document.querySelector(`#episode` + episode.id).classList.add(`hide`);
    }
  }
  updateDisplay();
});
// reset button
function resetBtn() {
  //remove the hide class
  document.querySelectorAll(`.hide`).forEach((temp) => {
    temp.classList.remove(`hide`);
  });
  updateDisplay();
}

//make a function to update the episodes displayed
function updateDisplay() {
  //subtract the number of episodes visible for the number of episodes which are invisible
  total = document.querySelectorAll(`.card:not(.template)`).length;
  hidden = document.querySelectorAll(`.hide`).length;

  shown = total - hidden;
  //look for visible episodes & total episodes (console)
  document.querySelector(`.display`).value =
    `Displaying ` + shown + `/ ` + total + ` episodes`;
}

// //season selector
// document.querySelector(`.s-seasons`).addEventListener("input", function (e) {
//   for (let episode of episodes) {
//     //if seaseon has this value - using parseInt() function parses a string argument and returns an integer
//     if (episode.season === parseInt(this.value)) {
//       //remove the - hide class
//       document.querySelector(`#episode` + episode.id).classList.remove(`hide`);
//     } else {
//       //adds the - hide class
//       document.querySelector(`#episode` + episode.id).classList.add(`hide`);
//     }
//   }
// });

// //episode selector
// document.querySelector(`.s-episodes`).addEventListener("input", function (e) {
//   for (let episode of episodes) {
//     //if episode season - includes - this value
//     if (episode.season === parseInt(this.value)) {
//       //remove the - hide class
//       document.querySelector(`#episode` + episode.id).classList.remove(`hide`);
//     } else {
//       //adds the - hide class
//       document.querySelector(`#episode` + episode.id).classList.add(`hide`);
//     }
//   }
// });

//400 show selector

//500 Shows Listing selector

window.onload = setup;
