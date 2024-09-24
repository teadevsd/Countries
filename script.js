const dropdown = document.querySelector('.dropdownMenu');
const regionOptions = document.querySelector('.regionlist');
const toggleButton = document.querySelector('.toggle');
const search = document.querySelector('.search');
const regions = document.querySelectorAll('.regions');
const navBar = document.querySelector('.navBar');
const regionsName = document.getElementsByClassName('regionsName');
const searchInput = document.getElementById('searchButton');
const clearButton = document.querySelector('.clearButton');

let countries = [];
let currentFilter = ''; // Store current filter state

toggleButton.addEventListener('click', e => {
    document.body.classList.toggle('dark-mode');
    toggleButton.classList.toggle('dark-mode');
    
    // Add dark mode to region list and navBar
    regionOptions.classList.toggle('dark-mode');
    navBar.classList.toggle('dark-mode');

    const backIconButton = document.getElementById('backIcon');
    const borderButtons = document.querySelectorAll('.border button');

    if (backIconButton) {
        backIconButton.classList.toggle('dark-mode');
    }
    borderButtons.forEach(button => {
        button.classList.toggle('dark-mode');
    });
});

// Dropdown toggle
dropdown.addEventListener('click', e => {
    regionOptions.classList.toggle('show-regionlist');
});

// Fetch data and display countries
fetch('./data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        countries = data; // Assign the fetched data to countries
        displayCountries(); // Call your function to display countries
    })
    .catch(error => console.error('Error fetching data:', error));

function displayCountries() {
    const countryContainer = document.getElementById('countryContainer');
    countryContainer.innerHTML = ''; // Clear any existing content

    countries.forEach(country => {
        const countryDiv = document.createElement('div');
        countryDiv.className = 'country';

        countryDiv.innerHTML = `
            <div class="countryFlag">
                <img src="${country.flags && country.flags.svg ? country.flags.svg : 'https://example.com/default-flag.png'}" alt="${country.name} Flag">
            </div>

            <div class="countryDetails">
                <h5 class="countryName">${country.name || 'N/A'}</h5>
                <p><strong>Population:</strong> ${country.population ? country.population.toString() : 'N/A'}</p>
                <p class="regionsName"><strong>Region:</strong> ${country.region || 'N/A'}</p>
                <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
            </div>
        `;

        countryContainer.appendChild(countryDiv);

        // Attach click event to each countryDiv
        countryDiv.addEventListener('click', () => {
            displayCountryDescription(country);
        });
    });
    
    activateSearch(); // Call your search function after rendering the countries

    // Restore the current filter after going back
    if (currentFilter) {
        filterCountries(currentFilter);
    }
}

function displayCountryDescription(country) {
    const countryDescrip = document.createElement('div');
    countryDescrip.className = 'countryDescrip';

    // Create the detailed country information
    countryDescrip.innerHTML = `
        <button id="backIcon"> <img src="./images/back.svg" alt="Back"> Back</button>

        <div class="flagDetails">
            <img src="${country.flags && country.flags.svg ? country.flags.svg : 'https://example.com/default-flag.png'}" alt="${country.name} Flag">

            <div class="contDetails">
                <h3 class="contDetailsHead">${country.name || 'N/A'}</h3>

                <div class="countryInfo">
                    <div class="infor-count">
                        <p><strong>Native Name:</strong> ${country.nativeName || 'N/A'}</p>
                        <p><strong>Population:</strong> ${country.population ? country.population.toString() : 'N/A'}</p>
                        <p><strong>Region:</strong> ${country.region || 'N/A'}</p>
                        <p><strong>Sub Region:</strong> ${country.subregion || 'N/A'}</p>
                        <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
                    </div>

                    <div class="infor-count">
                        <p><strong>Top Level Domain:</strong> ${country.topLevelDomain ? country.topLevelDomain.join(', ') : 'N/A'}</p>
                        <p><strong>Currencies:</strong> ${country.currencies ? country.currencies.map(currency => currency.name).join(', ') : 'N/A'}</p>
                        <p><strong>Language:</strong> ${country.languages ? country.languages.map(language => language.name).join(', ') : 'N/A'}</p>
                    </div>
                </div>

                <div class="border">
                    <h5>Border Countries:</h5>
                    ${country.borders ? country.borders.map(border => `<button>${border}</button>`).join('') : 'No border countries'}
                </div>
            </div>
        </div>
    `;

    // Clear current content and show the country description
    const countryContainer = document.getElementById('countryContainer');
    countryContainer.innerHTML = ''; // Clear the country container

    countryContainer.appendChild(countryDescrip);

    // Hide the search container and dropdown menu when the country description is displayed
    const searchContainer = document.querySelector('.searchCont');
    if (searchContainer) {
        searchContainer.style.display = 'none'; // Hide search container
    }

    const dropdownMenu = document.querySelector('.dropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.style.display = 'none'; // Hide dropdown menu
    }

    // Show the back button
    const backButton = document.getElementById('backIcon');
    backButton.style.display = 'block'; // Show back button

    // Add functionality to the back button to go back to the country list
    backButton.addEventListener('click', () => {
        displayCountries(); // Go back to the country list view

        // Restore search styling
        if (searchContainer) {
            searchContainer.style.display = 'block'; // Show search container
        }

        if (dropdownMenu) {
            dropdownMenu.style.display = 'block'; // Show dropdown menu
        }

        // Restore previous filter
        if (currentFilter) {
            filterCountries(currentFilter);
        }
    });
}

// Function to handle search filtering
function activateSearch() {
    const countryDivs = document.querySelectorAll('.country'); // Make sure the countries are already rendered

    search.addEventListener('input', e => {
        const searchValue = search.value.toLowerCase();
        currentFilter = searchValue; // Update current filter state
        
        countryDivs.forEach(countryDiv => {
            const countryName = countryDiv.querySelector('.countryName').innerText.toLowerCase();
            const regionName = countryDiv.querySelector('.regionsName').innerText.toLowerCase();
            const capitalName = countryDiv.querySelector('p:nth-child(4)').innerText.toLowerCase(); // Capital element

            // Check if the search value matches any of these
            if (countryName.includes(searchValue) || regionName.includes(searchValue) || capitalName.includes(searchValue)) {
                countryDiv.style.display = 'flex'; // Show the country div
            } else {
                countryDiv.style.display = 'none'; // Hide the country div
            }
        });
    });
}

// Filtering based on regions
regions.forEach(region => {
    region.addEventListener('click', e => {
        currentFilter = region.innerText; // Update current filter state
        filterCountries(currentFilter);
    });
});

// Function to filter countries based on region
function filterCountries(region) {
    const countryDivs = document.querySelectorAll('.country');
    countryDivs.forEach(countryDiv => {
        const regionName = countryDiv.querySelector('.regionsName').innerText.toLowerCase();
        if (regionName.includes(region.toLowerCase()) || region === 'All') {
            countryDiv.style.display = 'flex'; // Show the country div
        } else {
            countryDiv.style.display = 'none'; // Hide the country div
        }
    });
}

// Show or hide the clear button based on input
searchInput.addEventListener('input', () => {
    if (searchInput.value) {
        clearButton.style.display = 'block'; // Show clear button
    } else {
        clearButton.style.display = 'none'; // Hide clear button
    }
});

// Clear input and reset filter
clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none'; // Hide clear button
    currentFilter = ''; // Reset filter state
    displayCountries(); // Display all countries again
});

// Handle the initial display of countries
displayCountries();
