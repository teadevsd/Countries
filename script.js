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
let currentFilter = ''; 

toggleButton.addEventListener('click', e => {
    document.body.classList.toggle('dark-mode');
    toggleButton.classList.toggle('dark-mode');
    
    
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


dropdown.addEventListener('click', e => {
    regionOptions.classList.toggle('show-regionlist');
});


fetch('./data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        countries = data;
        displayCountries();
    })
    .catch(error => console.error('Error fetching data:', error));

function displayCountries() {
    const countryContainer = document.getElementById('countryContainer');
    countryContainer.innerHTML = ''; 

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

        
        countryDiv.addEventListener('click', () => {
            displayCountryDescription(country);
        });
    });
    
    activateSearch();

    
    if (currentFilter) {
        filterCountries(currentFilter);
    }
}

function displayCountryDescription(country) {
    const countryDescrip = document.createElement('div');
    countryDescrip.className = 'countryDescrip';

    
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

    
    const countryContainer = document.getElementById('countryContainer');
    countryContainer.innerHTML = '';

    countryContainer.appendChild(countryDescrip);

    
    const searchContainer = document.querySelector('.searchCont');
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }

    const dropdownMenu = document.querySelector('.dropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.style.display = 'none'; 
    }

    const backButton = document.getElementById('backIcon');
    backButton.style.display = 'block';


    backButton.addEventListener('click', () => {
        displayCountries(); 

        
        if (searchContainer) {
            searchContainer.style.display = 'block'; 
        }

        if (dropdownMenu) {
            dropdownMenu.style.display = 'block';
        }


        if (currentFilter) {
            filterCountries(currentFilter);
        }
    });
}


function activateSearch() {
    const countryDivs = document.querySelectorAll('.country'); 

    search.addEventListener('input', e => {
        const searchValue = search.value.toLowerCase();
        currentFilter = searchValue; 
        
        countryDivs.forEach(countryDiv => {
            const countryName = countryDiv.querySelector('.countryName').innerText.toLowerCase();
            const regionName = countryDiv.querySelector('.regionsName').innerText.toLowerCase();
            const capitalName = countryDiv.querySelector('p:nth-child(4)').innerText.toLowerCase(); 


            if (countryName.includes(searchValue) || regionName.includes(searchValue) || capitalName.includes(searchValue)) {
                countryDiv.style.display = 'flex';
            } else {
                countryDiv.style.display = 'none';
            }
        });
    });
}


regions.forEach(region => {
    region.addEventListener('click', e => {
        currentFilter = region.innerText;
        filterCountries(currentFilter);
    });
});


function filterCountries(region) {
    const countryDivs = document.querySelectorAll('.country');
    countryDivs.forEach(countryDiv => {
        const regionName = countryDiv.querySelector('.regionsName').innerText.toLowerCase();
        if (regionName.includes(region.toLowerCase()) || region === 'All') {
            countryDiv.style.display = 'flex'; 
        } else {
            countryDiv.style.display = 'none'; 
        }
    });
}


searchInput.addEventListener('input', () => {
    if (searchInput.value) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
});


clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.style.display = 'none';
    currentFilter = '';
    displayCountries();
});


displayCountries();
