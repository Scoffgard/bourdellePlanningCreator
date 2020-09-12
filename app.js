// Importation des librairies

const Jimp = require('jimp');


// Variables pour la création des formes et textes

const colorDict = ["dcdc78", "95bfac", "7878dc", "84bdd0", "78dc78", "dc7878", "dcaa78", "ddf7f7"]; // , "f2f2f2"

let caseLeft = 80;
let caseTop = 92;

const weekDaysLeft = [150, 369, 572, 791, 992];
const weekDaysTop = 79;


// Variables reproduisant les valeurs normalement envoyés à l'application

const weekDays = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

const imageOutput = './output/image.png'

const info = {
    name : "Nymous Ano",
    dStart : 10,
    dEnd: 15,
    monthStr: "fevrier",
    monthDec: '02',
    year: "2021",
}


// Lecture de l'image et lancement des fonctions nécessités
Jimp.read('./toedit.png', function (err, image) {
    if (err) throw err;

    // Lancement de l'édition
    writeTitle(image, `${info.name} - du ${info.dStart} au ${info.dEnd} ${info.monthStr} ${info.year}`);
    drawWeekDays(image);
    drawBackGround(image, 0, 5, 3);
    drawBackGround(image, 3, 5, 1);


    // Sauvegarde finale de l'image    
    image.write(imageOutput, (err) => {
        if (err) throw err;
    });
    
});


// Fonction permetant de dessiner l'arrière plan d'une période de cours
function drawBackGround(image, day, h, nb) {

    let multipleCorrect = 2;
    let localCaseTop = caseTop;

    let correct = 0;

    // Correction de la hauteur pour les cases multiples après la barre verte
    if (nb > 1) {
        multipleCorrect = 2;
    } else {
        multipleCorrect = 0;
    }

    // En cas de dépassement de la barre verte de 14h, ajout d'un pixel au la hauteur générale
    if (h >= 6) {
        localCaseTop++;
    } else if (h == 5 && nb != 1) { // Ajout de taille aux heures multiples en cas de chevauchement de la ligne
        multipleCorrect+= 0.5;
    }

    // Choix au hasard d'une couleur parmis la liste a disposition
    let color = colorDict[Math.floor(Math.random() * Math.floor(colorDict.length))];

    // Remplissage pixels après pixels du rectangle de la taille préscisée par les paramètres de la fonction
    for (let x = 0; x <= 208+correct; x++) {
        for (let y = 0; y <= 53*nb+nb+multipleCorrect*2; y++) {
            image.setPixelColor(parseInt(`0x${color}FF`, 16), caseLeft+x+(day*210), localCaseTop+y+(h*56));
        }
    }

    // Sauvegarde de l'image
    image.write(imageOutput, (err) => {
        if (err) throw err;
    });

}

// Ecriture du titre du l'emploi du temps
function writeTitle(image, title) {
    // Chargement de la police
    Jimp.loadFont('./fonts/PUBLIC_SANS_16_BLACK_BOLD.fnt').then(font => {
        // Recupération de la taille du texte
        let textSize = Jimp.measureText(font, title.toString());
        // Ecriture du texte au centre de l'image
        image.print(font, image.bitmap.width/2-textSize/2, 51, title);
    }).then(() => {
            // Sauvegarde de l'image
            image.write(imageOutput, (err) => {
                if (err) throw err;
            });
        }
    );    
}

// Ecriture des jours et dates au dessus de chaques colonnes
function drawWeekDays(image) {
    // Chargement de la police
    Jimp.loadFont('./fonts/PUBLIC_SANS_9_BLACK_REGULAR.fnt').then(font => {
        // Boucle permettant d'écrire tout les jours de la semaine
        for(let i = 0; i <= 4; i++) {
            // Definition et évaluation de la nécessité du 0 devant le n° du jour
            let _0Needed = '0';
            if((info.dStart+i).toString()[1] != undefined) {_0Needed = '';}
            // Ecriture du texte selon son alignement prédéfini
            image.print(font, weekDaysLeft[i]+2, weekDaysTop-2, `${weekDays[i]} ${_0Needed}${info.dStart+i}/${info.monthDec}`);
        }
    }).then(() => {
            // Sauvegarde de l'image
            image.write(imageOutput, (err) => {
                if (err) throw err;
            });
        }
    );    
}