const Jimp = require('jimp');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Drawer = require('./src/Drawer');
const Infos = require('./src/Infos');

const profs = JSON.stringify(require('./config/profs.json'));
const colors = JSON.stringify(require('./config/colors.json'));
const config = JSON.stringify(require('./config/general.json'));
const coursesJson = JSON.stringify(require('./config/cours.json').term);
let courses;

const app = express();

const freeCourseId = "PERM";
const inputFile = './toedit.png';
const outputFolder = path.join(__dirname, './output/');
let outputFile;
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
        
        const fonts = {
            BOLD11: await Jimp.loadFont('./fonts/PUBLIC_SANS_11_BLACK_BOLD.fnt'),
            REGULAR11: await Jimp.loadFont('./fonts/PUBLIC_SANS_11_BLACK_REGULAR.fnt'),
            BOLD16: await Jimp.loadFont('./fonts/PUBLIC_SANS_16_BLACK_BOLD.fnt'),
            REGULAR9: await Jimp.loadFont('./fonts/PUBLIC_SANS_9_BLACK_REGULAR.fnt'),
        }

        const image = await Jimp.read(inputFile);
        const drawer = new Drawer(image, fonts, Jimp);
        const infos = new Infos(coursesJson, profs, colors, config.classrooms);

        let student = infos.processStudentInfos(req.body);

        outputFile = path.join(outputFolder, `img_${student.name.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(" ", "-")}-${Date.now()}.png`);

<<<<<<< HEAD
        courses = infos.setCoursesParameters(freeCourseId);
=======
        courses = infos.setCoursesParameters(JSON.parse(coursesJson), freeCourseId, JSON.parse(profs), JSON.parse(colors), JSON.parse(config).classrooms);
>>>>>>> 97440a670f4d2046f7aeecc6998908d88878c83c
        
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
                    while (course === undefined)
                    // Add 1 to consectuive hour if this is the case
                    consecutiveHours = lastCourses[lastCourses.length - 1] === course.id ? consecutiveHours + 1 : 0;


                    course.timeMax--;
                    lastCourses.push(course.id);
                    lastCourses = lastCourses.slice(-maxConsecutiveHours);

                    // draw course
                    drawer.setCourse(day, hour, course, consecutiveHours);
                } else {
                    lastCourses = [];
                }
            }
        }

        return drawer.export(outputFile, res);

    })();
});

app.listen(port, () => {
    console.log(`Server on and listening on port : ${port}`);
})



function filterCourses(courses) {
    return courses.filter(course => course.timeMax != 0);
}

function getRandomCourse(courses, lastCourses, hour) {
    let randomCourse;
    if (hour === 3 || hour === 5) {
        courses = courses.filter(course => course.id != freeCourseId);
    }
    
    do {
        randomCourse = courses[Math.floor(Math.random() * courses.length)];
    } while (lastCourses.filter(course => course == randomCourse.id).length == maxConsecutiveHours);
    return randomCourse;
}