//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  const searchBar = document.getElementById("search");
  searchBar.addEventListener("keyup", (event) => {
    makePageForEpisodes(allEpisodes, event.target.value);
  });
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

function makePageForEpisodes(episodeList, searchBarValue) {
  const container = document.getElementById("episodes-container");
  container.innerHTML = "";
  let episodeCounter = 0;
  episodeList.forEach((episode) => {
    if (!episodeIsIncluded(episode, searchBarValue)) return;
    const episodeCard = document.createElement("ul");
    const season = ("0" + episode.season).slice(-2);
    const episodeNumbers = ("0" + episode.number).slice(-2);
    episodeCard.innerHTML = `
<li class ="episode-names">${episode.name} - S${season}E${episodeNumbers}</li>
<li><img src="${episode.image.medium}" alt="episode thumbnails"</li>
<li class="episode-summary">${episode.summary}</li>
`;
    episodeCounter = episodeCounter + 1;
    container.appendChild(episodeCard);
  });
  const heading = document.getElementById("heading");
  heading.innerHTML = `${episodeCounter}/${episodeList.length} episodes of Game of Thrones`;
}

window.onload = setup;
