const APIBASEURL = 'https://api.namefake.com/French-france/';

class Infos {

    constructor(fetch) {
        this.fetch = fetch;
    }

    /**
     * This function give a random name taked on a online API
     * 
     * @param {string} gender Gender of the name 
     */
    async getNewProfName(gender) {
        try {
            const response = await this.fetch(APIBASEURL + gender);
            const json = await response.json();

            let nameArr = json.name.split(" ");

            console.log(nameArr)

            let newName = `${nameArr[nameArr.length-1].toUpperCase()} ${nameArr[0].charAt(0)}.`;

            return newName;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Infos;