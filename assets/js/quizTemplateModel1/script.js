const playedQuestions =[] //question déjà passé
const historique = []; //stocker les sections avec questions/réponses
const timeCounter= 15; //compte à rebours
const totalQuestions= 9;

const DOMElements = {
    start_btn:'.start_btn',
    next_btn:'.next_btn',
    timer:'.timer',
    timeLine: '.header .time_line',
    timeTxt: '.timer .time_left_txt',
    timeCount: '.timer_sec',
    info_box: '.info_box',
    quiz_box: '.quiz_box',
    result_box:'.result_box',
    continue_btn: '.continue_btn',
    option_list:'.option_list',
    options:'.option',
    timeLine:'.time_line',
    question_counter:'.total_que',
    score_text:'.score_text',
    result_btn:'.result_btn',
    exit_btn:'.exit_btn',

    //classe de visibilités
    result_btn_show :'show',
    next_btn_show :'show',
    info_box_show :'activeInfo',
    quiz_box_show:'activeQuiz',
    result_box_show:'activeResult',
}
const html = (function() {
    const correctTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
    const incorrectTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
    return {
            showScore(total){
                switch(total){

                case (total.score == 0):
                    scoreTag='<span> Dommage, aucune de vos réponses n\'est correcte 😭</span>'
                case(total.score<33) :
                    scoreTag='<span> Vous avez eu un score de  <p>'+total.score +'%  </p>😐 </br> Votre temps de réponse moyen est : '+total.timing +'secondes </span>'
                case (total.score>33 && total.score <67):
                    scoreTag='<span>C\'est génial, Vous avez eu un score de <p>' + total.score+' %</p>🎉</br> Votre temps de réponse moyen est : '+total.timing +'secondes </span>'      
                case (total.score>67):
                    scoreTag='<span>C\'est excellent, Vous avez eu un score de <p>' + total.score+' %</p>😎</p></br> Votre temps de réponse moyen est : '+total.timing +'secondes </span>'
                default:
                    scoreTag= '<span> Votre score est : '+ total.score +'%</span> </br> <span> Votre timing moyen est : '+ total.timing+' secondes </span>' ;
                }
                    document.querySelector(DOMElements.score_text).innerHTML = scoreTag;
            },
            showQuetions(options){
                for(i=0; i < options.length; i++){
                    let option_tag = '<div class="option">'+options[i].answer+'</div>';
                    document.querySelector(DOMElements.option_list).innerHTML+= option_tag;
                }
                //hide  buttons
                html.hideClass(DOMElements.result_btn); 
                html.hideClass(DOMElements.next_btn);
            },
            showTimeStart(){
                document.querySelector(DOMElements.timeTxt).textContent = "Time Left"
                let timeCount = '<div class="timer_sec">'+timeCounter+'</div>'; //valeur initiale
                if(DOMElements.timeCount !== null){
                    document.querySelector(DOMElements.timeCount).remove(); 
                    document.querySelector(DOMElements.timer).innerHTML+= timeCount;
                }
                else {
                    document.querySelector(DOMElements.timer).innerHTML+= timeCount;
                }
            },
            showTimeValue(timeVal) {
                document.querySelector(DOMElements.timeCount).textContent = timeVal.toString(); 
            },
            showTimeLine(timeLineVal) {
                //timeLine
                if (timeLineVal < 100){
                    document.querySelector(DOMElements.timeLine).style.width = timeLineVal + "%";
                }
            },
            showTimeStop(){ 
                document.querySelector(DOMElements.timeTxt).textContent = "Time's up!"
                document.querySelector(DOMElements.timeCount).remove();
                document.querySelector(DOMElements.timer).style.justifyContent = "center";
            },
            showCorrectAnswer(div){   
                this.disableAll(div);
                if (! div.classList.contains("correct")) {      
                    div.classList.add("correct");
                    div.insertAdjacentHTML("beforeend", correctTag); 
                }
            },
            showWrongAnswer(div){
                this.disableAll(div);
                if (! div.classList.contains("incorrect")) {      
                    div.classList.add("incorrect"); 
                    div.insertAdjacentHTML("beforeend", incorrectTag); 
                }
            },
            disableAll(element){
                if (!element.classList.contains("disabled")){
                    element.classList.add("disabled");          
                }
            },
            removeQuetions(array){
                let parentDiv = document.querySelector(array);
                if (parentDiv!== undefined){
                    var child = parentDiv.firstChild;
                    while (child) {
                        parentDiv.removeChild(child);
                        child = parentDiv.lastChild
                    }
                }
            },
            showQuestionCount(current){
                let total = '<span><p>'+ current +'</p> of <p>'+ totalQuestions +'</p> Questions</span>';
                DOMElements.question_counter.innerHTML=total; 
            },
            showClass(className){
                let showClass = DOMElements[className.replace('.', '')+'_show'];
                if (!document.querySelector(className).classList.contains(showClass)){
                    document.querySelector(className).classList.add(showClass)
                }
            },
            hideClass(className){
                let showClass = DOMElements[className.replace('.', '')+'_show'];
                if (document.querySelector(className).classList.contains(showClass)){
                    document.querySelector(className).classList.remove(showClass)
                }
            },
            reset(){
                html.hideClass(DOMElements.result_box); //retirer result box if exists
                html.hideClass(DOMElements.result_btn);
                html.removeQuetions(DOMElements.option_list); //retirer les questions if exists
            }
        }
})();
const main = (function(html){
    //-----------------------------------//
    var counter; //compteur de secondes
    var counterLine; //compteur ligne de secondes
    var startDate; //moment du lancement de la question
    //-----------------------------------//
    var textOptions; //options
    var correcAnswer; //réponse correcte
    var userAnswer; //réponse de l'utilisateur
    var audioObj;


    async function shuffle_4 (array) {
        let questions= [];
        if (array.length>12){
            while (questions.length < 4) {
                random = array[Math.floor(Math.random()* array.length)];
                if (!questions.includes(random)&& !playedQuestions.includes(random)) {
                    questions.push(random);
                }
            } 
        return questions;
        }
        else {
            alert('un minimum de 12 questions/réponses est requis pour ce type de teste, la liste actuelle contiennent seulement ' + array.length + 'questions !')
            window.location.href = "/";
        }
    }

    async function select(array) {
        random = array[Math.floor(Math.random()* array.length)];
        playedQuestions.push(random) //stocker dans un tableau pour ne pas passer 2 fois
        correcAnswer = random.answer; //stocker dans une variable pour réutiliser
        //stocker la section question dans un json
        historique.push(section={ 
            'rightAnswer':random.answer,
            'options':array,
        });
        return random
    }
    start = async (secondes)=>{
        if (counter === undefined){ //pour faire executer la fonction une seule fois (car en cliquant sur espace pendant le texte fait executer la fonction plusieurs fois)
            textOptions =await shuffle_4(data);  //json data envoyé par le controlleur
            html.showQuetions(textOptions); //afficher les questions
            audioAnswer =await select(textOptions);
            console.log('la réponse correcte est : ' + audioAnswer.answer)
            this.audioQuestionPlay(audioAnswer); //jouer l'audio
            this.startTimer(secondes);//chrono
            startDate = Date.now(); //temps de réponse
            this.startQuestionsCount();
        }
        else {//juste affichage
            html.showQuetions(historique[historique.length-1].options)
        }
    }
    startQuestionsCount=()=> {
        let current = playedQuestions.length //question actuelle
        html.showQuestionCount(current);
    }
    startTimer=async (secondes)=> {
        var timeVal = secondes;
        var timeLineVal= 0;
        html.showTimeStart();
        //compte à rebours
        counter = setInterval(time, 1000); //secondes
        async function time() {
            timeVal--;
            html.showTimeValue(timeVal); //affichage
            if (timeVal <= 0){
                html.showTimeStop(); //affichage 
            }
        }
        counterLine = setInterval(timeline, 10); //timeLine
        async function timeline() {
            timeLineVal += 1/secondes;
            html.showTimeLine(timeLineVal); //affichage
            if (timeLineVal > 100){
                this.timeStop();
            }
        }
    }
    optionSelected = async (answer) => {   
        userAnswer = answer.textContent
        if(userAnswer == correcAnswer){ 
            html.showCorrectAnswer(answer)
        }else{
            html.showWrongAnswer(answer);
            let options = document.querySelector(DOMElements.option_list).children
            for(i=0; i < options.length; i++){
                if(options[i].textContent == correcAnswer){ 
                    html.showCorrectAnswer(options[i]);
                }
            }
        }
        this.timeStop();
        return answer.textContent;
    }
    scoreCount=()=> {
        score = 0 ;
        timing = 0 ;
        for (let i=0; i<historique.length;i++){
            if (historique[i].UserAnswer === historique[i].rightAnswer){
                //perfection serait à une réponse de 1.5s
                score+=1
                timing+= historique[i].answerTime;
            }
        }
        //peut étre renvoyer le résultat au backend ?
        html.showScore(total ={
            'score': ((score/historique.length)*100).toFixed(0),
            'timing': ((timing/score)/1000).toFixed(3),
        });
        // vider les liste au moment de caclule du score
        historique.splice(0, historique.length) 
        playedQuestions.splice(0, playedQuestions.length) 
    }
    timeStop= async () =>{
        clearInterval(counter);
        clearInterval(counterLine); 
        audioQuestionPause();
        counter = undefined;

        let options = document.querySelector(DOMElements.option_list).children;

        for(i=0; i < options.length; i++){
            html.disableAll(options[i]) //desactiver les réponses
            if(options[i].textContent == correcAnswer){ 
                html.showCorrectAnswer(options[i]); //aficher la réponse correcte
            }
        }
        //stocker ces nouvelles valeurs dans la liste historique
        historique[historique.length-1].answerTime = Date.now() - startDate;
        historique[historique.length-1].UserAnswer = userAnswer;

        this.nextButton();
    }
    nextButton =()=> {
    let current = playedQuestions.length //position de la question actuelle
    if (current < totalQuestions) 
        {html.showClass(DOMElements.next_btn);}//afficherle boutton 'prochaine question'
        else 
        {html.showClass(DOMElements.result_btn);}//afficher boutton pour afficher les réultats
    }

    audioQuestionPlay = async (selected) => {
        audioObj = new Audio(await selected.question)
        audioObj.play();
    }
    audioQuestionPause = () => {
    if (audioObj !== null){
        audioObj.pause();
        }
    }
   return {
       start(secondes){
           return start(secondes)
       },
       optionSelected(answer) {
           return optionSelected(answer);
       },
       reset(){
           return reset();
       },
       scoreCount(){
           return scoreCount();
       }
   }           

})(html);

const APPController = (function(html, main) {
    
    document.addEventListener('click',async (e)=>{
    if (e.target) {
        //boutton start
        if(e.target.matches(DOMElements.start_btn)) {
            html.showClass(DOMElements.info_box); //afficher la barre d'infos
            html.hideClass(DOMElements.next_btn); //retirer le boutton continuer
        }
        //boutton prochaine question ou continuer
        else if(e.target.matches(DOMElements.continue_btn) 
                || e.target.matches(DOMElements.next_btn)){
            html.hideClass(DOMElements.info_box); //cacher la box infos
            html.reset();
            html.showClass(DOMElements.quiz_box); //afficher le quiz
            main.start(timeCounter); //chrono + questions + audi
        }       
        //boutton afficher resultat
        else if(e.target.matches(DOMElements.result_btn)) {
            html.showClass(DOMElements.result_box);
            html.hideClass(DOMElements.quiz_box);
            main.scoreCount();
        }

        //boutton option selectionnée
        else if(e.target.matches(DOMElements.options)){
            main.optionSelected(e.target);
        }

        //exit button
        else if(e.target.matches(DOMElements.exit_btn)){
            html.hideClass(DOMElements.quiz_box)
            html.hideClass(DOMElements.info_box)
            html.hideClass(DOMElements.result_box)
        }
    }

    });

})(html, main);
