const months = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

class Infos {
    constructor() {}

    /**
     * Set simple parameters like color and professor name
     * @param {Object || Array} courses An object or array containaing all the courses's objects
     * @param {string} freeCourseID Id of the free hour
     * @param {Array} profs List of professors
     * @param {Array} colors List of colors
     */
    setCoursesParameters(courses, freeCourseID, profs, colors) {
        for(let course of courses) {
            if(course.id == freeCourseID) continue;
            if(colors.length == 0) {colors.push('ffffff')};
            let randoms = [getRandomInt(profs.length), getRandomInt(colors.length)];
            course.prof = profs[randoms[0]];
            course.color = colors[randoms[1]];
            profs.splice(randoms[0], 1);
            colors.splice(randoms[1], 1);
        }
        return courses;
    }

    /**
     * Process of the content sent by the user and return under object from
     * @param {*} info Conntent sent by the user
     */
    processStudentInfos(info) {
        let askedDate = new Date(info.date);

        const infos = {
            "name": `${info.lName.toString().toUpperCase()} ${info.fName}`,
            "monthStr": months[askedDate.getMonth()],
            "monthDec": ('0' + askedDate.getMonth()).slice(-2),
            "year": askedDate.getFullYear(),
            "dStart": askedDate.getDate(),
            "dEnd": askedDate.addDays(5).getDate(),
            "level": info.level
        }

        return infos;
    } 

}    

module.exports = Infos;

/**
 * Send a integer between 0 and the max param
 * @param {number} max Max number for the random int
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Add days to a date properly
 * @param {number} days Number of days to add  
 */
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}