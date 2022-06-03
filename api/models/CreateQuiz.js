/**
 * CreateQuiz.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 const XLSX = require("xlsx");
 const path = require("path");
 
 module.exports = {
 
   attributes: {
 
     //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
     //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
     //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
 
 
     //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
     //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
     //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
 
 
     //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
     //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
     //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
 
   },
 
   pathQuiz: function() {
     url = __dirname;
     console.log("url: ", url);
     const indexapi = url.lastIndexOf('api');
     const sperator = url.substring(indexapi+3, indexapi+4);
     url1 = url.substring(0, indexapi) + 'assets' + sperator + 'quiz' + sperator;
     // removelastdir = url.substring(0, url.lastIndexOf('/'));
     // removelasttwodir = removelastdir.substring(0, removelastdir.lastIndexOf('/'));
     // console.log(removelasttwodir);
     // return removelasttwodir + '/assets/quiz/';
     console.log('url1: ', url1);
     return url1;
   },

   pathSpotifyQuiz: function() {
    url = __dirname;
    console.log("url: ", url);
    const indexapi = url.lastIndexOf('api');
    const sperator = url.substring(indexapi+3, indexapi+4);
    url2 = url.substring(0, indexapi) + 'assets' + sperator + 'quizSpotify' + sperator;
    console.log('url2: ', url2);
    return url2;
  },
   
   generateCsv: async function (params) {
     console.log('Model CreateQuiz');
     let pathQuiz = this.pathQuiz();
     let quizName = params.quizName;
     let quizData = params.quiz;
     const ObjectToCsv = require('objects-to-csv-delimited');
     new ObjectToCsv(quizData,{
       delimiter : ';'
     }).toDisk(pathQuiz+`${quizName}.csv`);
   },

   generateSpotifyCsv: async function (params) {
    console.log('Model CreateQuiz');
    let pathSpotifyQuiz = this.pathSpotifyQuiz();
    let quizName = params.quizName;
    let quizData = params.quiz;
    const ObjectToCsv = require('objects-to-csv-delimited');
    new ObjectToCsv(quizData,{
      delimiter : ';'
    }).toDisk(pathSpotifyQuiz+`${quizName}.csv`);
  },
   
   xlsxConvertCsv: async function (files, params) {
     console.log('Model xlsxConvertCsv');
     let pathQuiz = this.pathQuiz();
     let outputFilename = pathQuiz + params.quizName + '.csv';
     let uploadFilePath = files[0].fd;
     const workBook = XLSX.readFile(uploadFilePath);
     XLSX.writeFile(workBook, outputFilename, { bookType: "csv" });
   },
 
 };
 
 