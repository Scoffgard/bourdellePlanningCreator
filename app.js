// Importation des librairies

const Jimp = require('jimp');


// Variables pour la création des formes et textes

let caseLeft = 80;
let caseTop = 92;

const weekDaysLeft = [150, 369, 572, 791, 992];
const weekDaysTop = 79;

const weekDays = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

const imageOutput = './output/image.png'

const hoursInfos = require('./cours.json');

let bold11, regular11, bold16, regular9;


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


// Chargement des polices
Jimp.loadFont('./fonts/PUBLIC_SANS_11_BLACK_BOLD.fnt').then(_1 => {
    bold11 = _1;
    Jimp.loadFont('./fonts/PUBLIC_SANS_11_BLACK_REGULAR.fnt').then(_2 => {
        regular11 = _2;
        Jimp.loadFont('./fonts/PUBLIC_SANS_16_BLACK_BOLD.fnt').then(_3 => {
            bold16 = _3;
            Jimp.loadFont('./fonts/PUBLIC_SANS_9_BLACK_REGULAR.fnt').then(_4 => {
                regular9 = _4;

                // Lecture de l'image et lancement des fonctions nécessités pour l'édition
                Jimp.read('./toedit.png', function (err, image) {
                    if (err) throw err;


                    // Ecriture du titre et du nom des jours de la semaine
                    writeTitle(image, `${info.name} - du ${info.dStart} au ${info.dEnd} ${info.monthStr} ${info.year}`);
                    drawWeekDays(image);


                    // Création des heures de cours
                    for (let y = 0; y <= 4; y++) { // Boucle executé pour chaque jours

                        // Définition de nombre d'heures maximum par jours
                        let maxHours = 9;
                        if (y == 2) {
                            maxHours = 3;
                        }

                        // Variable permettant de sauvegarder l'heure précedente
                        let lastHourPlacedID = null;
                        let sameHoursNumber = 1;

                        for(let i = 0; i <= maxHours; i++) { // Boucle executé pour chaque heures du jour

                            // Renvoie si l'heure actuelle est celle de midi
                            if (i == 4) {
                                lastHourPlacedID = null;
                                sameHoursNumber = 1;
                                continue;
                            }

                            // Genération d'un nombre aléatoire
                            let random = Math.floor(Math.random() * Math.floor(hoursInfos[info.classe].length));

                            // Regénération si le cours a était généré plus de 3 fois de suite
                            while (sameHoursNumber == 3 && random == lastHourPlacedID) {
                                random = Math.floor(Math.random() * Math.floor(hoursInfos[info.classe].length));
                            }

                            // Regénération si le cours n'a plus de créneaux disponibles
                            while (hoursInfos[info.classe][random].timeMax == 0) {
                                random = Math.floor(Math.random() * Math.floor(hoursInfos[info.classe].length));
                            }

                            // Regénération si c'est une heure de vide à 11h00
                            while (hoursInfos[info.classe][random].name == "" && i == 3) {
                                random = Math.floor(Math.random() * Math.floor(hoursInfos[info.classe].length));
                            }

                            // Regénération si c'est une heure de vide à 13h00
                            while (hoursInfos[info.classe][random].name == "" && i == 5) {
                                random = Math.floor(Math.random() * Math.floor(hoursInfos[info.classe].length));
                            }

                            // Retrait d'une heure au compteur max de la matière
                            hoursInfos[info.classe][random].timeMax--;

                            // Dessinage de l'heure selon le nombre d'heure à la suite
                            if(lastHourPlacedID == random) { // Si 2 ou 3 heure de suite
                                drawCours(image, y, i-sameHoursNumber, 1+sameHoursNumber, hoursInfos[info.classe][random]);
                                sameHoursNumber++;
                            } else { // Si une seul heure
                                drawCours(image, y, i, 1, hoursInfos[info.classe][random]);
                                sameHoursNumber = 1;
                            }

                            // Sauvegarde de l'heure actuelle
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

// Fonction permettant de dessiner l'arrière plan d'une période de cours
function drawCours(image, day, h, nb, course) {

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

    // Remplissage pixels après pixels du rectangle de la taille précisée par les paramètres de la fonction
    for (let x = 0; x <= 208; x++) {
        // Creation du fond du cours
        for (let y = 0; y <= 53*nb+nb+multipleCorrect*2; y++) {
            image.setPixelColor(parseInt(`0x${course.color}FF`, 16), caseLeft+x+(day*210), localCaseTop+y+(h*56));
        }

        // Tracage de traits noirs au dessus et en dessous du cours
        if (localCaseTop+53*nb+nb+multipleCorrect*2+(h*56)+1 != 427) {
            image.setPixelColor(parseInt(`0x000000FF`, 16), caseLeft+x+(day*210), localCaseTop+53*nb+nb+multipleCorrect*2+(h*56)+1);
        }
        if (localCaseTop+56*h-1 != 428) {
            image.setPixelColor(parseInt(`0x000000FF`, 16), caseLeft+x+(day*210), localCaseTop+56*h-1);
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
    
    // Impression du texte concernant le prof et la salle selon le type de cours
    if (nb == 1) { // Pour 1h
        image.print(regular11, caseLeft+(208/2)-Jimp.measureText(regular11, course.prof)/2+(day*210), caseTop+21+(h*56), course.prof);
        image.print(regular11, caseLeft+(208/2)-Jimp.measureText(regular11, course.salle)/2+(day*210), caseTop+37+(h*56), course.salle);
    } else { // Pour 2h et +
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