require('dotenv').config();

const thesKey = process.env.THES_KEY;
const form = document.querySelector('#form');
const inputField = document.querySelector('#input');
const submit = document.querySelector('#submit');
submit.addEventListener('click', getSynonyms);

// stop page refresh on enter
form.addEventListener('submit', event => {
    event.preventDefault();
});

document.addEventListener('keyup', event => {
    if (event.key === 'Enter') getSynonyms()
});

const responseField = document.getElementById('responseField');

async function getSynonyms() {
    let wordQuery = inputField.value
    let theUrl = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${wordQuery}?key=${thesKey}`;
    try {
        const response = await fetch(theUrl);
        if(response.ok){
            const data = await response.json()

            // Check if the API returned a valid response
            if (Array.isArray(data) && data.length > 0) {
                // Extract the synonyms from the response
                const synonyms = data[0].meta.syns[0];
                responseField.innerHTML = '';
                renderSynoynms(synonyms);
                responseField.style.opacity = 1;
            } 
        }
    }
    catch (error) {
        // Handle any errors that occurred during the fetch request
        // Invalid words
        throw new Error('Error fetching data: ' + error.message);
    }
    form.reset()
}

const renderSynoynms = (synonyms) => {
    const synonymDiv = document.createElement('div');
    let wordList = [];
    for (let i = 0; i < Math.min(synonyms.length, 27); ++i) {
        wordList.push(`<li>${synonyms[i]}</li>`);
    }
    wordList = wordList.join("");
    synonymDiv.innerHTML = wordList;
    responseField.appendChild(synonymDiv);
    adjustSynonymHeight(synonymDiv);
}

function adjustSynonymHeight(synonymDiv) {
    const contentHeight = synonymDiv.scrollHeight;
    responseField.style.height = (contentHeight + 150) / 3 + 'px';
}