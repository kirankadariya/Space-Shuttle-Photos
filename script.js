const main = document.querySelector("main");
const apodEl = document.querySelector(".apod");
const roverList = document.querySelector(".rover-list");
const errorMsg = document.querySelector(".error-msg");
const dateInput = document.querySelector("#date-input");
const submitButton = document.querySelector("#submit-button");

const BASE_URL = `https://space-shuttle-mar.netlify.app/.netlify/functions`;
const apodURL = `${BASE_URL}/apodApi`;

async function fetchData(url, handleData) {
  try {
    errorMsg.style.display = "none";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the API returned an error object
    if (data.error) {
      throw new Error(data.error.message || JSON.stringify(data.error));
    }

    handleData(data);
  } catch (error) {
    errorMsg.style.display = "block";
    errorMsg.innerHTML = "There is a problem with your fetch: " + error.message;
    console.error("Fetch error:", error);
  }
}

function handleApodData(data) {
  // Support both image and video media types from APOD
  let mediaHTML;
  if (data.media_type === "video") {
    mediaHTML = `<iframe src="${data.url}" title="${data.title}" width="560" height="315" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
  } else {
    mediaHTML = `<img src="${data.hdurl || data.url}" alt="${data.title}" loading="lazy">`;
  }

  const html = `
    ${mediaHTML}
    <h4>${data.title}</h4>
    <p>${data.explanation}</p>
  `;
  apodEl.innerHTML = html;
}

function handleRoverData(data) {
  roverList.innerHTML = "";
  if (!data.photos || !data.photos.length) {
    roverList.innerHTML =
      "<li>No photos were taken on this date. Please select another date.</li>";
  } else {
    const photos = data.photos
      .map(photo => `<li><img src="${photo.img_src}" alt="Rover photo" loading="lazy"></li>`)
      .join("");
    roverList.insertAdjacentHTML("beforeend", photos);
  }
}

// Fetch and display APOD on page load
fetchData(apodURL, handleApodData);

submitButton.addEventListener("click", function () {
  roverList.innerHTML = "<li>Loading...</li>";
  const date = dateInput.value
    ? dateInput.value
    : new Date().toISOString().slice(0, 10);

  const roverURL = `${BASE_URL}/roverApi?date=${date}`;
  fetchData(roverURL, handleRoverData);
});
