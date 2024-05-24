"use strict";


const MOUNTAINSEARCH = document.getElementById('mountainDropDown');
const INFOBLOCK = document.getElementById('infoBlock');

window.onload = () => {
    initMountainDropdown();
    initializeInfoBlock();
};

function initMountainDropdown() {
    let placeHolder = new Option('Select One...', '');
    MOUNTAINSEARCH.appendChild(placeHolder);

    for (const VAL of mountainsArray) {
        let theOption = new Option(VAL.name, VAL.name);
        MOUNTAINSEARCH.appendChild(theOption);
    }
}

MOUNTAINSEARCH.addEventListener("change", function () {
    if (this.value) {
        const selectedValue = this.value;
        let foundMountain = mountainsArray.find(mtn => mtn.name == selectedValue);
        updateInfoBlock(foundMountain);
    } else {
        INFOBLOCK.innerHTML = `<p class="d-flex justify-content-center card-title">Please select a mountain from the dropdown</p>`;
    }
});

async function getSunsetForMountain(lat, lng) {
    try {
        let response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching sunset data:', error);
        throw error;
    }
}

function initializeInfoBlock() {
    const params = new URLSearchParams(window.location.search);
    const mountainName = params.get('mountain');

    if (mountainName) {
        const selectedMountain = mountainsArray.find(mountain => mountain.name === mountainName);
        if (selectedMountain) {
            MOUNTAINSEARCH.value = mountainName;
            updateInfoBlock(selectedMountain);
        }
    }
}

async function updateInfoBlock(mountain) {
    INFOBLOCK.innerHTML = `
        <div class="d-flex justify-content-center mb-4">
            <img src="imgs/${mountain.img}" alt="${mountain.name}" class='drop-shadow-img' height="375px">
        </div>
        <hr class="hrlarge my-5">
        <h2 class="card-title">${mountain.name}</h2>
        <p>${mountain.desc}</p>
        <span>Elevation: ${mountain.elevation} ft.</span><br>
        <span>Difficulty: ${mountain.effort}</span><br>
        <span data-tooltip="Latitude and Longitude">Location: ${mountain.coords.lat}, ${mountain.coords.lng}</span><br>
        <span>Sunrise and Sunset (UTC): Loading...</span>
        <div class="img-pad"></div>`;

    try {
        const sunInfo = await getSunsetForMountain(mountain.coords.lat, mountain.coords.lng);
        INFOBLOCK.innerHTML = `
            <div class="d-flex justify-content-center mb-4">
                <img src="imgs/${mountain.img}" alt="${mountain.name}" class='drop-shadow-img' height="375px">
            </div>
            <hr class="hrlarge my-5">
            <h2 class="card-title">${mountain.name}</h2>
            <p>${mountain.desc}</p>
            <span>Elevation: ${mountain.elevation} ft.</span><br>
            <span>Difficulty: ${mountain.effort}</span><br>
            <span data-tooltip="Latitude and Longitude">Location: ${mountain.coords.lat}, ${mountain.coords.lng}</span><br>
            <span>Sunrise and Sunset (UTC): ${sunInfo.results.sunrise} & ${sunInfo.results.sunset}</span>
            <div class="img-pad"></div>`;
    } catch (error) {
        INFOBLOCK.innerHTML = `
            <div class="d-flex justify-content-center mb-4">
                <img src="imgs/${mountain.img}" alt="${mountain.name}" class='drop-shadow-img' height="375px">
            </div>
            <hr class="hrlarge my-5">
            <h2 class="card-title">${mountain.name}</h2>
            <p>${mountain.desc}</p>
            <span>Elevation: ${mountain.elevation} ft.</span><br>
            <span>Difficulty: ${mountain.effort}</span><br>
            <span data-tooltip="Latitude and Longitude">Location: ${mountain.coords.lat}, ${mountain.coords.lng}</span><br>
            <span>Sunrise and Sunset (UTC): There was an issue loading this data; sorry for the inconvenience!</span>
            <div class="img-pad"></div>`;
    }
}
