var quiz_card_prefab;
var quizData;
var quizLength;
var answers = {};
var data;

// return JSON data from any file path (asynchronous)
async function getJSON(path) {
    let json = await fetch(path).then(response => response.json());
    createJSObject(json);
}

function createJSObject(json) {
    quizData = json.quiz;
    quizLength = json.quiz.length;
}

getJSON("https://raw.githubusercontent.com/anchoragewonder/championQuiz/main/quiz.json").then(data => {
    console.log("Success");
})

$(document).ready(function () {
    quiz_card_prefab = document.getElementById('quiz_card').cloneNode(true);

    var parent = document.getElementById('quiz_start');
    parent.innerHTML = '';

    $(".btn").click(function () {
        var startButton = document.getElementById('start_btn');
        startButton.innerHTML = '';

        for (let i = 0; i < quizLength; i++) {
            const quiz_card = quiz_card_prefab.cloneNode(true);

            // defining varibles to easily acces ditionary and populate the clone card
            const questionHeader = quizData[i].question;
            const questionAttr = quizData[i].attribute;
            const questionRes = quizData[i].responses;
            const secretValA = questionRes[0].value;
            const secretValB = questionRes[1].value;
            const secretValC = questionRes[2].value;
            const secretValD = questionRes[3].value;

            // need to optimize : inputs text from dictionary into button id in cloned element
            $(quiz_card).find("#button_1").text(questionRes[0].text).addClass(`question${i}`).attr('value', secretValA);
            $(quiz_card).find("#button_2").text(questionRes[1].text).addClass(`question${i}`).attr('value', secretValB);
            $(quiz_card).find("#button_3").text(questionRes[2].text).addClass(`question${i}`).attr('value', secretValC);
            $(quiz_card).find("#button_4").text(questionRes[3].text).addClass(`question${i}`).attr('value', secretValD);

            // populates card clone with the question header from dictionary
            $(quiz_card).find("#cardQuestion").text(questionHeader);
            $(quiz_card).find("#cardAttr").text(questionAttr);

            // at the end of each for loop create new cloned element with varibles from dictionary --above the submit button
            $(quiz_card).insertBefore("div.submitBtn");
        }
        $(".submitBtn").removeClass("hidden");
    })
})

// on click function to send quiz answers as a post request to League API -- also Clear the DOM of quiz questions-- then run simchampimgs function
$(".submit").click(function () {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status == 200) {
            data = JSON.parse(this.responseText);
            console.log(data)

            $("div.quizContainer").remove();

            similarChampImgs();

            $(".submitBtn").addClass("hidden");
            document.documentElement.scrollTop = 0;
        }
    };
    xhr.open('POST', 'https://kauhny1enj.execute-api.us-east-1.amazonaws.com/Prod/quizpost', true);
    xhr.send(JSON.stringify(answers));
});

// Refresh page to restart quiz
$(".reload").click(function () {
    location.reload();
})

function buttonClick(obj) {
    let btnVal = obj.value;
    let attributeName = $(obj).closest(".quizContainer").find("#cardAttr").text();
    answers[attributeName] = btnVal;

    $(obj).closest(".quizContainer").css("opacity", ".6");

    console.log(attributeName);
    console.log(answers);
}

function similarChampImgs() {
    const champUrl = "https://na.leagueoflegends.com/en-us/champions/";
    const imgURL = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";

    // first champ in the list with highest number of matching answers to quiz.  
    const firstChamp = data.Champions[0];

    // skin randomizes everytime you pick champions - max 2 skins so far because of variety in champ skin numers some have 3 other 10 and some are non sequential ie pyke 0,1,8,16,25
    const skinNum = Math.round(Math.random());

    // index of other champs to  stop at  display 4 =  index 1-3
    const displayNum = 4;
    const champCard = document.getElementById("championCard");

    //conditional statement for odd champion names - (other names) - Aurelion sol, Nunu & Willump, Dr.Mundo, Jarvan IV, Kai'sa, Kha'zix, Kog'maw, Rek'sai, Vel'Koz, Xin Zhao- 
    if (firstChamp.altName) {
        const imgName = capitalizeFirstLetter(firstChamp.name);
        console.log(firstChamp.altName)
        $(champCard).find("#firstChampUrl").prop('href', champUrl + firstChamp.altName);
        $(champCard).find(".cardChamp").prop('src', imgURL + imgName.replace(/\s/g, '') + '_' + skinNum + '.jpg');
    }
    else {
        const hrefName = firstChamp.name.replace(/\s/g, '-');
        $(champCard).find("#firstChampUrl").prop('href', champUrl + hrefName.toLowerCase());
        $(champCard).find(".cardChamp").prop('src', imgURL + firstChamp.name.replace(/\s/g, '') + '_' + skinNum + '.jpg');
    }

    // populating the data of the Card element
    $(champCard).removeClass("hidden");
    $(champCard).find("#firstChampUrl").prop('title', firstChamp.name);
    $(champCard).find(".champName").text(firstChamp.name);
    $(champCard).find(".champType").text(firstChamp.class);
    $(champCard).find("#damage").text(firstChamp.damage);
    $(champCard).find("#difficulty").text(firstChamp.difficulty);
    $(champCard).find("#crowdControl").text(firstChamp.crowdControl);
    $(champCard).find("#mobility").text(firstChamp.mobility);
    $(champCard).find("#defense").text(firstChamp.defense);

    for (i = 1; i < displayNum; i++) {
        const otherChamps = data.Champions[i]
        const champName = otherChamps.name;

        if (otherChamps.altName) {
            const imgAltName = capitalizeFirstLetter(champName);
            $("#champ" + i + "Url").prop('href', champUrl + otherChamps.altName);
            $("#champ" + i + "Img").prop('src', imgURL + imgAltName.replace(/\s/g, '') + '_' + skinNum + '.jpg');
        }
        else {
            const hrefAltName = champName.replace(/\s/g, '-');
            $("#champ" + i + "Url").prop('href', champUrl + hrefAltName.toLowerCase());
            $("#champ" + i + "Url").prop('title', champName);
            $("#champ" + i + "Img").prop('src', imgURL + champName.replace(/\s/g, '') + '_' + skinNum + '.jpg');
            $("#champ" + i + "Text").text(champName);
        }
    }
}

function capitalizeFirstLetter(string) {
    const lower = string.charAt(0).toUpperCase() + string.slice(1);
    console.log(lower);
    return lower;
}