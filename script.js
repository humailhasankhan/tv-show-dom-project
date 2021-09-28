//You can edit ALL of the code here
const selector = document.getElementById("episode-selector");
const container = document.getElementById("episodes-container");
const searchBar = document.getElementById("search");
function setup() {
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
  const showSelector = document.getElementById("show-selector");
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
        fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
          .then((response) => response.json())
          .then((allEpisodes) => {
            console.log(allEpisodes);
            selector.innerHTML = "<option value ''>--select episode--</option>";
            selector.value = "";
            makePageForEpisodes(allEpisodes);

            searchBar.addEventListener("keyup", (event) => {
              makePageForEpisodes(allEpisodes, event.target.value);
            });
            selector.style.visibility = "visible";
          });
      } else if (
        this.value === "" ||
        this.value === "null" ||
        this.value === undefined
      ) {
        selector.value = "";
        selector.style.visibility = "hidden";
        container.innerHTML = "";

        displayEpisode(-1);
      }
    }
  });
}

function makePageForEpisodes(episodeList, searchBarValue) {
  container.innerHTML = "";
  let episodeCounter = 0;
  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("ul");
    const season = ("0" + episode.season).slice(-2);
    const episodeNumbers = ("0" + episode.number).slice(-2);
    const selector = document.getElementById("episode-selector");
    const option = document.createElement("option");
    option.value = `${episodeCounter + 1}`;
    option.innerHTML = `S${season}E${episodeNumbers} - ${episode.name}`;
    selector.appendChild(option);
    selector.addEventListener("change", selectedEpisode);
    function selectedEpisode() {
      if (
        selector.options[selector.selectedIndex].innerText.includes(
          episode.name
        )
      ) {
        container.innerHTML = "";
        searchBar.value = "";
        searchBar.style.visibility = "hidden";
        episodeCounter = 0;
        populateEpisode();
        displayEpisode(0);
      } else if (
        this.value === "" ||
        this.value === "null" ||
        this.value === undefined
      ) {
        searchBar.style.visibility = "visible";
        populateEpisode();
        displayEpisode(-1);
      }
    }
    if (!episodeIsIncluded(episode, searchBarValue)) return;
    function populateEpisode() {
      episodeCard.innerHTML = "";
      episodeCard.innerHTML = `
<li class ="episode-names">${episode.name} - S${season}E${episodeNumbers}</li>
<li><img src="${episode.image.medium}" alt="episode thumbnails"</li>
<li class="episode-summary">${episode.summary}</li>
`;

      episodeCounter = episodeCounter + 1;
      container.appendChild(episodeCard);
    }
    populateEpisode();
  });
  function displayEpisode(number) {
    const heading = document.getElementById("heading");
    heading.innerHTML = `Displaying ${episodeCounter + number}/${
      episodeList.length
    } episodes`;
  }
  displayEpisode(0);
}

window.onload = setup;
