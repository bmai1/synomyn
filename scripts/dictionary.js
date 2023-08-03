require('dotenv').config();

const dictKey = process.env.DICT_KEY;
const form = document.querySelector('#form');
const inputField = document.querySelector('#input');
const submit = document.querySelector('#submit');
submit.addEventListener('click', getDefinition);

// stop page refresh on enter
form.addEventListener('submit', event => {
    event.preventDefault();
});

document.addEventListener('keyup', event => {
    if (event.key === 'Enter') getDefinition()
});

const definitionField = document.getElementById('definitionField');

async function getDefinition() {
    let wordQuery = inputField.value
    let dictUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${wordQuery}?key=${dictKey}`;
    try {
        const response = await fetch(dictUrl);
        if(response.ok){
            let data = await response.json()

            // adjust height based on response length
            definitionField.innerHTML = '';
            const definitionDiv = document.createElement('div');
            definitionDiv.innerHTML = `<h3>${wordQuery.toLowerCase()}</h2>` + data[0].shortdef[0];
            definitionField.appendChild(definitionDiv);
            adjustDefinitionHeight(definitionDiv);
            definitionField.style.opacity = 1;
        }
    }
    catch (error) {
        // Invalid words
        throw new Error('Error fetching data: ' + error.message);
    }
    form.reset()
}

function adjustDefinitionHeight(definitionDiv) {
    const contentHeight = definitionDiv.scrollHeight;
    definitionField.style.height = (contentHeight + 50) + 'px';
}