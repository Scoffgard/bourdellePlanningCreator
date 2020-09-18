const fetch = require('node-fetch');
const fs = require('fs');

const nbOfProfs = 50;

let profsList = [];

const APIBASEURL = 'https://api.namefake.com/French-france/';

(async () => {
    for(let i = 0; i < nbOfProfs; i++) {
        try {
            const random = Math.floor(Math.random() * 2);

            // Choose randomly the sex of the name
            const gender = random == 1 ? 'male' : 'female';


            const response = await fetch(APIBASEURL + gender);
            const json = await response.json();

            let nameArr = json.name.split(" ");

            // Make last name upper case and just save the first character of the first name
            let newName = `${nameArr[nameArr.length-1].toUpperCase()} ${nameArr[0].charAt(0)}.`;

            profsList.push(newName);

        } catch (error) {
            console.log(error);
        }
    }

    fs.writeFile('./config/profs.json', JSON.stringify(profsList), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})();