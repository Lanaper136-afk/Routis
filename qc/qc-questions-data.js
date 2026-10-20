// Questions originales rédigées à partir des publications de la SAAQ.
const qcQuestions = [
{
"id": "qc1",
"theme": "permis",
"question": "Quel est l'âge minimal pour obtenir un permis d'apprenti conducteur de classe 5 au Québec ?",
"options": [
"16 ans",
"14 ans",
"15 ans",
"18 ans"
],
"correctIndex": 0,
"explanation": "L'âge minimal est de 16 ans. Avant 18 ans, un parent ou tuteur doit donner son consentement par écrit."
},
{
"id": "qc2",
"theme": "permis",
"question": "Pendant combien de temps minimum doit-on détenir le permis d'apprenti avant l'examen pratique ?",
"options": [
"3 mois",
"12 mois",
"6 mois",
"24 mois"
],
"correctIndex": 1,
"explanation": "Le permis d'apprenti doit être détenu au moins 12 mois avant l'examen pratique."
},
{
"id": "qc3",
"theme": "permis",
"question": "Combien de temps faut-il attendre pour se représenter à un examen de la SAAQ après un échec ?",
"options": [
"7 jours",
"14 jours",
"28 jours",
"3 mois"
],
"correctIndex": 2,
"explanation": "Le délai de reprise après un échec est de 28 jours."
},
{
"id": "qc4",
"theme": "permis",
"question": "Combien de temps dure le permis probatoire ?",
"options": [
"6 mois",
"12 mois",
"36 mois",
"24 mois"
],
"correctIndex": 3,
"explanation": "Le permis probatoire dure 24 mois, après quoi on obtient le permis de conduire."
},
{
"id": "qc5",
"theme": "permis",
"question": "De combien de modules se compose la phase 1 du cours de conduite ?",
"options": [
"4 modules",
"2 modules",
"6 modules",
"8 modules"
],
"correctIndex": 0,
"explanation": "La phase 1 comprend 4 modules, suivis d'un examen théorique à l'école de conduite."
},
{
"id": "qc6",
"theme": "permis",
"question": "À partir de quel mois d'apprentissage peut-on passer l'examen théorique de la SAAQ ?",
"options": [
"Le 1er mois",
"Le 10e mois",
"Le 3e mois",
"Le 24e mois"
],
"correctIndex": 1,
"explanation": "L'examen théorique est possible après 10 mois, l'examen pratique après 12 mois."
},
{
"id": "qc7",
"theme": "restrictions",
"question": "Depuis combien de temps l'accompagnateur d'un apprenti doit-il détenir un permis valide ?",
"options": [
"Au moins 6 mois",
"Au moins 1 an",
"Au moins 2 ans",
"Au moins 5 ans"
],
"correctIndex": 2,
"explanation": "L'accompagnateur doit avoir son permis depuis au moins 2 ans."
},
{
"id": "qc8",
"theme": "restrictions",
"question": "Quelle plage horaire est interdite aux apprentis et aux probatoires ?",
"options": [
"De 22 h à 6 h",
"De 20 h à 5 h",
"De minuit à 8 h",
"De minuit à 5 h"
],
"correctIndex": 3,
"explanation": "Il est interdit de conduire entre minuit et 5 h avec un permis d'apprenti ou probatoire."
},
{
"id": "qc9",
"theme": "restrictions",
"question": "Quel taux d'alcool est permis à un conducteur apprenti ?",
"options": [
"Aucun : tolérance zéro",
"0,02",
"0,05",
"0,08"
],
"correctIndex": 0,
"explanation": "Les apprentis et les probatoires sont soumis à la tolérance zéro pour l'alcool et la drogue."
},
{
"id": "qc10",
"theme": "points",
"question": "Combien de points d'inaptitude entraînent la révocation du permis d'un probatoire ?",
"options": [
"2 points",
"4 points",
"8 points",
"15 points"
],
"correctIndex": 1,
"explanation": "Pour un apprenti ou un probatoire, le maximum est de 4 points."
},
{
"id": "qc11",
"theme": "points",
"question": "Quel est le maximum de points d'inaptitude pour un titulaire de permis complet de 25 ans ou plus ?",
"options": [
"8 points",
"12 points",
"15 points",
"4 points"
],
"correctIndex": 2,
"explanation": "Le maximum est de 15 points à partir de 25 ans (12 points de 23 à 24 ans, 8 points avant 23 ans)."
},
{
"id": "qc12",
"theme": "points",
"question": "Quel est le maximum de points d'inaptitude pour un titulaire de permis complet de moins de 23 ans ?",
"options": [
"4 points",
"12 points",
"15 points",
"8 points"
],
"correctIndex": 3,
"explanation": "Avant 23 ans, le maximum est de 8 points."
},
{
"id": "qc13",
"theme": "points",
"question": "Pendant combien de temps les points d'inaptitude restent-ils au dossier ?",
"options": [
"2 ans",
"6 mois",
"1 an",
"5 ans"
],
"correctIndex": 0,
"explanation": "Les points restent au dossier 2 ans après la déclaration de culpabilité."
},
{
"id": "qc14",
"theme": "points",
"question": "Combien de points reçoit-on pour ne pas s'être arrêté à un feu rouge ou à un arrêt ?",
"options": [
"1 point",
"3 points",
"2 points",
"5 points"
],
"correctIndex": 1,
"explanation": "Ne pas s'immobiliser à un feu rouge ou à un arrêt vaut 3 points."
},
{
"id": "qc15",
"theme": "points",
"question": "Combien de points reçoit-on pour ne pas porter la ceinture de sécurité ?",
"options": [
"1 point",
"2 points",
"3 points",
"5 points"
],
"correctIndex": 2,
"explanation": "Ne pas porter la ceinture entraîne 3 points d'inaptitude."
},
{
"id": "qc16",
"theme": "points",
"question": "Combien de points reçoit-on pour ne pas céder le passage à un véhicule d'urgence ?",
"options": [
"1 point",
"2 points",
"9 points",
"4 points"
],
"correctIndex": 3,
"explanation": "Ne pas céder le passage à un véhicule d'urgence : 4 points."
},
{
"id": "qc17",
"theme": "alcool",
"question": "À partir de quelle alcoolémie la conduite devient-elle une infraction criminelle ?",
"options": [
"0,08 (80 mg par 100 ml de sang)",
"0,02",
"0,04",
"0,16"
],
"correctIndex": 0,
"explanation": "Le seuil criminel est de 80 mg d'alcool par 100 ml de sang, soit 0,08."
},
{
"id": "qc18",
"theme": "alcool",
"question": "Que se passe-t-il avec une alcoolémie de 0,16 ou plus ?",
"options": [
"Un simple avertissement",
"Suspension immédiate de 90 jours et saisie du véhicule 30 jours",
"Une amende sans suspension",
"Suspension de 24 heures"
],
"correctIndex": 1,
"explanation": "À 0,16 ou plus, le permis est suspendu 90 jours et le véhicule saisi pendant 30 jours."
},
{
"id": "qc19",
"theme": "alcool",
"question": "Quelle est la limite d'alcool pour un conducteur de taxi ?",
"options": [
"0,05",
"0,08",
"Zéro alcool",
"0,16"
],
"correctIndex": 2,
"explanation": "La tolérance zéro s'applique aussi aux conducteurs d'autobus, de minibus et de taxi."
},
{
"id": "qc20",
"theme": "alcool",
"question": "Un conducteur de 21 ans titulaire d'un permis complet peut-il avoir bu de l'alcool avant de conduire ?",
"options": [
"Oui, jusqu'à 0,05",
"Oui, jusqu'à 0,08",
"Oui, un verre",
"Non : zéro alcool avant 22 ans"
],
"correctIndex": 3,
"explanation": "La tolérance zéro s'applique aux conducteurs de moins de 22 ans, quel que soit leur permis."
},
{
"id": "qc21",
"theme": "alcool",
"question": "Quelle est la sanction pour de l'alcool détecté chez un conducteur soumis à la tolérance zéro ?",
"options": [
"Suspension de 90 jours, 4 points et amende de 300 $ à 600 $",
"Un avertissement",
"Aucun point mais 50 $",
"Un cours obligatoire seulement"
],
"correctIndex": 0,
"explanation": "Suspension de 90 jours, 4 points d'inaptitude et amende de 300 $ à 600 $."
},
{
"id": "qc22",
"theme": "alcool",
"question": "Quel seuil de THC dans le sang est visé par la loi au Québec ?",
"options": [
"10 ng/ml",
"2 ng/ml",
"50 ng/ml",
"Aucun seuil"
],
"correctIndex": 1,
"explanation": "Le seuil de THC est de 2 ng/ml dans le sang (selon le cas, 5 ng/ml ou 2,5 ng/ml combiné à 50 mg d'alcool)."
},
{
"id": "qc23",
"theme": "cellulaire",
"question": "Que doit faire un conducteur avec son cellulaire en conduisant ?",
"options": [
"Seulement envoyer des textos aux feux rouges",
"Le tenir pour répondre aux appels courts",
"Ne pas le manipuler",
"Le tenir seulement sur l'autoroute"
],
"correctIndex": 2,
"explanation": "Un conducteur n'a pas le droit de manipuler un cellulaire ou un appareil électronique portatif en conduisant."
},
{
"id": "qc24",
"theme": "cellulaire",
"question": "Combien de points d'inaptitude entraîne l'utilisation du cellulaire au volant (1re infraction) ?",
"options": [
"1 point",
"3 points",
"9 points",
"5 points"
],
"correctIndex": 3,
"explanation": "La première infraction : amende de 300 $ à 600 $ et 5 points."
},
{
"id": "qc25",
"theme": "cellulaire",
"question": "Dans la file d'un service à l'auto, peut-on manipuler son cellulaire ?",
"options": [
"Non : on est considéré au volant",
"Oui, car on est arrêté",
"Oui, s'il n'y a personne derrière",
"Oui, entre 12 h et 14 h"
],
"correctIndex": 0,
"explanation": "Dans la file d'un service à l'auto, le conducteur est considéré comme étant au volant."
},
{
"id": "qc26",
"theme": "cellulaire",
"question": "Dans quel cas peut-on utiliser son appareil, véhicule immobilisé sans être stationné ?",
"options": [
"Pour consulter ses courriels",
"Pour payer sans contact",
"Pour lire un message",
"Pour regarder une vidéo"
],
"correctIndex": 1,
"explanation": "Exceptions : paiement sans contact, preuve de commande ou d'accès, appel au 911 en cas d'urgence."
},
{
"id": "qc27",
"theme": "cellulaire",
"question": "Quelle est la suspension immédiate pour une première récidive d'usage du cellulaire dans les 2 ans ?",
"options": [
"1 jour",
"7 jours",
"3 jours",
"30 jours"
],
"correctIndex": 2,
"explanation": "Première récidive : 3 jours ; deuxième : 7 jours ; troisième : 30 jours."
},
{
"id": "qc28",
"theme": "vitesse",
"question": "Quelle est la limite de vitesse par défaut dans une agglomération ?",
"options": [
"30 km/h",
"60 km/h",
"70 km/h",
"50 km/h"
],
"correctIndex": 3,
"explanation": "Sans panneau, la limite est de 50 km/h dans les rues d'une agglomération."
},
{
"id": "qc29",
"theme": "vitesse",
"question": "Quelle est la vitesse maximale sur autoroute en l'absence de panneau ?",
"options": [
"100 km/h",
"90 km/h",
"110 km/h",
"120 km/h"
],
"correctIndex": 0,
"explanation": "Sans panneau, la vitesse maximale sur autoroute est de 100 km/h."
},
{
"id": "qc30",
"theme": "vitesse",
"question": "Quelle est la vitesse minimale sur autoroute en l'absence de panneau ?",
"options": [
"40 km/h",
"60 km/h",
"50 km/h",
"70 km/h"
],
"correctIndex": 1,
"explanation": "La vitesse minimale par défaut sur autoroute est de 60 km/h."
},
{
"id": "qc31",
"theme": "vitesse",
"question": "Quelle est la limite par défaut sur un chemin de gravier ?",
"options": [
"50 km/h",
"90 km/h",
"70 km/h",
"100 km/h"
],
"correctIndex": 2,
"explanation": "Sur un chemin de gravier, la limite par défaut est de 70 km/h."
},
{
"id": "qc32",
"theme": "vitesse",
"question": "Dans une zone de 50 km/h, quelle amende pour rouler à 70 km/h (hors zone spéciale) ?",
"options": [
"30 $",
"120 $",
"500 $",
"70 $"
],
"correctIndex": 3,
"explanation": "30 $ de base + 4 tranches de 5 km/h à 10 $ = 70 $."
},
{
"id": "qc33",
"theme": "vitesse",
"question": "Dans quels cas les amendes de vitesse sont-elles doublées ?",
"options": [
"Zones de travaux et zones scolaires",
"Seulement la nuit",
"Seulement sur autoroute",
"Seulement l'hiver"
],
"correctIndex": 0,
"explanation": "Elles sont doublées dans les zones de travaux (panneau orange) et dans les zones scolaires."
},
{
"id": "qc34",
"theme": "vitesse",
"question": "Quand l'amende doublée en zone scolaire s'applique-t-elle ?",
"options": [
"Tous les jours, toute l'année",
"De 7 h à 17 h, du lundi au vendredi, de septembre à juin",
"De 6 h à 22 h, tous les jours",
"Seulement pendant la récréation"
],
"correctIndex": 1,
"explanation": "Elle s'applique de 7 h à 17 h, du lundi au vendredi, de septembre à juin."
},
{
"id": "qc35",
"theme": "vitesse",
"question": "Sur une autoroute limitée à 100 km/h, à partir de quel excès parle-t-on de grand excès de vitesse ?",
"options": [
"20 km/h de plus",
"30 km/h de plus",
"60 km/h de plus",
"40 km/h de plus"
],
"correctIndex": 2,
"explanation": "Pour une limite de 100 km/h, le grand excès commence à 60 km/h au-dessus de la limite."
},
{
"id": "qc36",
"theme": "ecoles",
"question": "À quelle distance minimale d'un autobus scolaire dont les feux rouges clignotent doit-on s'arrêter ?",
"options": [
"À 1 mètre",
"À 2 mètres",
"À 20 mètres",
"À plus de 5 mètres"
],
"correctIndex": 3,
"explanation": "On s'arrête complètement, à plus de 5 mètres de l'autobus."
},
{
"id": "qc37",
"theme": "ecoles",
"question": "Que signifient les feux jaunes clignotants d'un autobus scolaire ?",
"options": [
"Se préparer à s'arrêter",
"Accélérer pour dépasser",
"Aucune obligation",
"Klaxonner"
],
"correctIndex": 0,
"explanation": "Les feux jaunes annoncent l'arrêt de l'autobus : préparez-vous à vous arrêter."
},
{
"id": "qc38",
"theme": "ecoles",
"question": "Quand peut-on repartir devant un autobus scolaire arrêté ?",
"options": [
"Dès que le conducteur d'autobus fait signe",
"Quand les feux sont éteints, le panneau replié et la voie libre d'enfants",
"Après 5 secondes",
"Dès que l'autobus bouge"
],
"correctIndex": 1,
"explanation": "On repart seulement quand les feux sont éteints, le panneau d'arrêt replié et la voie libre d'enfants."
},
{
"id": "qc39",
"theme": "ecoles",
"question": "Quand n'a-t-on pas à s'arrêter pour un autobus scolaire arrêté ?",
"options": [
"Quand il y a peu d'enfants",
"Quand on est pressé",
"Quand il roule de l'autre côté d'un terre-plein",
"Sur une route de campagne"
],
"correctIndex": 2,
"explanation": "L'arrêt n'est pas obligatoire si l'autobus circule de l'autre côté d'un terre-plein."
},
{
"id": "qc40",
"theme": "ecoles",
"question": "Quelle est la sanction pour ne pas s'arrêter devant un autobus scolaire ?",
"options": [
"30 $ et 1 point",
"100 $ et 3 points",
"Un avertissement",
"200 $ à 300 $ et 9 points"
],
"correctIndex": 3,
"explanation": "Amende de 200 $ à 300 $ et 9 points d'inaptitude."
},
{
"id": "qc41",
"theme": "ecoles",
"question": "À un passage pour écoliers, vers quels piétons doit-on céder le passage ?",
"options": [
"Ceux qui traversent ou montrent clairement leur intention de le faire",
"Seulement ceux déjà au milieu de la rue",
"Seulement les adultes",
"Aucun"
],
"correctIndex": 0,
"explanation": "On cède aux piétons qui traversent ou qui montrent clairement leur intention de le faire."
},
{
"id": "qc42",
"theme": "hiver",
"question": "À partir de quelle date les pneus d'hiver sont-ils obligatoires au Québec ?",
"options": [
"Le 1er novembre",
"Le 1er décembre",
"Le 15 octobre",
"Le 1er janvier"
],
"correctIndex": 1,
"explanation": "Ils sont obligatoires du 1er décembre au 15 mars."
},
{
"id": "qc43",
"theme": "hiver",
"question": "Jusqu'à quelle date les pneus d'hiver sont-ils obligatoires ?",
"options": [
"Le 1er mars",
"Le 1er avril",
"Le 15 mars",
"Le 1er mai"
],
"correctIndex": 2,
"explanation": "L'obligation se termine le 15 mars."
},
{
"id": "qc44",
"theme": "hiver",
"question": "Quelle est l'amende pour des pneus d'hiver manquants pendant la période obligatoire ?",
"options": [
"10 $ à 20 $",
"1 000 $ à 2 000 $",
"Aucune amende",
"200 $ à 300 $"
],
"correctIndex": 3,
"explanation": "L'amende va de 200 $ à 300 $."
},
{
"id": "qc45",
"theme": "hiver",
"question": "Quel pictogramme prouve qu'un pneu est un pneu d'hiver conforme ?",
"options": [
"Le pictogramme alpin (montagne et flocon)",
"Un soleil",
"Une goutte d'eau",
"Les lettres M+S seulement"
],
"correctIndex": 0,
"explanation": "Un pneu d'hiver conforme porte le pictogramme alpin ou est muni de clous."
},
{
"id": "qc46",
"theme": "hiver",
"question": "Les pneus d'hiver sont-ils obligatoires sur un véhicule immatriculé en Ontario qui circule au Québec ?",
"options": [
"Oui, toujours",
"Non : seuls les véhicules immatriculés au Québec sont visés",
"Oui, seulement à Montréal",
"Oui, seulement la nuit"
],
"correctIndex": 1,
"explanation": "Les véhicules immatriculés hors Québec ne sont pas visés par l'obligation."
},
{
"id": "qc47",
"theme": "hiver",
"question": "Quand les pneus à clous sont-ils permis (sur certains véhicules) ?",
"options": [
"Du 1er décembre au 15 mars seulement",
"Toute l'année",
"Du 15 octobre au 1er mai",
"Du 1er janvier au 1er mars"
],
"correctIndex": 2,
"explanation": "Les clous sont permis du 15 octobre au 1er mai sur certains véhicules."
},
{
"id": "qc48",
"theme": "intersections",
"question": "Où est interdit le virage à droite au feu rouge ?",
"options": [
"Partout au Québec",
"Seulement à Québec",
"Nulle part",
"Sur l'île de Montréal et là où un panneau l'interdit"
],
"correctIndex": 3,
"explanation": "Il est permis partout, sauf sur l'île de Montréal et là où un panneau l'interdit."
},
{
"id": "qc49",
"theme": "intersections",
"question": "Avant de tourner à droite au feu rouge, que doit-on faire ?",
"options": [
"Faire un arrêt complet puis céder le passage",
"Ralentir seulement",
"Klaxonner",
"Mettre les feux de détresse"
],
"correctIndex": 0,
"explanation": "On doit arrêter complètement avant la ligne d'arrêt, puis céder le passage aux autres usagers."
},
{
"id": "qc50",
"theme": "intersections",
"question": "Pour un virage à droite au feu rouge, qui a la priorité ?",
"options": [
"Le véhicule qui tourne",
"Les piétons, cyclistes et véhicules déjà dans l'intersection",
"Le premier arrivé",
"Personne"
],
"correctIndex": 1,
"explanation": "Le conducteur doit céder le passage ; le virage est un privilège, pas une obligation."
},
{
"id": "qc51",
"theme": "panneaux",
"question": "Que signifie un panneau octogonal rouge ?",
"options": [
"Cédez le passage",
"Danger",
"Arrêt obligatoire",
"Sens interdit"
],
"correctIndex": 2,
"explanation": "L'octogone rouge indique un arrêt complet obligatoire."
},
{
"id": "qc52",
"theme": "panneaux",
"question": "Que signifie un cercle rouge avec une barre blanche horizontale ?",
"options": [
"Arrêt",
"Stationnement interdit",
"Fin de zone",
"Sens interdit"
],
"correctIndex": 3,
"explanation": "Le cercle rouge à barre blanche indique un sens interdit : on ne peut pas entrer."
},
{
"id": "qc53",
"theme": "panneaux",
"question": "Que signale un panneau en forme de losange jaune ?",
"options": [
"Un danger",
"Des travaux",
"Une zone scolaire",
"Une règle à respecter"
],
"correctIndex": 0,
"explanation": "Le losange jaune annonce un danger."
},
{
"id": "qc54",
"theme": "panneaux",
"question": "Que signale un panneau en forme de losange orange ?",
"options": [
"Un danger permanent",
"Des travaux",
"Un sens unique",
"Une zone de stationnement"
],
"correctIndex": 1,
"explanation": "Le losange orange annonce des travaux."
},
{
"id": "qc55",
"theme": "panneaux",
"question": "Que signale un panneau jaune-vert fluorescent ?",
"options": [
"Une autoroute",
"Un arrêt",
"Une zone d'écoliers ou de piétons",
"Un cul-de-sac"
],
"correctIndex": 2,
"explanation": "Le jaune-vert fluorescent est réservé aux écoliers et aux piétons."
},
{
"id": "qc56",
"theme": "panneaux",
"question": "Un panneau de forme rectangulaire blanche indique généralement…",
"options": [
"Un danger",
"Des travaux",
"Un service touristique",
"Une règle à respecter"
],
"correctIndex": 3,
"explanation": "Les panneaux rectangulaires blancs indiquent des règles (limites, interdictions…)."
}
];
const qcThemes = {"permis": "Obtenir le permis", "restrictions": "Apprentis et probatoires", "points": "Points d'inaptitude", "alcool": "Alcool et drogues", "cellulaire": "Cellulaire", "vitesse": "Vitesse", "ecoles": "Autobus et écoles", "hiver": "Pneus d'hiver", "intersections": "Intersections", "panneaux": "Panneaux"};
const qcSigns = [{"id": "arret", "name": "Arrêt", "svg": "<svg viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"Panneau d'arrêt\"><polygon points=\"30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30\" fill=\"#fff\"/><polygon points=\"32,9 68,9 91,32 91,68 68,91 32,91 9,68 9,32\" fill=\"#c8102e\"/><text x=\"50\" y=\"58\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-weight=\"800\" font-size=\"19\" fill=\"#fff\">ARRÊT</text></svg>", "text": "Octogone rouge : arrêt complet obligatoire avant la ligne d'arrêt, puis cédez le passage aux autres usagers."}, {"id": "sens-interdit", "name": "Sens interdit", "svg": "<svg viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"Sens interdit\"><circle cx=\"50\" cy=\"50\" r=\"46\" fill=\"#c8102e\"/><rect x=\"18\" y=\"41\" width=\"64\" height=\"18\" fill=\"#fff\"/></svg>", "text": "Cercle rouge avec une barre blanche : vous ne pouvez pas entrer dans cette voie."}, {"id": "danger", "name": "Danger", "svg": "<svg viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"Losange jaune\"><polygon points=\"50,4 96,50 50,96 4,50\" fill=\"#111\"/><polygon points=\"50,10 90,50 50,90 10,50\" fill=\"#fdc82f\"/><rect x=\"46\" y=\"28\" width=\"8\" height=\"30\" rx=\"3\" fill=\"#111\"/><circle cx=\"50\" cy=\"68\" r=\"5\" fill=\"#111\"/></svg>", "text": "Losange jaune : un danger est annoncé plus loin sur la route. Ralentissez et soyez prudent."}, {"id": "travaux", "name": "Travaux", "svg": "<svg viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"Losange orange\"><polygon points=\"50,4 96,50 50,96 4,50\" fill=\"#111\"/><polygon points=\"50,10 90,50 50,90 10,50\" fill=\"#ff7a00\"/><rect x=\"46\" y=\"28\" width=\"8\" height=\"30\" rx=\"3\" fill=\"#111\"/><circle cx=\"50\" cy=\"68\" r=\"5\" fill=\"#111\"/></svg>", "text": "Losange orange : des travaux sont en cours. Les amendes de vitesse sont doublées dans une zone de travaux."}, {"id": "ecoliers", "name": "Zone d'écoliers ou de piétons", "svg": "<svg viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"Panneau jaune-vert\"><polygon points=\"50,4 96,50 50,96 4,50\" fill=\"#111\"/><polygon points=\"50,10 90,50 50,90 10,50\" fill=\"#c6e000\"/><circle cx=\"50\" cy=\"34\" r=\"6\" fill=\"#111\"/><path d=\"M50 42 L50 62 M50 48 L40 58 M50 48 L60 56 M50 62 L42 76 M50 62 L58 76\" stroke=\"#111\" stroke-width=\"5\" stroke-linecap=\"round\" fill=\"none\"/></svg>", "text": "Jaune-vert fluorescent : zone d'écoliers ou de piétons. Ralentissez et cédez le passage aux piétons qui traversent."}, {"id": "regle", "name": "Règle à respecter", "svg": "<svg viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"Rectangle blanc\"><rect x=\"22\" y=\"6\" width=\"56\" height=\"88\" rx=\"6\" fill=\"#fff\" stroke=\"#111\" stroke-width=\"3\"/><rect x=\"29\" y=\"14\" width=\"42\" height=\"12\" fill=\"#111\"/><rect x=\"29\" y=\"34\" width=\"42\" height=\"6\" fill=\"#ccc\"/><rect x=\"29\" y=\"46\" width=\"42\" height=\"6\" fill=\"#ccc\"/></svg>", "text": "Rectangle blanc : un panneau de règlement (par exemple une limite ou une interdiction de stationner)."}];
