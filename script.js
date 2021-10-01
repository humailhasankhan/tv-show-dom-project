//You can edit ALL of the code here
const selector = document.getElementById("episode-selector");
const showContainer = document.getElementById("shows-container");
const container = document.getElementById("episodes-container");
const searchBar = document.getElementById("search");
const showSearchBar = document.getElementById("show-search");
const showSelector = document.getElementById("show-selector");
const heading = document.getElementById("heading");
const backButton = document.getElementById("back-button");
let counter = 0;
let showCounter = 0;
let allShows = getAllShows().sort((firstElement, secondElement) =>
  firstElement.name.localeCompare(secondElement.name)
);
let allEpisodes;
function setup() {
  container.innerHTML = "";
  makePageForShows(allShows);

  selector.style.visibility = "hidden";
  makeShowDropDownList(allShows);
  searchBar.style.display = "none";
  showSearchBar.addEventListener("keyup", liveShowSearch);
}

function liveShowSearch() {
  let showGenres;
  const filteredShows = allShows.filter((show) => {
    const showSearchBarValue = event.target.value;
    for (let i = 0; i < show.genres.length; i++) {
      showGenres = show.genres[i];
    }
    if (
      show.name.toLowerCase().includes(showSearchBarValue.toLowerCase()) ||
      showGenres.toLowerCase().includes(showSearchBarValue.toLowerCase()) ||
      show.summary.toLowerCase().includes(showSearchBarValue.toLowerCase())
    ) {
      return show;
    }
  });

  makePageForShows(filteredShows);

  displayShowCounter();
}

function renderShowListing(show) {
  const showCard = document.createElement("ul");
  showCard.className = "show-cards";
  const showName = document.createElement("li");
  showName.className = "show-name";
  const showImage = document.createElement("li");
  showImage.className = "show-image";
  const showSummary = document.createElement("li");
  showSummary.className = "show-summary";
  const showGenres = document.createElement("li");
  showGenres.className = "show-genres";
  const showStatus = document.createElement("li");
  showStatus.className = "show-status";
  const showRating = document.createElement("li");
  showRating.className = "show-rating";
  const showRuntime = document.createElement("li");
  showRuntime.className = "show-runtime";
  showName.innerText = `${show.name}`;
  if (show.image === null) {
    showImage.innerHTML = `<img src="https://www.escapeauthority.com/wp-content/uploads/2116/11/No-image-found.jpg" alt = show poster">`;
  } else {
    showImage.innerHTML = `<img src="${show.image.medium}" alt = show poster">`;
  }
  showSummary.innerHTML = `${show.summary}`;
  showGenres.innerText = `Genres: ${show.genres
    .toString()
    .replace(/,/g, " | ")}`;
  showStatus.innerHTML = `Status: ${show.status}`;
  showRating.innerHTML = `Rated: ${show.rating.average}`;
  showRuntime.innerHTML = `Runtime: ${show.runtime} minutes`;

  showCard.appendChild(showName);
  showCard.appendChild(showImage);
  showCard.appendChild(showSummary);
  showCard.appendChild(showGenres);
  showCard.appendChild(showStatus);
  showCard.appendChild(showRating);
  showCard.appendChild(showRuntime);
  showContainer.appendChild(showCard);

  showName.addEventListener("click", getEpisodes);
}

function getEpisodes(event) {
  let showId;
  let showName = event.target.textContent;
  allShows.forEach((show) => {
    if (show.name.includes(showName)) {
      showId = show.id;
      return showId;
    }
    showContainer.style.display = "none";
    showSearchBar.style.display = "none";
    searchBar.style.display = "initial";
    selector.innerHTML = "";
    selector.innerHTML = "<option value ''>--select episode--</option>";
    selector.value = "";
  });

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;

      makePageForEpisodes(allEpisodes);
      selector.addEventListener("change", selectedEpisode);
      selector.style.visibility = "visible";
    })
    .catch((error) => console.log("Error:", error));
}

backButton.addEventListener("click", goBackToMainPage);

function goBackToMainPage() {
  makePageForShows(allShows);
  selector.value = "";
  showSelector.value = "";
  selector.style.visibility = "hidden";
  container.innerHTML = "";
  showContainer.style.display = "initial";
  showSearchBar.style.display = "initial";
  searchBar.style.display = "none";
  searchBar.value = "";
  showSearchBar.value = "";
  displayShowCounter();
}

function makePageForShows(showList) {
  showContainer.innerHTML = "";
  showCounter = 0;
  showList.forEach((show) => {
    renderShowListing(show);
    showCounter++;
    displayShowCounter();
  });
}

function displayShowCounter() {
  heading.innerHTML = `Displaying ${showCounter}/${allShows.length}`;
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

function makeShowDropDownList(showsList) {
  showsList.forEach((show) => {
    const showOption = document.createElement("option");
    showOption.className = "show-options";
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
        showSearchBar.style.display = "none";
        searchBar.style.display = "initial";
        searchBar.value = "";
        selector.style.display = "initial";
        selector.innerHTML = "";
        selector.innerHTML = "<option value ''>--select episode--</option>";
        selector.value = "";
        showContainer.style.display = "none";

        fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
          .then((response) => response.json())
          .then((data) => {
            allEpisodes = data;
            makePageForEpisodes(allEpisodes);
            selector.style.visibility = "visible";
          })
          .catch((error) => console.log("Error:", error));
      } else if (
        this.value === "" ||
        this.value === "null" ||
        this.value === undefined
      ) {
        selector.style.visibility = "hidden";
        container.innerHTML = "";
        showContainer.style.display = "initial";
        showSearchBar.style.display = "initial";
        searchBar.style.display = "none";
        displayShowCounter();
      }
    }
  });
}

searchBar.addEventListener("keyup", (event) => {
  counter = 0;
  makePageForEpisodes(allEpisodes, event.target.value);
  displayEpisode();
});

function displayEpisode() {
  heading.innerHTML = `Displaying ${counter}/${allEpisodes.length}`;
}

function renderEpisode(episode, searchBarValue) {
  const episodeCard = document.createElement("ul");
  const episodeNumber = `${counter + 1}`;
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
<li id="episode-names" class="episode-list">${episode.name} - S${season}E${episodeNumbers}</li>
<li class="episode-list"><img src="${episode.image.medium}" alt="episode thumbnails"</li>
<li id="episode-summary" class="episode-list">${episode.summary}</li>
`;
  if (!episodeIsIncluded(episode, searchBarValue)) {
    episodeCard.style.display = "none";
    if (episodeCard.style.display === "none") {
      counter--;
    }
    displayEpisode();
  }

  counter = counter + 1;
  displayEpisode();
  container.appendChild(episodeCard);
}

function makePageForEpisodes(episodeList, searchBarValue) {
  counter = 0;
  container.innerHTML = "";
  episodeList.forEach((episode) => {
    renderEpisode(episode, searchBarValue);
  });
}

selector.addEventListener("change", selectedEpisode);
function selectedEpisode(event) {
  if (event.target.value) {
    counter = 0;
    const allEpisodeCards = document.querySelectorAll(".all-episode-cards");
    allEpisodeCards.forEach((episodeCard) => {
      episodeCard.style.display = "none";
    });
    counter = counter + 1;
    searchBar.style.visibility = "hidden";
    searchBar.value = "";
    const chosenEpisodeCard = document.getElementById(`${event.target.value}`);
    chosenEpisodeCard.style.display = "initial";
    displayEpisode();
  } else {
    counter = 0;
    const allEpisodeCards = document.querySelectorAll(".all-episode-cards");
    allEpisodeCards.forEach((episodeCard) => {
      episodeCard.style.display = "initial";
      counter = counter + 1;
    });

    searchBar.style.visibility = "visible";
    displayEpisode();
  }
}

window.onload = setup;
