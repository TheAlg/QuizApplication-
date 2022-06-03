// const Music = require("../models/Music");

// module.exports = {


//   friendlyName: 'Music',


//   description: 'Music something.',


//   inputs: {

//   },


//   exits: {
//     success: {
//       responseType: 'view',
//       viewTemplatePath: 'pages/musicpage'
//     },
//     notFound: {
//       description: 'No music list found in the file.',
//       responseType: 'notFound'
//     }
//   },

//   fn: async function (inputs, exits) {
//     Music.getMusic().then(music => {
//         console.log(music);
//         let jsonObject = music;
//         return exits.success({ // locals
//             musiclist: jsonObject
//         });
//     }).catch(e => console.log(e));
//   }

  
// };
