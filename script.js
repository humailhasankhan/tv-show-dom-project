//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `${episodeList.length} episodes of Game of Thrones`;
  const displayArea = document.createElement("div");
  displayArea.className = "episodes-container";
  rootElem.appendChild(displayArea);
  const footer = document.createElement("footer");
  rootElem.appendChild(footer);
  const footerDiv = document.createElement("div");
  footer.appendChild(footerDiv);
  const footerCopyRightParagraph = document.createElement("p");
  footerDiv.appendChild(footerCopyRightParagraph);
  footerCopyRightParagraph.innerHTML =
    "<a href='https://www.tvmaze.com/'>© TVMaze.com</a>";
  episodeList.map((episode) => {
    const allEpisodeList = document.createElement("ul");
    const episodeNames = document.createElement("li");
    episodeNames.className = "episode-names";
    const episodeImageListItem = document.createElement("li");
    const episodeImage = document.createElement("img");
    const episodeSummary = document.createElement("li");
    episodeSummary.className = "episode-summary";
    const season = ("0" + episode.season).slice(-2);
    const episodeNumbers = ("0" + episode.number).slice(-2);
    episodeNames.innerHTML = `${episode.name} - S${season}E${episodeNumbers}`;
    episodeImage.src = episode.image.medium;
    episodeImage.alt = "episode thumbnails";
    episodeSummary.innerHTML = episode.summary;
    episodeImageListItem.appendChild(episodeImage);
    allEpisodeList.appendChild(episodeNames);
    allEpisodeList.appendChild(episodeImageListItem);
    allEpisodeList.appendChild(episodeSummary);
    displayArea.appendChild(allEpisodeList);
  });
}

window.onload = setup;
