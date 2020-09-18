const VALUES = {
    title: {
        top: 51
    },
    marge: {
        left: 80,
        top: 92
    },
    box: {
        width: 208,
        height: 56
    },
    greenLine: {
        top: 427,
        bottom: 428
    }
};

class Drawer {

    constructor(image, fonts, Jimp) {
        this.Jimp = Jimp;
        this.image = image;
        this.fonts = fonts;
    }

    /**
     * Set the title of the image
     * @param {string} title The title of the image
     */
    setTitle(title) {
        const bold16Size = this.Jimp.measureText(this.fonts.BOLD16, title);
        this.image.print(this.fonts.BOLD16, this.image.bitmap.width / 2 - bold16Size / 2, VALUES.title.top, title);
    }

    /**
     * Set all the days titles
     * @param {number} day Day concerned [0-4]
     * @param {Object} info Object containing the informations given by the user
     */
    setDayTitle(day, info) {
        // add a 0 if the date has only one digit
        const dayTwoDigit = ('0' + (info.dStart + day.index)).slice(-2);
        const date = `${ day.label } ${ dayTwoDigit }/${ info.monthDec }`;
        this.image.print(this.fonts.REGULAR9, day.left, day.top, date);
    }

    /**
     * Draw a course on the image
     * @param {number} day The day concerned [0-4]
     * @param {number} hour The hour concerned [0-9]
     * @param {Object} course The course object containing course's infos
     * @param {number} nbConsecutiveCourse Number of consecutives hours
     */
    setCourse(day, hour, course, nbConsecutiveCourse) {
        let localCaseTop = VALUES.marge.top;
        if(hour > 5) localCaseTop++;

        // get info of the course's box
        const boxLeft = VALUES.marge.left + (day.index * (VALUES.box.width + 2));
        const boxRight = boxLeft + VALUES.box.width;
        const boxTop = localCaseTop + hour * VALUES.box.height - nbConsecutiveCourse * VALUES.box.height;
        const boxBottom = localCaseTop + hour * VALUES.box.height + VALUES.box.height;
        const boxMiddle = boxTop + VALUES.box.height / 2 * nbConsecutiveCourse;

        // get line height
        const topLine = boxTop - 1;
        const bottomLine = boxBottom - 1;
        
        // get each pixel of the box's width
        for (let x = boxLeft; x < boxRight + 1; x++) {

            // get each pixek of the box's height
            for (let y = boxTop; y < boxBottom; y++) {
                // color pixel, allow to set background color
                this.image.setPixelColor(parseInt(`0x${course.color}FF`, 16), x, y);
            }

            // Top dark line
            if (topLine !== VALUES.greenLine.bottom && !nbConsecutiveCourse) {
                this.image.setPixelColor(parseInt('0x000000FF', 16), x, topLine);
            }

            // Bottom dark line
            if (bottomLine !== VALUES.greenLine.top) {
                this.image.setPixelColor(parseInt('0x000000FF', 16), x, bottomLine);
            }
        }
                
        // define all textSize
        const courseTextSize = this.Jimp.measureText(this.fonts.BOLD11, course.name);
        const profTextSize = this.Jimp.measureText(this.fonts.REGULAR11, course.prof);
        const roomTextSize = this.Jimp.measureText(this.fonts.REGULAR11, course.room);

        // function to get startTextLeft based on textSize
        const getStartTextLeft = (textSize) => {
            return boxLeft + (VALUES.box.width / 2) - (textSize / 2);
        };


        this.image.print(this.fonts.BOLD11, getStartTextLeft(courseTextSize), boxMiddle + 5, course.name);
        this.image.print(this.fonts.REGULAR11, getStartTextLeft(profTextSize), boxMiddle + 21, course.prof);
        this.image.print(this.fonts.REGULAR11, getStartTextLeft(roomTextSize), boxMiddle + 37, course.room);
    }

    /**
     * Export the image under a file and send it to user
     * @param {string} outputFile Path to file
     * @param {*} res Express's reponse param needed for send back to use the image
     */
    export(outputFile, res) {
        this.image.write(outputFile, () => {
            res.sendFile(outputFile);
            console.log(`New image created with name : ${outputFile}`);
        });
    }
}

module.exports = Drawer;