var theQuestions = [
    {
        question:"How many members were there in the Fellowship of the Ring?",
        options: [
            "9",
            "12",
            "7",
            "11",
        ],
        correctOption: "9"
    },
    {
        question:'Who said, "Nine companions. So be it. You shall be the fellowship of the ring,"?',
        options: [
            "Elrond",
            "Gandalf",
            "Aragorn",
            "Gimli",
        ],
        correctOption: "Elrond"
    },
    {
        question:"What does Aragorn name Narsil, the sword that was broken, after it is reforged?",
        options: [
            "Andúril",
            "Orcrist",
            "Glamdring",
            "Herugrim",
        ],
        correctOption: "Andúril"
    },
    {
        question:"At the parting feast, what gift does Galadriel give Gimli?",
        options: [
            "Three strands of hair",
            "A Galadhrim bow",
            "The Phial of Galadriel",
            "A Golden Belt",
        ],
        correctOption: "Three strands of hair"
    },
    {
        question:"What comes next in a Hobbit's meal schedule? Breakfast, Second Breakfast, __________?",
        options: [
            "Elevensies",
            "Luncheon",
            "Afternoon Tea",
            "Supper",
        ],
        correctOption: "Elevensies"
    },
    {
        question:"When did The Third Age begin in Middle-earth?",
        options: [
            "After the Ring is cut from Sauron's finger",
            "After Frodo destroys the Ring in Mount Doom",
            "After Morgoth is defeated by the Valar and some Elves and Men",
            "After the dawn of time, a period of myth and legend",
        ],
        correctOption: "After the Ring is cut from Sauron's finger"
    }
];

var questionPointer = 0;
var i = 105;
var highScores = [];

getLocalStorage();

$(document).ready(function() {
    startScreen();
});

function startScreen() {
    $("#topContent").html("<h1>Lord of the Rings Quiz</h1>");
    
    $("#middleContent").html("<button type='button' class='btn btn-info' id='viewHighscoresBtn'>View Highscores!</button><button type='button' class='btn btn-primary' id='playGameBtn'>Play Game</button>");
    
    $("#viewHighscoresBtn").on("click", function() {
        highscorePage();
    });

    $("#playGameBtn").on("click", function() {
        setTimer();
    });
}

function setTimer() {
    var theTimer = setInterval(function () {
        $("#timer").text("Time Left: " + i);
        i--;
        if(i < 0) {
            clearInterval(theTimer);
            gameOver();
        }
    }, 1000);
    clearContent();
    playGame(theTimer);
}

function playGame(theTimer) {
    if(questionPointer > theQuestions.length-1 || i < 0) {
        clearInterval(theTimer);
        gameOver();
        return;
    }
    
    answerRandomizer();
    questionDisplay();
    
    $(".userChoice").on("click", function() {
        if ($(this).text() === theQuestions[questionPointer].correctOption) {
            clearContent();
            $("#bottomContent").html("<h1 style='color: green'>Correct!</h1>");
            questionPointer++;
            playGame(theTimer);
        }
        else {
            clearContent();
            $("#bottomContent").html("<h1 style='color: red'>Wrong</h1>")
            i += -15;
            questionPointer++;
            playGame(theTimer);
        }
    });
}

function questionDisplay() {

    var tmp = "";
    $("#topContent").html("<h3>" + theQuestions[questionPointer].question + "</h3>");

    for(var x = 0; x < 4; x++) {
        tmp += "<button type='button' class='btn btn-danger userChoice'>" + theQuestions[questionPointer].options[x] + "</button><br>";
    }
    $("#middleContent").html(tmp);
    return;
}

function gameOver() {
    clearContent();
    if(i<0){i=0;}
    $("#timer").text("Time Left: " + i);
    $("#topContent").html("<h1>Game Over!</h1>")
    var tmp = "<br><h2>Your score: " + i + "</h2><br>"; //only using tmp for readability's sake
    tmp += "<label for='usrInput'> Enter a Username to Submit Your Score:</label>";
    tmp += "<input type='text' class='form-control' id='usrInput' maxlength='10' style='margin: 0 auto; margin-bottom: 20px; width:300px;'>";
    tmp += "<button type='button' class='btn btn-info' id='submitHighscore'>Submit Score!</button>";
    tmp += "<button type='button' class='btn btn-primary' id='playAgain'>Play Again</button>";
    $("#middleContent").html(tmp);
    $("#playAgain").on("click", function() {
        playAgain();
    });
    $("#submitHighscore").on("click", function() {
        if($('#usrInput').val() === ""){return;}
        var spaceTest = /\s/g.test($('#usrInput').val());
        if(spaceTest === true) {
            $("#bottomContent").html("<h1 style='color: red;margin-top: 20px;'>Please do not enter any spaces :)</h1>");
        }
        else {
            var usrName = $('#usrInput').val();
            var usrScore = i;
            highscorePage(usrName, usrScore);
        }
    });
    $("#usrInput").keypress(function (e) {
        if(e.which == 13) {
            $("#submitHighscore").click();
         }
    });
}

function highscorePage(usrName, usrScore) {
    clearContent();
    if(typeof usrScore !== 'undefined') {
        highScores.push({Name: usrName, Score: usrScore});
        scoreSorter();
        storeScores();
        usrScore = 'undefined';
    }

    $("#topContent").html("<h1>Highscores:</h1>");
    
    var tmp = "<ul class='list-group text-center' style='display:block;margin: 0 auto;max-width:300px;'>";
    for (var x = 0; x < highScores.length; x++) {
        if (x % 2 == 0) {
            tmp += "<li class='list-group-item'><div style='text-align:left'>" + highScores[x].Name + "<span style='float:right'>"+ highScores[x].Score + "</span></div></li>";
        }else{
            tmp += "<li class='list-group-item list-group-item-success'><div style='text-align:left'>" + highScores[x].Name + "<span style='float:right'>"+ highScores[x].Score + "</span></div></li>";
        }
    }
    tmp += "</ul>";
    $("#middleContent").html(tmp);

    $("#bottomContent").html("<button type='button' class='btn btn-info' id='clearHighscores'>Clear</button><button type='button' class='btn btn-primary' id='backBtn'>Back</button>");
    
    $("#backBtn").on("click", function() {
        playAgain();
    });
    
    $("#clearHighscores").on("click", function() {
        clearScores();
        return;
    });
}

function clearScores() {
    highScores = [];
    storeScores();
    highscorePage();
}

function playAgain() {
    questionPointer = 0;
    i = 105;
    clearContent();
    startScreen();
}

function clearContent() {
    $("#topContent").html("");
    $("#middleContent").html("");
    $("#bottomContent").html("");
    return;
}

function getLocalStorage() {
    var storedScoresString = localStorage.getItem("scores");
    var storedScores = JSON.parse(storedScoresString);
    if (storedScores !== null) {
        highScores = storedScores;
    }
}

function storeScores() {
    var scoresString = JSON.stringify(highScores);
    localStorage.setItem("scores", scoresString);
}

function scoreSorter() {
    highScores.sort(function (a, b) {
        return b.Score - a.Score;
    });
}

function answerRandomizer() {
    var tmp = theQuestions[questionPointer].options;
    var tmpLength = tmp.length;
    for (var i = 0; i < tmpLength - 1; i++) {
        var tmpNum = Math.floor(Math.random()*tmp.length);
        tmp.push(theQuestions[questionPointer].options.splice(tmpNum,1)[0]);
    }
    theQuestions[questionPointer].options = tmp;
}