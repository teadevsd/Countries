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

toggleButton.addEventListener('click', e => {
    document.body.classList.toggle('dark-mode');
    toggleButton.classList.toggle('dark-mode');
    
    // Add dark mode to region list and navBar
    regionOptions.classList.toggle('dark-mode');
    navBar.classList.toggle('dark-mode');
});

// Dropdown toggle
dropdown.addEventListener('click', e =>{
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
        console.log(countries); // Log the fetched data
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
    });
    
    // After countries are rendered, activate search
    activateSearch();
}

// Function to handle search filtering
function activateSearch() {
    const countryDivs = document.querySelectorAll('.country'); // Make sure the countries are already rendered

    search.addEventListener('input', e => {
        const searchValue = search.value.toLowerCase();
        
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
        Array.from(regionsName).forEach(element => {
            if (element.innerText.includes(region.innerText) || region.innerText === 'All') {
                element.parentElement.parentElement.style.display = 'flex';
            } else {
                element.parentElement.parentElement.style.display = 'none';
            }
        });
    });
});



// Show or hide the clear button based on input
searchInput.addEventListener('input', () => {
    if (searchInput.value) {
        clearButton.style.display = 'block'; // Show clear button
    } else {
        clearButton.style.display = 'none'; // Hide clear button
    }
});

// Clear input field when clear button is clicked
clearButton.addEventListener('click', () => {
    searchInput.value = ''; // Clear input
    clearButton.style.display = 'none'; // Hide clear button
    searchInput.dispatchEvent(new Event('input')); // Trigger input event to reset filtering
});
