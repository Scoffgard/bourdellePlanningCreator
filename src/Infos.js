const months = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

class Infos {
    constructor(courses, profs, colors, classrooms) {
        this.courses = courses;
        this.profs = profs;
        this.colors = colors;
        this.classrooms = classrooms;
    }

    /**
     * Set simple parameters like color and professor name
     * @param {string} freeCourseID Id of the free hour
     */
    setCoursesParameters(freeCourseID) {
        for(let course of this.courses) {
            if(course.id == freeCourseID) continue;
            if(this.colors.length == 0) {this.colors.push('ffffff')};
            let randoms = [getRandomInt(this.profs.length), getRandomInt(this.colors.length)];
            let classroomInfos = new generateClassroom(this.classrooms);
            let classroom = `${classroomInfos.building.toString().toUpperCase()} ${classroomInfos.floor}${('0' + (classroomInfos.room+1)).slice(-2)}`;
            course.prof = this.profs[randoms[0]];
            course.color = this.colors[randoms[1]];
            course.room = classroom;
            this.profs.splice(randoms[0], 1);
            this.colors.splice(randoms[1], 1);
        }
        return this.courses;
    }

    /**
     * Process of the content sent by the user and return under object from
     * @param {*} info Conntent sent by the user
     */
    processStudentInfos(info) {
        let askedDate = new Date(info.date);

        const infos = {
            "name": `${info.lName.toString().toUpperCase()} ${info.fName.charAt(0).toUpperCase()}${info.fName.substring(1).toLowerCase()}`,
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
function getRandomInt(max, banned) {
    let random;
    if(typeof banned == Array) {
        do {
            random = Math.floor(Math.random() * Math.floor(max));
        } while (banned.indexOf(random) == undefined)
    } else if (typeof banned == Number) {
        do {
            random = Math.floor(Math.random() * Math.floor(max));
        } while (random == banned)
    } else {
        random = Math.floor(Math.random() * Math.floor(max));
    }
    return random;
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

function generateClassroom(classrooms) {
    let keys = Object.keys(classrooms);
    this.building = keys[getRandomInt(keys.length)];
    this.floor = getRandomInt(classrooms[this.building][0]);
    this.room = getRandomInt(classrooms[this.building][1]);
}