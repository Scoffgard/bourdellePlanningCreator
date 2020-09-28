const Jimp = require('jimp');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Drawer = require('./src/Drawer');
const Infos = require('./src/Infos');

const profs = require('./config/profs.json');
const colors = require('./config/colors.json');
const config = require('./config/general.json');
let courses = require('./cours.json').term;


const app = express();

const freeCourseId = "PERM";
const inputFile = './toedit.png';
let outputFile = path.join(__dirname, './output/');
const port = '8080';

const day_top = 77;
const days = [{
    index: 0,
    label: "lundi",
    maxHours: 9,
    left: 152,
    top: day_top
}, {
    index: 1,
    label: "mardi",
    maxHours: 9,
    left: 371,
    top: day_top
}, {
    index: 2,
    label: "mercredi",
    maxHours: 3,
    left: 574,
    top: day_top
}, {
    index: 3,
    label: "jeudi",
    maxHours: 9,
    left: 793,
    top: day_top
}, {
    index: 4,
    label: "vendredi",
    maxHours: 9,
    left: 994,
    top: day_top
}];
let lastCourses = [];
const maxConsecutiveHours = 3;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    (async () => {

        
        courses = require('./cours.json').term;

       
        const fonts = {
            BOLD11: await Jimp.loadFont('./fonts/PUBLIC_SANS_11_BLACK_BOLD.fnt'),
            REGULAR11: await Jimp.loadFont('./fonts/PUBLIC_SANS_11_BLACK_REGULAR.fnt'),
            BOLD16: await Jimp.loadFont('./fonts/PUBLIC_SANS_16_BLACK_BOLD.fnt'),
            REGULAR9: await Jimp.loadFont('./fonts/PUBLIC_SANS_9_BLACK_REGULAR.fnt'),
        }

        const image = await Jimp.read(inputFile);
        const drawer = new Drawer(image, fonts, Jimp);
        const infos = new Infos();

        let student = infos.processStudentInfos(req.body);

        outputFile = path.join(outputFile, `img_${student.name.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(" ", "-")}.png`);

        courses = infos.setCoursesParameters(courses, freeCourseId, profs, colors, config.classrooms);
        
        const title = `${student.name} - du ${student.dStart} au ${student.dEnd} ${student.monthStr} ${student.year}`;

        drawer.setTitle(title);
        for(let day of days) {
            drawer.setDayTitle(day, student);
        }

        // dinnertime is pause, no course
        const dinnerTime = 4;
        let consecutiveHours = 0;
        // iterate over days
        for (let day of days) {
            lastCourses = [];
            // iterate over hours
            for (let hour = 0; hour < day.maxHours + 1; hour++) {
                if(hour !== dinnerTime) {
                    // remove timemax = 0 courses
                    courses = filterCourses(courses);
                    // Get new course randomly
                    const course = getRandomCourse(courses, lastCourses, hour);
                    // Add 1 to consectuive hour if this is the case
                    consecutiveHours = lastCourses[lastCourses.length - 1] === course.id ? consecutiveHours + 1 : 0;

                    lastCourses.push(course.id);
                    lastCourses = lastCourses.slice(-maxConsecutiveHours);
                    course.timeMax--;

                    // draw course
                    drawer.setCourse(day, hour, course, consecutiveHours);
                } else {
                    lastCourses = [];
                }
            }
        }

        return drawer.export(outputFile, res, outputFile);

    })();
});

app.listen(port, () => {
    console.log(`Server on and listening on port : ${port}`);
})



function filterCourses(courses) {
    return courses.filter(course => course.timeMax !== 0);
}

function getRandomCourse(courses, lastCourses, hour) {
    if (hour === 3 || hour === 5) {
        courses = courses.filter(course => course.id !== freeCourseId);
    }
    do {
        randomCourse = courses[Math.floor(Math.random() * courses.length)];
    } while (lastCourses.filter((course) => course === randomCourse.id).length === maxConsecutiveHours);
    return randomCourse;
}