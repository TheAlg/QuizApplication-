/**
 * Music.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

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

  getQuiz: async function (quizName) {
    console.log('Model Quiz');
    url = __dirname;
    // removelastdir = url.substring(0, url.lastIndexOf('/'));
    // removelasttwodir = removelastdir.substring(0, removelastdir.lastIndexOf('/'));
    // console.log(removelasttwodir);
    console.log("url: ", url);
    const indexapi = url.lastIndexOf('api');
    const sperator = url.substring(indexapi+3, indexapi+4);
    url1 = url.substring(0, indexapi) + 'assets' + sperator + 'quiz' + sperator;
    console.log('url1: ', url1);
    let csvToJson = require('convert-csv-to-json');

    let jsonObject = csvToJson.getJsonFromCsv(url1+`${quizName}.csv`);
    
    return jsonObject;
  },

  getSpotifyQuiz: async function (quizName) {
    console.log('Model Quiz');
    url = __dirname;
    console.log("url: ", url);
    const indexapi = url.lastIndexOf('api');
    const sperator = url.substring(indexapi+3, indexapi+4);
    url1 = url.substring(0, indexapi) + 'assets' + sperator + 'quizSpotify' + sperator;
    console.log('url1: ', url1);
    let csvToJson = require('convert-csv-to-json');

    let jsonObject = csvToJson.getJsonFromCsv(url1+`${quizName}.csv`);
    
    return jsonObject;
  }
};
