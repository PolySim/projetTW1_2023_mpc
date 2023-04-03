/******************************************
           === variables globales === 
********************************************/
const EFFECTIF_MAX = 11; //effectif max pour une équipe
const POSTES = ["gardien","defenseur","milieu","attaquant"]; // noms des différents postes
const FORMATION_INITIALE="433"; // formation choisie par défaut au lancement

let joueurChoisi; // joueur choisi lors d'un click dans la zone joueurs


/**
 * initialisation
 */
const init = function(){
    raz();
    remplirPostes(FORMATION_INITIALE);
    const ok = document.getElementById("ok");
    ok.addEventListener("click", changeFormation);
}


/*****************************************************
           === Réinitialisation de la page=== 
******************************************************/

/**
 * Mise à l'état initial (feuille de match, effectifs et joueurs)
 * lors d'un changement de formation
 */
const raz = function(){
    razZoneJoueurs();
    abonneClickJoueurs();
    viderFeuilleDeMatch()
    effectifsA0();
}

/**
 * vide la feuille de match
 */
const viderFeuilleDeMatch = () => {
    const players = document.getElementById("feuilleDeMatch").getElementsByTagName("li");

    const numberPlayer = players.length
    for (let i = 0; i < numberPlayer; i++) {
        players[0].remove();
    };
}

/**
 * Réinitialise tous les effectifs du tableau HTML à 0
 */
const effectifsA0=function(){
    const poste = document.getElementsByTagName("td");
    for (const elt of poste) {
        elt.textContent = "0";
    };
}

/** 
 * Vide la <div> d'id "joueurs" puis la remplit à partir des données
 * présentes dans le script utilisé : "men.js" ou "women.js"
 */
const razZoneJoueurs = function(){
    //TODO décommenter le code suivant à la question Q6

    const joueurs = document.getElementById("joueurs");
    joueurs.innerHTML = "";
	for(let i = 0; i < playersData.length; i++) {
		joueurs.appendChild(creerJoueur(playersData[i]));
	} 
}

/*****************************************************
           ===Changement de formation=== 
******************************************************/

/**
 *  change la formation présente sur le terrain
 *  puis remet la page dans on état initial.
 */
const changeFormation = function(){
    const input = document.getElementById('formation');
    if(verifFormation(input.value)){
        remplirPostes(input.value)
        raz();
    }
}

/**
 * Détermine si la formation de l'équipe est valide
 * 3 caractères correspondants à des nombres entiers 
 * de défenseurs, milieu et attaquants sont attendus :
 * - Les défenseurs sont 3 au moins, 5 au plus
 * - Les milieux : 3 au moins, 5 au plus
 * - Les attaquants : 1 au moins, 3 au plus
 * (Le gardien est toujours unique il n'est pas représenté dans la chaine de caractères).
 * @param {String} formation - la formation à tester provenant de l'input correspondant
 * @return {Boolean} - true si la formation est valide, false sinon
 */


const verifFormation = (formation) => {
    const caractèresSplit = formation.split('');

    if(caractèresSplit.every(elt => (elt < 10 && elt > 0)) && caractèresSplit.length === 3 && parseInt(caractèresSplit[0]) + parseInt(caractèresSplit[1]) + parseInt(caractèresSplit[2]) === 10){
        return true;
    } else {
        const buttonOk = document.getElementById("ok");
        buttonOk.style.animation = "nope 0.2s infinite";

        setTimeout(() => {
            buttonOk.style.animation = "none";
        }, 300);
        
        return false;
    }
}


/**
 * Remplit les lignes de joueur en fonction de la formation choisie
 * @param {String} formation - formation d'équipe
 */
const remplirPostes = function(formation){
    const effectifs = [1]; // ajout du gardien
    for (c of formation)
        effectifs.push(parseInt(c))
    const lignes = document.getElementById("terrain").children
    for (let i=0; i<lignes.length ; i ++){
        lignes[i].innerHTML = ""
        for (let j = 0; j<effectifs[i]; j++){
            lignes[i].innerHTML +="<div class='positions "+POSTES[i]+"'></div>";
        }
    }
}

/*****************************************************
           === création des joueurs=== 
******************************************************/

/** Crée une <div> représentant un joueur avec un id de la forme "j-xxxxxx"
 * @param {Object} data - données d'un joueur
 * @return {HTMLElement} - div représentant un joueur
 */
const creerJoueur = (data) => {

    //TODO créer une div joueur (attention aux attributs nécessaires)
    const player = document.createElement("div");
    player.id = `j-${data.id}`;
    player.className = `joueur ${data.poste}`;
	
	// TODO créer l'image et l'ajouter  à la div joueur
    const image = document.createElement("img");
    image.src = data.src;
    image.alt = data.nom;
    player.appendChild(image);
    
    // TODO créer les <div> correspondants au nom et au poste et les ajouter  à la div joueur
    const name = document.createElement("div");
    name.className = "nom";
    name.textContent = data.nom;
    player.appendChild(name);
    
    const poste = document.createElement("div");
    poste.className = 'poste';
    poste.textContent = data.poste;
    player.appendChild(poste);
    
    // TODO : relisez bien la documentation
    return player;
}


/*****************************************************
           ===Sélection des joueurs=== 
******************************************************/

/** 
 * Abonne les <div> de class "joueur" à la fonction selectionneJoueur pour un click
 */
const abonneClickJoueurs = () => {
    const players = document.getElementsByClassName("joueur");

    for (const player of players){
        player.addEventListener("click", selectionneJoueur);
    }
}

/** 
 * Selectionne un joueur, change son opacité puis le place sur le terrain
 */
const selectionneJoueur = function(){
    joueurChoisi = this;
    this.style.opacity="0.3";
    placeJoueur();
}


/*************************************************************
           ===Modifications des joueurs sur le terrain=== 
************************************************************/

/**
 * Renvoie le noeud DOM correspondant à la position disponible pour placer un
 *  joueur sur le terrain ou null si aucune n'est disponible
 * @param {HTMLElement} ligne - une div ligne de joueurs sur le terrain
 * @returns {HTMLElement || null} - une div de class "positions" disponible dans cette ligne
 */
const trouveEmplacement = (ligne) => {
    const postes = ligne.getElementsByTagName("div");

    return Object.values(postes).find(poste => (poste.id === "")) || null
}

/**
 * Renvoie le noeud DOM correspondant à la 
 * ligne où placer un joueur qur le terrain en fonction de son poste
 * @param {String} poste - poste du joueur
 * @returns {HTMLElement} - une div parmi les id #ligne...
 */
const trouveLigne = function(poste){
    return document.getElementById("ligne" + poste.substring(0,1).toUpperCase() +poste.substring(1));
}


/** 
 * Place un joueur sélectionné par un click sur la bonne ligne
 * dans une <div> de class "positions" avec un id de la forme "p-xxxxx"
 */
const placeJoueur = () => {
    const poste = joueurChoisi.classList[1] // le poste correspond à la 2ème classe;
    const ligne = trouveLigne(poste);
    const emplacementLibre = trouveEmplacement(ligne)
    if (emplacementLibre){
        // ajoute le nom du joueur et appelle la fonction permettant de mettre à jour la 
        // feuille de match
        const nom = joueurChoisi.querySelector(".nom").textContent;
        emplacementLibre.title = nom;
        ajouteJoueurListe(nom, joueurChoisi.id);

        // TODO modifier l'image de l'emplacement Libre
        const player = playersData.find(player => player.id === parseInt(joueurChoisi.id.substring(2)));
        emplacementLibre.style.backgroundImage = `url(${player.src})`;
        emplacementLibre.title = player.nom;

        // TODO modifier l'id 
        emplacementLibre.id = `p-${player.id}`;

        // TODO Empecher le click dans la zone joueur, et autorise celui dans la zone terrain
        // pour le joueur choisi 
        emplacementLibre.addEventListener("click", deselectionneCompo);
        joueurChoisi.removeEventListener("click", selectionneJoueur)

        // mise à jour des effectifs de la table )
        miseAJourNeffectifs(poste, true);
        changeImageComplete(verifCompoComplete());
    }
    else     
        joueurChoisi.style.opacity = "1";
}


/** 
 * Enléve du terrain le joueur sélectionné par un click
*/
const deselectionneCompo = function(){
    const poste = this.classList[1];
    const idJoueur = "j-" + this.id.substring(2);
    const joueur = document.getElementById(idJoueur);
    joueur.style.opacity="";
    joueur.addEventListener('click', selectionneJoueur);
    enleveJoueurFeuilleMatch(this.title);
    this.removeEventListener("click", deselectionneCompo);
    this.title="";
    this.style="";
    this.id="";
    // enleveJoueurFeuilleMatch();
    miseAJourNeffectifs(poste, false);
    changeImageComplete(verifCompoComplete());
}

/*************************************************************
           ===Mise à jour des effectifs=== 
************************************************************/

/**
 * Met à jour les effectifs dans le tableau lorsqu'un joueur est ajouté 
 * ou retiré du terrain.
 * Après chaque modification, une vérification de la composition compléte
 * doit être effectuée et le changement d'image de la feuille de match
 * doit être éventuellement réalisé.
 * @param {String} poste - poste du joueur
 * @param {Boolean} plus - true si le joueur est ajouté, false s'il est retiré
 */
const miseAJourNeffectifs = function(poste, plus){
    const numberPoste = Object.values(document.getElementsByTagName("td")).filter(ligne => ligne.className === poste)[0];
    numberPoste.textContent = plus ? 
        parseInt(numberPoste.textContent) + 1 
        : parseInt(numberPoste.textContent) - 1; 
}


/**
 * Verifie si l'effectif est complet.
 * L'image de la feuille de match est changée en conséquence.
 * @returns {Boolean} - true si l'effectif est au complet, false sinon
 */
const verifCompoComplete = () => {
    const idsLigne = ["ligneGardien", "ligneDefenseur", "ligneMilieu", "ligneAttaquant"];
    return idsLigne.some(ligne => trouveEmplacement(document.getElementById(ligne)) !== null)
}

/*************************************************************
           ===Mise à jour de la feuille de match=== 
************************************************************/

/**
 * Modifie l'image de la feuille de match
 * en fonction de la taille de l'effectif
 * @param {Boolean} complet - true si l'effectif est complet, false sinon
 */
const changeImageComplete = function(complet){
    document.getElementById("check").src = complet ?
        "images/notok.png"
        : "images/check.png";
}


/**
 * Enleve un joueur de la feuille de match
 * @param {String} nom - nom du joueur à retirer
 */
const enleveJoueurFeuilleMatch = (nom) => {
    const players = document.getElementById("feuilleDeMatch").getElementsByTagName("li");
    Object.values(players).find(player => player.textContent === nom).remove();
}


/**
 * ajoute un joueur à la feuille de match dans un élément
 * <li> avec un id de la forme "f-xxxxx"
 * @param {String} nom - nom du joueur
 * @param {String} id - id du joueur ajouté au terrain de la forme "p-xxxxx"
 */
const ajouteJoueurListe = function(nom, id){
    const liste = document.getElementById('feuilleDeMatch').querySelector('ul');
    const li = document.createElement('li');
    li.textContent = nom;
    li.id =  "f-"+id.substring(2)
    liste.appendChild(li)
}


/*************************************************************
           ===Initialisation de la page=== 
************************************************************/

init();