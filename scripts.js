var quizQuestions;


// return JSON data from any file path (asynchronous)
async function getJSON(path) {
    let json = await fetch(path).then(response => response.json());
    createJSObject(json);
}

getJSON("https://kauhny1enj.execute-api.us-east-1.amazonaws.com/Stage/champion").then(data => {
    champList = data;
    console.log("Success")
})

$(document).ready(function () {
    quiz_card_prefab = document.getElementById('quiz_card')
})