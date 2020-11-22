var quiz_card_prefab;
var quizData;
var quizLength;
var answers = [];
var attribute = [];

// return JSON data from any file path (asynchronous)
async function getJSON(path) {
    let json = await fetch(path).then(response => response.json());
    createJSObject(json);
}

function createJSObject(json) {
    quizData = json.quiz;
    quizLength = json.quiz.length;
    console.log(quizData[0].question);
    console.log(quizLength);
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

            // defining varibles to eaily acces ditionary and populate the clone card
            let questionHeader = quizData[i].question;
            let questionAttr = quizData[i].attribute;
            let questionRes = quizData[i].responses;
            var secretValA = questionRes[0].value;
            var secretValB = questionRes[1].value;
            var secretValC = questionRes[2].value;
            var secretValD = questionRes[3].value;

            // need to optimize : inputs text from dictionary into button id in cloned element
            $(quiz_card).find("#button_1").text(questionRes[0].text).addClass(`question${i}`).attr('value', secretValA);
            $(quiz_card).find("#button_2").text(questionRes[1].text).addClass(`question${i}`).attr('value', secretValB);
            $(quiz_card).find("#button_3").text(questionRes[2].text).addClass(`question${i}`).attr('value', secretValC);
            $(quiz_card).find("#button_4").text(questionRes[3].text).addClass(`question${i}`).attr('value', secretValD);


            // populates card clone with the question header from dictionary
            $(quiz_card).find("#cardQuestion").text(questionHeader);
            $(quiz_card).find("#cardAtrr").text(questionAttr);
            // at the end of each for loop create new cloned element with varibles from dictionary
            document.body.appendChild(quiz_card);
        }
    })
})

function buttonClick(obj, btnNum) {
    var buttonPressed = btnNum;
    var btnClass = obj.className;
    var num = btnClass.match(/\d/g);
    var btnVal = obj.value;
    num = parseInt(num.join(''));

    answers[num] = btnVal;

    console.log(answers)
    console.log(num);
}
