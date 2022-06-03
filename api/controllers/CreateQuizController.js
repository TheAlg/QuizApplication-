/**
 * CreateQuizController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


const CreateQuiz = require("../models/CreateQuiz");
const fs = require("fs");
const path = require("path");
// const QuizController = require("./QuizController");

let queType;
let ansType;

function generateCsv(data, res) {
    CreateQuiz.generateCsv(data).then(response => {
        console.log('response in CreateQuizController',response);
        return res.redirect('/');
    }).catch(e => console.log(e));
}

function generateSpotifyCsv(data, res) {
    CreateQuiz.generateSpotifyCsv(data).then(response => {
        console.log('response in CreateQuizController',response);
        return res.redirect('/');
    }).catch(e => console.log(e));
}

function receiveQuestionFiles(files, data) {
    console.log('question files: ', files, ' type: ', typeof files);
    files.forEach(e => {
        let patternWin = `\\${queType}`;
        let indexSubWin;
        let pattern = `/${queType}`;
        let indexSub = e.fd.indexOf(pattern);
        let q;
        if (indexSub >= 0) {
            q = e.fd.substring(indexSub);
        } else {
            indexSubWin = e.fd.indexOf(patternWin);
            if (indexSubWin >= 0) {
            q = `/${queType}/`+e.fd.substring(indexSubWin+7);
            } 
        }
        data.quiz.push({ question: q, answer: '' });
    });
    console.log("data in upload question: ", data);
    return data;
}

function receiveAnswerFiles(files, data) {
    console.log('answer files: ', files, ' type: ', typeof files);
    let answerNameList = [];
    files.forEach(e => {
        let patternWin = `\\${ansType}`;
        let pattern = `/${ansType}`;
        let indexSubWin;
        let indexSub = e.fd.indexOf(pattern);
        let a;
        if (indexSub >= 0) {
            a = e.fd.substring(indexSub);
        } else {
            indexSubWin = e.fd.indexOf(patternWin);
            if (indexSubWin >= 0) {
                a = `/${ansType}/`+e.fd.substring(indexSubWin+7);
            } 
        }
        answerNameList.push(a);
    });
    for (let i = 0; i < data.quiz.length; i++) {
        data.quiz[i].answer = answerNameList[i];
    }
    console.log("data in upload answer: ", data);
    return data
}

function getQuizNameList() {
    // url = __dirname;
    // console.log("url: ", url);
    // const indexapi = url.lastIndexOf('api');
    // const sperator = url.substring(indexapi+3, indexapi+4);
    // quizPath = url.substring(0, indexapi) + 'assets' + sperator + 'quiz';
    // console.log('quizPath: ', quizPath);
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

// function getSpotifyQuizNameList() {
//     let quizNameListSpotify = [];
//     fs.readdirSync(path.resolve(__dirname, '../../assets/quizSpotify')).forEach(file => {
//         let quizName = file.split('.')[0];
//         if (quizName.length > 0) {
//             console.log(quizName);
//             quizNameListSpotify.push(quizName);
//         }
//     });
//     return quizNameListSpotify;
// }

module.exports = {
    setFormat: function (req, res) {
        console.log('CreateQuizController setFormat');
        let params = req.allParams();
        console.log(params);
        queType = params.questionType;
        ansType = params.answerType;
        return res.view('pages/createQuestionsForQuiz', {format: params});
    },
    // createQuizManual: function (req, res) {
    //     console.log('CreateQuizController createQuizManual');
    //     let params = req.allParams();
    //     console.log(params);
    //     CreateQuiz.generateCsv(params).then(response => {
    //         console.log('response in CreateQuizController',response);
    //         return res.send('create successfully');
    //     }).catch(e => console.log(e));
    // },
    createQuizSpotifyUpload: function (req, res) {
        console.log('CreateQuizController createQuizSpotifyUpload');
        let params = req.allParams();
        let data = {
            quizName: params.quizName,
            quiz: []
        };
        for (let i = 0; i < params.questions.length; i++) {
            let obj = { question: params.questions[i], answer: params.answers[i] };
            data.quiz.push(obj);
        }
        generateSpotifyCsv(data, res);
    },

    createQuizManualUpload: function (req, res) {
        console.log('CreateQuizController createQuizManualUpload');
        let params = req.allParams();
        console.log('queType: ', queType);
        console.log('ansType: ', ansType);
        let quizNameList = getQuizNameList();
        if (quizNameList.includes(params.quizName)) {
            return res.view('pages/createQuizChooseType', {error: 'Quiz name exists!'});
        }
        // delete empty questions and answers
        if (params.questions) {
            params.questions = params.questions.filter(e => e);
        }
        if (params.answers) {
            params.answers = params.answers.filter(e => e);
        }
        console.log('params: ', params);
        let data = {
            quizName: params.quizName,
            quiz: []
        };
        // question and answer are both text
        if (queType == "text" && ansType == "text") {
            console.log('question answer are both text');
            for (let i = 0; i < params.questions.length; i++) {
                let obj = { question: params.questions[i], answer: params.answers[i] };
                data.quiz.push(obj);
            }
            generateCsv(data, res);
        }
        // question and answer are both files (image or audio)
        if (queType != "text" && ansType != "text") {
            console.log('question answer are both files');
            req.file('questions').upload({
                dirname: require('path').resolve(sails.config.appPath, `assets/${queType}`)
            }, function whenDone(err, files) {
                if (err) {
                    return res.serverError(err);
                }
                data = receiveQuestionFiles(files, data);
            });

            req.file('answers').upload({
                dirname: require('path').resolve(sails.config.appPath, `assets/${ansType}`)
            }, function whenDone(err, files) {
                if (err) {
                    return res.serverError(err);
                }
                data = receiveAnswerFiles(files, data);
                generateCsv(data, res);
            });
        }
        // question is file, answer is text
        if (queType != "text" && ansType == "text") {
            console.log('question is file, answer is text');
            req.file('questions').upload({
                dirname: require('path').resolve(sails.config.appPath, `assets/${queType}`)
            }, function whenDone(err, files) {
                if (err) {
                    return res.serverError(err);
                }
                data = receiveQuestionFiles(files, data);

                for (let i = 0; i < data.quiz.length; i++) {
                    data.quiz[i].answer = params.answers[i];
                }
                console.log(data);
                generateCsv(data, res);
            });
        }
        // answer is file, question is text
        if (queType == "text" && ansType != "text") {
            console.log('answer is file, question is text');
            params.questions.forEach(q => {
                data.quiz.push({ question: q, answer: '' });
            });
            
            req.file('answers').upload({
                dirname: require('path').resolve(sails.config.appPath, `assets/${ansType}`)
            }, function whenDone(err, files) {
                if (err) {
                    return res.serverError(err);
                }
                data = receiveAnswerFiles(files, data);
                generateCsv(data, res);
            });
        }
    },

    // createQuizUploadXlsx: function (req, res) {
    //     console.log('CreateQuizController createQuizUploadXlsx');
    //     let params = req.allParams();
    //     console.log(params);
    //     req.file('uploadFile').upload({
    //         maxBytes: 1000000
    //     }, function whenDone(err, files) {
    //         if (err) {
    //             return res.serverError(err);
    //         }
    //         console.log('files: ', files, ' type: ', typeof files);
    //         CreateQuiz.xlsxConvertCsv(files, params).then(response => {
    //             console.log('response in CreateQuizController',response);
    //             return res.send('upload and convert successfully');
    //         }).catch(e => console.log(e));

    //     });
    // }

};

