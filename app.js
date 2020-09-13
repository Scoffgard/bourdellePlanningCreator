// Importation des librairies

const Jimp = require('jimp');


// Variables pour la création des formes et textes

const colorDict = ["7878dc", "84bdd0", "78dc78", "dc7878", "dcaa78", "ddf7f7"]; // , "f2f2f2"

let caseLeft = 80;
let caseTop = 92;

const weekDaysLeft = [150, 369, 572, 791, 992];
const weekDaysTop = 79;

const weekDays = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

const imageOutput = './output/image.png'

const hoursInfos = {
    "term": [
        {
            name: "PHYSIQ.CHIMIE&MATHS",
            prof: "MAGNE J.",
            salle: "C101",
            color : "dcdc78"
        },
        {
            name: "ENS.SPEC. STI2D",
            prof: "KOHIL A.",
            salle: "D45",
            color: "95bfac"
        }
    ]
}

// Variables reproduisant les valeurs normalement envoyés à l'application

const info = {
    name : "Nymous Ano",
    dStart : 10,
    dEnd: 15,
    monthStr: "fevrier",
    monthDec: '02',
    year: "2021",
    classe: "term"
}

let bold11, regular11, bold16, regular9;

Jimp.loadFont('./fonts/PUBLIC_SANS_11_BLACK_BOLD.fnt').then(_1 => {
    bold11 = _1;
    Jimp.loadFont('./fonts/PUBLIC_SANS_11_BLACK_REGULAR.fnt').then(_2 => {
        regular11 = _2;
        Jimp.loadFont('./fonts/PUBLIC_SANS_16_BLACK_BOLD.fnt').then(_3 => {
            bold16 = _3;
            Jimp.loadFont('./fonts/PUBLIC_SANS_9_BLACK_REGULAR.fnt').then(_4 => {
                regular9 = _4;

                // Lecture de l'image et lancement des fonctions nécessités
                Jimp.read('./toedit.png', function (err, image) {
                    if (err) throw err;

                    // Lancement de l'édition
                    writeTitle(image, `${info.name} - du ${info.dStart} au ${info.dEnd} ${info.monthStr} ${info.year}`);
                    drawWeekDays(image);

                    for (let y = 0; y <= 4; y++) {
                        let maxHours = 9;
                        if (y == 2) {
                            maxHours = 3;
                        }
                        let lastHourPlacedID = null;
                        let sameHoursNumber = 1;

                        for(let i = 0; i <= maxHours; i++) {
                            if (i == 4) {
                                lastHourPlacedID = null;
                                sameHoursNumber = 1;
                                continue;
                            }
                            let random = Math.floor(Math.random() * Math.floor(hoursInfos[info.classe].length));
                            while (sameHoursNumber == 3 && random == lastHourPlacedID) {
                                random = Math.floor(Math.random() * Math.floor(hoursInfos[info.classe].length));
                            }
                            if(lastHourPlacedID == random) {
                                drawBackGround(image, y, i-sameHoursNumber, 1+sameHoursNumber, hoursInfos[info.classe][random]);
                                sameHoursNumber++;
                            } else {
                                drawBackGround(image, y, i, 1, hoursInfos[info.classe][random]);
                                sameHoursNumber = 1;
                            }
                            lastHourPlacedID = random;
                        }
                    }


                    // Sauvegarde finale de l'image    
                    image.write(imageOutput, (err) => {
                        if (err) throw err;
                    });
                    
                });
    
            });
        });
    });
});





// Fonction permetant de dessiner l'arrière plan d'une période de cours
function drawBackGround(image, day, h, nb, course) {

    let multipleCorrect = 2;
    let localCaseTop = caseTop;

    // Correction de la hauteur pour les cases multiples
    if (nb == 1) {
        multipleCorrect = 0;
    } else if (nb == 2) {
        multipleCorrect = 1;
    } else {
        multipleCorrect = 2;
    }

    // En cas de dépassement de la barre verte de 14h, ajout d'un pixel au la hauteur générale
    if (h >= 6) {
        localCaseTop++;
    } else if (h == 5 && nb != 1) { // Ajout de taille aux heures multiples en cas de chevauchement de la ligne
        multipleCorrect+= 0.5;
    }

    // Choix au hasard d'une couleur parmis la liste a disposition
    let color = course.color;

    // Remplissage pixels après pixels du rectangle de la taille préscisée par les paramètres de la fonction
    for (let x = 0; x <= 208; x++) {
        for (let y = 0; y <= 53*nb+nb+multipleCorrect*2; y++) {
            image.setPixelColor(parseInt(`0x${color}FF`, 16), caseLeft+x+(day*210), localCaseTop+y+(h*56));
        }
    }

    
    // Recupération de la taille du texte
    let textSize = Jimp.measureText(bold11, course.name);
    // Ecriture du texte au centre de l'image
    if (nb == 1) {
        image.print(bold11, caseLeft+(208/2)-textSize/2+(day*210), caseTop+5+(h*56), course.name);
    } else {
        image.print(bold11, caseLeft+(208/2)-textSize/2+(day*210), caseTop+5+((h+((nb-1)/2))*56), course.name);
    }
    

    
    if (nb == 1) {
        image.print(regular11, caseLeft+(208/2)-Jimp.measureText(regular11, course.prof)/2+(day*210), caseTop+21+(h*56), course.prof);
        image.print(regular11, caseLeft+(208/2)-Jimp.measureText(regular11, course.salle)/2+(day*210), caseTop+37+(h*56), course.salle);
    } else {
        image.print(regular11, caseLeft+(208/2)-Jimp.measureText(regular11, course.prof)/2+(day*210), caseTop+21+((h+((nb-1)/2))*56), course.prof);
        image.print(regular11, caseLeft+(208/2)-Jimp.measureText(regular11, course.salle)/2+(day*210), caseTop+37+((h+((nb-1)/2))*56), course.salle);
    }
    


}

// Ecriture du titre du l'emploi du temps
function writeTitle(image, title) {
    // Recupération de la taille du texte
    let textSize = Jimp.measureText(bold16, title.toString());
    // Ecriture du texte au centre de l'image
    image.print(bold16, image.bitmap.width/2-textSize/2, 51, title);
}        

// Ecriture des jours et dates au dessus de chaques colonnes
function drawWeekDays(image) {
    // Boucle permettant d'écrire tout les jours de la semaine
    for(let i = 0; i <= 4; i++) {
        // Definition et évaluation de la nécessité du 0 devant le n° du jour
        let _0Needed = '0';
        if((info.dStart+i).toString()[1] != undefined) {_0Needed = '';}
        // Ecriture du texte selon son alignement prédéfini
        image.print(regular9, weekDaysLeft[i]+2, weekDaysTop-2, `${weekDays[i]} ${_0Needed}${info.dStart+i}/${info.monthDec}`);
    }   
}