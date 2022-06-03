/**
 * MusicController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Quiz = require("../models/Quiz");
const fs = require("fs");
const path = require("path");

function checkType(jsonObject) {
    let types = [];
    let qtype;
    let atype;
    if (jsonObject[0].question.search(/^\/image\//gi) == 0) {
        qtype = "image";
    } else if (jsonObject[0].question.search(/^\/audio\//gi) == 0) {
        qtype = "audio";
    } else {
        qtype = "text";
    }
    if (jsonObject[0].answer.search(/^\/image\//gi) == 0) {
        atype = "image";
    } else if (jsonObject[0].answer.search(/^\/audio\//gi) == 0) {
        atype = "audio";
    } else {
        atype = "text";
    }
    types.push(qtype);
    types.push(atype);
    return types;
}

function getQuizNameList() {
    url = __dirname;
    console.log("url: ", url);
    let quizNameList = [];
    fs.readdirSync(path.resolve(__dirname, '../../assets/quiz')).forEach(file => {
        let quizName = file.split('.')[0];
        if (quizName.length > 0) {
            console.log(quizName);
            quizNameList.push(quizName);
        }
    });
    return quizNameList;
}
function getSpotifyQuizNameList() {
    let quizNameListSpotify = [];
    fs.readdirSync(path.resolve(__dirname, '../../assets/quizSpotify')).forEach(file => {
        let quizName = file.split('.')[0];
        if (quizName.length > 0) {
            console.log(quizName);
            quizNameListSpotify.push(quizName);
        }
    });
    return quizNameListSpotify;
}
module.exports = {
    getLandingPage: async function (req, res) {
        console.log('QuizController getLandingPage');
        let quizNameList = getQuizNameList();
        let quizNameListSpotify = getSpotifyQuizNameList();
        return res.view('pages/landingPage', { 
            quizNameList: quizNameList,
            quizNameListSpotify: quizNameListSpotify
        });
    },

    getSpotifyApi: async function(req, res) {
        console.log('QuizController getSpotifyApi');
        let quizNameListSpotify = getSpotifyQuizNameList();
        return res.view('pages/spotifyApi', { 
            quizNameListSpotify: quizNameListSpotify
        });
    },

    getChooseTpye: async function (req, res) {
        console.log('QuizController getChooseTpye');
        return res.view('pages/createQuizChooseType', { 
            error: ''
        });
    },

    getQuizListAll: async function (req, res) {
        console.log('QuizController getQuizListAll');
        let quizName = req.param('quizName'); // use sails function
        console.log(quizName);
        Quiz.getQuiz(quizName).then(quiz => {
            let jsonObject = quiz;
            console.log(jsonObject);
            let typeList = checkType(jsonObject);
            let quetype = typeList[0];
            let anstype = typeList[1];
            console.log("questionType: ", quetype);
            console.log("answerType: ", anstype);
            return res.view('pages/quiz', {
                quizList: jsonObject,
                questionType: quetype,
                answerType: anstype
            });
        }).catch(e => console.log(e));
    },

    getQuizListPart: async function (req, res) {
        console.log('QuizController getQuizListPart');
        let quizName = req.param('quizName');
        console.log(quizName);
        Quiz.getQuiz(quizName).then(quiz => {
            let jsonObject = quiz;
            console.log(jsonObject);
            return res.view('pages/quizPart', {quizList: jsonObject});
        }).catch(e => console.log(e));
    },

    getQuizListTime: async function (req, res) {
        console.log('QuizController getQuizListTime');
        let quizName = req.param('quizName');
        console.log(quizName);
        Quiz.getSpotifyQuiz(quizName).then(quiz => {
            let jsonObject = quiz;
            console.log(jsonObject);
            let typeList = checkType(jsonObject);
            let quetype = typeList[0];
            let anstype = typeList[1];
            console.log("questionType: ", quetype);
            console.log("answerType: ", anstype);
            return res.view('pages/quizTemplateModel1', {
                quizList: jsonObject,
                questionType: quetype,
                answerType: anstype
            });
        }).catch(e => console.log(e));
    },

};

