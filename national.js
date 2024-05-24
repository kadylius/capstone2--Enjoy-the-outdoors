// Get references to the dropdown and info block elements
const LOCATIONSEARCH = document.getElementById("locationSearch");
const PARKTYPESEARCH = document.getElementById("parkTypeSearch");
const INFOBLOCK = document.getElementById("info");


window.onload = () => {

    //Call functions to populate dropdowns
    initStateDropdown();
    initTypeDropdown();

    //Append function to events with buttons
    document.getElementById('btnStates').addEventListener('click', function () {
        displayListElements('state');
    });

    document.getElementById('btnCategory').addEventListener('click', function () {
        displayListElements('category');
    });

}

// Get the dropdown element and reference the corresponding data array and populate lists
function initStateDropdown() {
    let placeHolder = new Option('Select One...', '');
    LOCATIONSEARCH.appendChild(placeHolder);

    for (const VAL of locationsArray) {
        let theOption = new Option(VAL, VAL);
        LOCATIONSEARCH.appendChild(theOption);
    }

    let placeHolderAll = new Option('View All', 'all');
    LOCATIONSEARCH.appendChild(placeHolderAll);
}

// initalize Type Dropdown
function initTypeDropdown() {
    let placeHolder = new Option('Select One...', '');
    PARKTYPESEARCH.appendChild(placeHolder);

    for (const VAL of parkTypesArray) {
        let theOption = new Option(VAL, VAL);
        PARKTYPESEARCH.appendChild(theOption);
    }

    let placeHolderAll = new Option('View All', 'all');
    PARKTYPESEARCH.appendChild(placeHolderAll);
}

// Display appropriate dropdown based off of selection and hide the other
function displayListElements(type) {
    const lsc = document.getElementById('locationSearchContainer');
    const ptsc = document.getElementById('parkTypeSearchContainer');
    const prl = document.getElementById('parkResultList');
    const ht = document.getElementById('helpText');

    INFOBLOCK.innerHTML = ``;

    switch (type) {
        case "state":
            ht.innerText = "Select a state to view parks";
            lsc.style.display = "";
            prl.style.display = "";
            ptsc.style.display = "none";
            break;
        case "category":
            ht.innerText = "Select an id to view parks";
            lsc.style.display = "none";
            ptsc.style.display = "";
            prl.style.display = "";
            break;
        default:
            lsc.style.display = "none";
            ptsc.style.display = "none";
            prl.style.display = "none";
            break;
    }
}

document.getElementById("locationSearch").addEventListener("change", function () {
    if (this.value) {
        const selectedValue = this.value;
        let foundparks = selectedValue === 'all' ? nationalParksArray : nationalParksArray.filter(park => park.State == selectedValue);
        populateList(foundparks);
    }
    else {
        INFOBLOCK.innerHTML = ``;
    }

    PARKTYPESEARCH.value = '';
});

document.getElementById("parkTypeSearch").addEventListener("change", function () {
    if (this.value) {
        const selectedValue = this.value;

        let foundparks = selectedValue === 'all' ? nationalParksArray : nationalParksArray.filter(park => park.LocationName.includes(selectedValue));
        populateList(foundparks);
    }
    else {
        INFOBLOCK.innerHTML = ``;
    }

    LOCATIONSEARCH.value = '';
});

//Populate the list and exclude properties that aren't valid
function populateList(inArray) {
    INFOBLOCK.innerHTML = '';
    let infoHtml = '';

    inArray.forEach(foundpark => {
        infoHtml += `<h2 class="card-title park-title">${foundpark.LocationName}</h2>
            <p>Park ID: ${foundpark.LocationID}</p>`;
        
        infoHtml += foundpark.Address ? `<span>Address: ${foundpark.Address}</span> ` : '';
        infoHtml += foundpark.City ? `<span>${foundpark.City}, </span>` : '';
        infoHtml += foundpark.State ? `<span> ${foundpark.State}</span><br>` : '';
        infoHtml += foundpark.ZipCode ? `<span>${foundpark.ZipCode}</span><br>` : '';
        infoHtml += foundpark.Phone ? `<span>Phone: ${foundpark.Phone}</span><br>` : '';
        infoHtml += foundpark.Fax ? `<span>Fax: ${foundpark.Fax}</span><br>` : '';

        if (foundpark.Visit) {
            infoHtml += `
                <div id="visitButton" class="d-flex justify-content-center pt-2">
                    <a class="btn mt-auto link-btn" href="${foundpark.Visit}">
                    Visit Park Page!
                    </a>
                </div>`;
        }
        
        infoHtml += '<hr class="hrlarge">';
    });

    // Remove the last <hr class="hrlarge">
    if (infoHtml.endsWith('<hr class="hrlarge">')) {
        infoHtml = infoHtml.slice(0, -20); // length of '<hr class="hrlarge">'
    }

    INFOBLOCK.innerHTML = infoHtml;
}