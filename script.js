const apodEl = document.querySelector(".apod");
const roverList = document.querySelector(".rover-list");
const errorMsg = document.querySelector(".error-msg");
const dateInput = document.querySelector("#date-input");
const submitButton = document.querySelector("#submit-button");

async function fetchData(url, handleData) {
  try {
    errorMsg.style.display = "none";
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      // Show the real error message from NASA or our function
      const msg = data.error || data.msg || `HTTP error! Status: ${response.status}`;
      throw new Error(msg);
    }

    handleData(data);
  } catch (error) {
    errorMsg.style.display = "block";
    errorMsg.textContent = "There is a problem with your fetch: " + error.message;
    console.error("Fetch error:", error);
  }
}

function handleApodData(data) {
  let mediaHTML;
  if (data.media_type === "video") {
    mediaHTML = `<iframe src="${data.url}" title="${data.title}" width="560" height="315" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
  } else {
    mediaHTML = `<img src="${data.hdurl || data.url}" alt="${data.title}" loading="lazy">`;
  }
  apodEl.innerHTML = `
    ${mediaHTML}
    <h4>${data.title}</h4>
    <p>${data.explanation}</p>
  `;
}

function handleRoverData(data) {
  roverList.innerHTML = "";
  if (!data.photos || !data.photos.length) {
    roverList.innerHTML = "<li>No photos were taken on this date. Please select another date.</li>";
  } else {
    roverList.innerHTML = data.photos
      .map(photo => `<li><img src="${photo.img_src}" alt="Rover photo" loading="lazy"></li>`)
      .join("");
  }
}

// Load APOD on page start
fetchData("/api/apod", handleApodData);

submitButton.addEventListener("click", function () {
  roverList.innerHTML = "<li>Loading...</li>";
  const date = dateInput.value || new Date().toISOString().slice(0, 10);
  fetchData(`/api/rover?date=${date}`, handleRoverData);
});
