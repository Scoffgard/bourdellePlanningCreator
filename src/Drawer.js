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

    setTitle(title) {
        const bold16Size = this.Jimp.measureText(this.fonts.BOLD16, title);
        // Print on center of the image
        this.image.print(this.fonts.BOLD16, this.image.bitmap.width / 2 - bold16Size / 2, VALUES.title.top, title);
    }

    setDayTitle(day, student) {
        const dayTwoDigit = ('0' + (student.dStart + day.index)).slice(-2);
        const date = `${ day.label } ${ dayTwoDigit }/${ student.monthDec }`;
        this.image.print(this.fonts.REGULAR9, day.left, day.top, date);
    }

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

    export(outputFile) {
        this.image.write(outputFile, () => {
            console.log(`Image exporté dans le fichier : ${outputFile}`);
        });
    }
}

module.exports = Drawer;