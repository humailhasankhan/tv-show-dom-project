//You can edit ALL of the code here
const selector = document.getElementById("episode-selector");
const container = document.getElementById("episodes-container");
const searchBar = document.getElementById("search");
const showSelector = document.getElementById("show-selector");
let episodeCounter = 0;
let allEpisodes;
function setup() {
  container.innerHTML = "";
  const allShows = getAllShows().sort((firstElement, secondElement) =>
    firstElement.name.localeCompare(secondElement.name)
  );
  selector.style.visibility = "hidden";
  makePageForShows(allShows);

  // const searchBar = document.getElementById("search");
  // searchBar.addEventListener("keyup", (event) => {
  //   makePageForEpisodes(allShows, event.target.value);
  // });
}

function episodeIsIncluded(episode, searchBarValue) {
  if (searchBarValue === undefined) {
    return true;
  }
  return (
    episode.name.toLowerCase().includes(searchBarValue.toLowerCase()) ||
    episode.summary.toLowerCase().includes(searchBarValue.toLowerCase())
  );
}

function makePageForShows(showsList) {
  showsList.forEach((show) => {
    const showOption = document.createElement("option");
    const showId = (showOption.value = show.id);

    showOption.innerHTML = show.name;

    showSelector.appendChild(showOption);

    showSelector.addEventListener("change", selectedShow);
    function selectedShow() {
      if (
        showSelector.options[showSelector.selectedIndex].innerText.includes(
          show.name
        )
      ) {
        searchBar.style.visibility = "visible";
        selector.innerHTML = "";
        selector.innerHTML = "<option value ''>--select episode--</option>";
        selector.value = "";

        fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
          .then((response) => response.json())
          .then((data) => {
            allEpisodes = data;
            makePageForEpisodes(allEpisodes);
            selector.style.visibility = "visible";
            searchBar.addEventListener("keyup", (event) => {
              makePageForEpisodes(allEpisodes, event.target.value);
            });
          })
          .catch((error) => console.log("Error:", error));
      } else if (
        this.value === "" ||
        this.value === "null" ||
        this.value === undefined
      ) {
        selector.style.visibility = "hidden";
        container.innerHTML = "";
      }
    }
  });
}

function renderEpisode(episode, searchBarValue) {
  const episodeCard = document.createElement("ul");
  const episodeNumber = `${episodeCounter + 1}`;
  episodeCard.className = "all-episode-cards";
  episodeCard.id = episodeNumber;
  const season = ("0" + episode.season).slice(-2);
  const episodeNumbers = ("0" + episode.number).slice(-2);
  const option = document.createElement("option");
  option.value = episodeNumber;
  option.innerHTML = `S${season}E${episodeNumbers} - ${episode.name}`;
  selector.appendChild(option);

  episodeCard.innerHTML = "";
  episodeCard.innerHTML = `
<li class ="episode-names">${episode.name} - S${season}E${episodeNumbers}</li>
<li><img src="${episode.image.medium}" alt="episode thumbnails"</li>
<li class="episode-summary">${episode.summary}</li>
`;
  if (!episodeIsIncluded(episode, searchBarValue)) {
    episodeCard.style.display = "none";
  }
  episodeCounter = episodeCounter + 1;
  container.appendChild(episodeCard);
}

function makePageForEpisodes(episodeList, searchBarValue) {
  episodeCounter = 0;
  container.innerHTML = "";
  episodeList.forEach((episode) => {
    renderEpisode(episode, searchBarValue);
  });

  selector.addEventListener("change", selectedEpisode);
  function selectedEpisode(event) {
    if (event.target.value) {
      const allEpisodeCards = document.querySelectorAll(".all-episode-cards");
      allEpisodeCards.forEach((episodeCard) => {
        episodeCard.style.display = "none";
      });
      searchBar.style.visibility = "hidden";
      searchBar.value = "";
      const chosenEpisodeCard = document.getElementById(
        `${event.target.value}`
      );
      chosenEpisodeCard.style.display = "initial";
      displayEpisode(0);
    } else {
      const allEpisodeCards = document.querySelectorAll(".all-episode-cards");
      allEpisodeCards.forEach((episodeCard) => {
        episodeCard.style.display = "initial";
      });
      searchBar.style.visibility = "visible";
      displayEpisode(0);
    }
  }

  function displayEpisode(number) {
    const heading = document.getElementById("heading");
    heading.innerHTML = `Displaying ${episodeCounter + number}/${
      episodeList.length
    } episodes`;
  }
  displayEpisode(0);
}

window.onload = setup;
