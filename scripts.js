var quiz_card_prefab;
var quizData;
var quizLength;
var answers = {};
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

getJSON("https://raw.githubusercontent.com/anchoragewonder/championQuiz/cloning_quiz/quiz.json").then(data => {
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
            var data = JSON.parse(this.responseText);
            console.log(data);

            $("div.quizContainer").remove();

            let champCard = document.getElementById("championCard");
            $(champCard).removeClass("hidden");
            $(champCard).find(".champName").text(data.name);
            $(champCard).find(".champType").text(data.class);
            $(champCard).find("#damage").text(data.damage);
            $(champCard).find("#difficulty").text(data.difficulty);
            $(champCard).find("#crowdControl").text(data.crowdControl);
            $(champCard).find("#mobility").text(data.mobility);
            $(champCard).find("#defense").text(data.defense);

            $(".submitBtn").addClass("hidden");
            document.documentElement.scrollTop = 0;
            // we get the returned data
        }
        // end of state change: it can be after some time (async)
    };

    xhr.open('POST', 'https://kauhny1enj.execute-api.us-east-1.amazonaws.com/Prod/quizpost', true);
    xhr.send(JSON.stringify(answers));
});

function buttonClick(obj) {
    let btnVal = obj.value;
    let attributeName = $(obj).closest(".quizContainer").find("#cardAttr").text();
    answers[attributeName] = btnVal;

    $(obj).closest(".quizContainer").css("opacity", ".6");

    console.log(attributeName);
    console.log(answers);

}

