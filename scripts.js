var quiz_card_prefab;
var quizData;
var quizLength;
var answers = {};
var data;
var url = "https://kauhny1enj.execute-api.us-east-1.amazonaws.com/Prod/quizpost"

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
            let quiz_card = quiz_card_prefab.cloneNode(true);

            // defining varibles to easily acces ditionary and populate the clone card
            let questionHeader = quizData[i].question;
            let questionAttr = quizData[i].attribute;
            let questionRes = quizData[i].responses;
            let secretValA = questionRes[0].value;
            let secretValB = questionRes[1].value;
            let secretValC = questionRes[2].value;
            let secretValD = questionRes[3].value;

            // need to optimize : inputs text from dictionary into button id in cloned element
            $(quiz_card).find("#button_1").text(questionRes[0].text).addClass(`question${i}`).attr('value', secretValA);
            $(quiz_card).find("#button_2").text(questionRes[1].text).addClass(`question${i}`).attr('value', secretValB);
            $(quiz_card).find("#button_3").text(questionRes[2].text).addClass(`question${i}`).attr('value', secretValC);
            $(quiz_card).find("#button_4").text(questionRes[3].text).addClass(`question${i}`).attr('value', secretValD);

            // populates card clone with the question header from dictionary
            $(quiz_card).find("#cardQuestion").text(questionHeader);
            $(quiz_card).find("#cardAttr").text(questionAttr);

            // at the end of each for loop create new cloned element with varibles from dictionary
            $(quiz_card).insertBefore("div.submitBtn");
        }
        $(".submitBtn").removeClass("hidden");
    })
})

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
    const firstChamp = data.Champions[0];
    // skin randomizes everytime you pick champions 
    let skinNum = Math.floor(Math.random() * 3);
    // index of other champs to  stop at  display 4 =  index 1-3
    let displayNum = 4;
    let champCard = document.getElementById("championCard");

    //conditional statement for odd champion names - (other names) - Aurelion sol, Nunu & Willump, ect - probably do a case switch
    if (firstChamp.name == "Cho Gath") {
        let chogathName = "Cho-gath";
        $(champCard).find("#firstChampUrl").prop('href', champUrl + chogathName.toLocaleLowerCase());
        capitalizeFirstLetter(firstChamp.name); // necesarry to get img 
    }
    else {
        $(champCard).find("#firstChampUrl").prop('href', champUrl + firstChamp.name.toLowerCase());
    }

    $(champCard).removeClass("hidden");
    $(champCard).find("#firstChampUrl").prop('title', firstChamp.name);
    $(champCard).find(".cardChamp").prop('src', imgURL + firstChamp.name.replace(/\s/g, '') + '_' + skinNum + '.jpg');
    $(champCard).find(".champName").text(firstChamp.name);
    $(champCard).find(".champType").text(firstChamp.class);
    $(champCard).find("#damage").text(firstChamp.damage);
    $(champCard).find("#difficulty").text(firstChamp.difficulty);
    $(champCard).find("#crowdControl").text(firstChamp.crowdControl);
    $(champCard).find("#mobility").text(firstChamp.mobility);
    $(champCard).find("#defense").text(firstChamp.defense);

    for (i = 1; i < displayNum; i++) {
        let champName = data.Champions[i].name

        $("#champ" + i + "Url").prop('href', champUrl + champName.toLowerCase());
        $("#champ" + i + "Url").prop('title', champName);
        $("#champ" + i + "Img").prop('src', imgURL + champName.replace(/\s/g, '') + '_' + skinNum + '.jpg');
        $("#champ" + i + "Text").text(champName);
    }
}

function capitalizeFirstLetter(string) {
    let lower = string.charAt(0).toUpperCase() + string.slice(1);
    console.log(lower);
    return lower
}