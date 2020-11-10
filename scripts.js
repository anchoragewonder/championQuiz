


// return JSON data from any file path (asynchronous)
async function getJSON(path) {
    let json = await fetch(path).then(response => response.json());
    createJSObject(json);
}

function createJSObject(json) {

    dict = new Object();

    for (let i = 0; i < json.quiz.length; i++) {

        var quizTemplate = json.quiz[i];
        var quizQuestion = quizTemplate.question;
        var responses = quizTemplate.responses;
        var attribute = quizTemplate.quizTemplate

        if (!(quizQuestion in dict)) {
            dict[quizQuestion] = [];
        }

        if (!(responses in dict)) {
            dict[responses] = [];
        }

        if (!(attribute in dict)) {
            dict[attribute] = [];
        }
        dict[quizQuestion].push(quizTemplate);
        dict[responses].push(quizTemplate);
        dict[attribute].push(quizTemplate);
    }
    console.log(dict);
}

// need to fix cors policy to allow cross origin access I think
/*getJSON("https://kauhny1enj.execute-api.us-east-1.amazonaws.com/Stage/champion").then(data => {
    champList = data;
    console.log("Success")
})*/

// get local json of quiz function
getJSON()

$(document).ready(function () {
    quiz_card_prefab = document.getElementById('quiz_card').cloneNode(true);


})