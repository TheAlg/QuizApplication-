function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

$(document).ready(function() {
    var questionsAndResults = [];
    var hasSentAnswers = false;
    $(".questions").each(function(index) {
        questionsAndResults[index] = {
            question: $(this).text(),
            answer: ""
        }
     })
     $(".disapearingAnswer").each(function(index) {
        questionsAndResults[index].answer = $(this).text();
     })
     $("#disapearingDiv").remove()
    $(".questions").first().attr("id", "selected");
    $(".questions").first().css({"background-color": "aquamarine"});

    $(".questions").click(function() {
          $("#selected").removeAttr("style");
          $("#selected").removeAttr("id");
          $(this).attr("id", "selected");   
          $(this).css({"background-color": "aquamarine"});  
    });

    $("#divReponses").on("click", ".answers", function() {
        if(hasSentAnswers === false) {
            if (!$('#selected').next().is(':empty')){
                var toreplace = $("#selected").next().html();
                $("#divReponses").append(toreplace);
            } 
            $("#selected").next().html(this); 
            $("#selected").removeAttr("style"); 
            $("#selected").removeAttr("id");
            $('table').find('td:empty:first').prev().attr("id", "selected");
            $('table').find('td:empty:first').prev().css({"background-color": "aquamarine"}); 
        }     
    });

    $(".tdAnswers").click(function() {
        if(hasSentAnswers === false) {
            if($(this).find('button').length !== 0) {
                $("#divReponses").append($(this).html());
                $(this).html("");
            }
        }
    })

    $("#checkAnswers").click(function() {
        hasSentAnswers = true;
        var totalGoodAnswers = 0;
        $(".tdAnswers").each(function(index) {
            if($(this).find('img').attr("src") !== undefined) {
                if($(this).find('img').attr("src") == questionsAndResults[index].answer) {
                    $(this).css({"background-color": "green"});
                    totalGoodAnswers += 1;
                } else {
                    let image = "Faux : <img src=" + questionsAndResults[index].answer + ">";
                    $(this).css({"background-color": "red"});
                    $(this).append(image);
                }
            } else if ($(this).find("audio").attr("src") !== undefined) {
                if ($(this).find("audio").attr("src") == questionsAndResults[index].answer) {
                    $(this).css({"background-color": "green"});
                    totalGoodAnswers += 1;
                } else {
                    let audio = "<audio controls src=" + questionsAndResults[index].answer + "></audio>";
                    $(this).css({"background-color": "red"});
                    $(this).append(audio);
                }
            } else {
                console.log($(this).text());
                console.log(questionsAndResults[index].answer);
                if($(this).text() == questionsAndResults[index].answer) {
                    $(this).css({"background-color": "green"});
                    totalGoodAnswers += 1;
                } else {
                    if(questionsAndResults[index].answer.startsWith("/image")) {
                        let image = "Faux : <img src=" + questionsAndResults[index].answer + ">";
                        $(this).css({"background-color": "red"});
                        $(this).append(image);
                    } else if (questionsAndResults[index].answer.startsWith("/audio")) {
                        let audio = "<audio controls src=" + questionsAndResults[index].answer + "></audio>";
                        $(this).css({"background-color": "red"});
                        $(this).append(audio);
                    } else {
                        var text = "<p> Faux : " + questionsAndResults[index].answer + "</p>";
                        $(this).css({"background-color": "red"});
                        $(this).append(text);
                    }
                } 
            }                       
        }); 
        $("body").append("<h3>Score " + totalGoodAnswers + " / " + questionsAndResults.length +  "</h3>");  
        $("#checkAnswers").remove();
        $("#titleAnswers").remove();   
    });
});

if(error=='Quiz name exists!') {
    $.ajax(alert('Quiz name exists!'));
}