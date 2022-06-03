var playlistData= [];
var createdPlaylistData= [];
var playlistName;
const APIController = (function() { 
    
    //code iso Country
    const clientId = 'd1ff3147b0b146aba2f242b9032d90b8';
    const clientSecret = '45588796a6284ce1b30432c1e3090712';

        //l'uri du serveur
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        return data.access_token;
    }
    
    //categories endpoint
    //les paramètres des catégories sont données en codage isoo des langues et des pays
    const _getGenres = async (token, Isoctr, Isoln) => {
        const result = await fetch(`https://api.spotify.com/v1/browse/categories?country=${Isoctr}&locale=${Isoln}_${Isoctr}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    //genre endpoint
    const _getPlaylistByGenre = async (token, genreId) => {
        const limit = 10;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 50;
        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;

    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }
    const __search = async (token, query, artist)=>{
        artist = true ? artist = "artist," : "";
        const result = await fetch(`https://api.spotify.com/v1/search?query=${query}&type=track&limit=50`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token,Isoctr, Isoln ) {
            return _getGenres(token, Isoctr, Isoln);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        search(token, query, artist){
            return __search(token, query, artist);
        }
    }

})();

// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        forms :".forms",
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
        csvbttn:'#csv_Download',
        jsonbttn:'#json_Download',
        selectpays:'#selected_country',
        selectlanguage:'#selected_language',
        hfToken: ".hidden_token",
        search :"#search",
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                forms: document.querySelector(DOMElements.forms),
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
                csvDownload: document.querySelector(DOMElements.csvbttn),
                jsonDownload: document.querySelector(DOMElements.jsonbttn),
                country: document.querySelector(DOMElements.selectpays),
                language:document.querySelector(DOMElements.selectlanguage),
                search:document.querySelector(DOMElements.search),
            }
        },

        // need methods to create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 
        addLanguage(){
            const html =            
        "<div>\
            <select id='selected_language' class='option'>\
                <option value ='fr'>Select language</option>\
                <option class ='en' value ='en'>anglais</option>\
                <option class ='es' value ='es'>espagnole</option>\
                <option class ='ar' value ='ar'>arabe</option>\
            </select>\
        </div>";
        if (! document.querySelector(DOMElements.forms).contains(
            document.getElementById("selected_language")))
            document.querySelector(DOMElements.forms).insertAdjacentHTML('beforeend', html);
        },
        addGenres(){
            const html =
            "<select id='select_genre' class='option'>\
                <option value ='fr'>Select genre</option>\
            </select>";
            if (document.getElementById("select_genre") !== null){
                document.getElementById("select_genre").remove();
                }
            document.querySelector(DOMElements.forms).insertAdjacentHTML('beforeend', html);

        },
        addPlaylists(){
            const html = 
            "<select id='select_playlist' class='option'>\
                <option value ='fr'>Select playlist</option>\
            </select>";
            if (document.getElementById("select_playlist") !== null){
                document.getElementById("select_playlist").remove();
                }
            document.querySelector(DOMElements.forms).insertAdjacentHTML('beforeend', html);
        },
        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create a track list group item 
        createTrack(id, name, artist =null,parent) {
            let delete_id;
            let html;
            parent ===".song-list" ?
                delete_id = "delete_original":
                delete_id = "delete_personnalized";
    
            artist !== null ?
            html = `
            <div class="list-group-item list-group-item-action list-group-item-light">
                <a href="#" id="${id}">${name} by ${artist}</a>
                <i class="fas fa-times ${delete_id}"></i>
            <div>
            `:
            html =`
            <div class="list-group-item list-group-item-action list-group-item-light">
                <a href="#" id="${id}">${name}</a>
                <a class = 'btn_remove' type='submit' ><i class="fas fa-times ${delete_id}"></i></a>
            <div>
            `;

            document.querySelector(parent).insertAdjacentHTML('beforeend', html);
        },
        addExportButton(buttonId, parentId){
           const html = `
           <div class='btns'> 
                <button type='button' id="${buttonId}" class='button'>export to application</button>\
           <\div>`;
           if (document.getElementById(buttonId) === null){
            document.querySelector("#"+parentId).insertAdjacentHTML('beforeend', html);
            }
            

        },

        // need method to create the song detail
        createTrackDetail(img, title, artist, preview_url) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = 
            `
                <div class="img_section">
                    <img src="${img}" alt="">        
                </div>
                <div class="label_section">
                    <label for="Genre" class="">${title} : By ${artist}</label>
                </div> 
                <div class="img_section">
                    <audio controls="" type= "hidden" autoplay="true" name="media">
                        <source src="${preview_url}" type="audio/mpeg">
                    </audio>    
                </div>
                <button type='submit' name="${title}" value="${preview_url}" class='addtolist'> Add to list </button>
            `;

        detailDiv.insertAdjacentHTML('beforeend', html)
        },
        

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },
        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },
        resetPlaylist() {
                //this.inputField().playlist.innerHTML = '';
                //this.resetTracks();
        },
        resetGenre(){
            this.inputField().genre.innerHTML = '';
            this.resetPlaylist();
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;                              
        },

        async getStoredToken() {
            let token= document.querySelector(DOMElements.hfToken).value
            if (token !== null)
                return token;
            else 
            {                
                const newToken= await APICtrl.getToken();  
                this.storeToken(newToken);
            }
        }
    }
})();

const APP = (function(UICtrl, APICtrl) {

    const DOMInputs = UICtrl.inputField();

    DOMInputs.country.addEventListener('change', async () => {
        const token = await APICtrl.getToken();    
        UICtrl.storeToken(token);
        UICtrl.addLanguage();
    });

    //boutton select language
    document.addEventListener('change', async (e)=> {
        if (e.target && e.target.matches('#selected_language')){

        let ctr = document.getElementById('selected_country');  
        let ln = document.getElementById('selected_language');
        UICtrl.addGenres();
        //UICtrl.resetGenre();
        const token = await APICtrl.getToken();
        const country = ctr.options[ctr.selectedIndex].value;
        const language = ln.options[ln.selectedIndex].value;

        const genres = await APICtrl.getGenres(token, country, language);
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
        }
    });

    //boutton select genre
    document.addEventListener('change', async (e)=> {
        if (e.target && e.target.matches('#select_genre')){
        UICtrl.resetPlaylist();
        UICtrl.addPlaylists();
        const token = await APICtrl.getToken();    
        const genreSelect = UICtrl.inputField().genre; 
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;    
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);    

        // create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
        }
    });

    //boutton select playlist : pour stocker le nom de la playliste
    document.addEventListener('change', async (e)=> {
        if (e.target && e.target.matches('#select_playlist')){
            playlistName = e.target.selectedOptions[0].text;
        }
    });

    //button submit search
    document.addEventListener('click', async (e)=> {
            //boutton valider recherche par catégory
        if (e.target && e.target.matches('#btn_submit')){
            // prevent page reset
            e.preventDefault();
            UICtrl.resetTracks();
            UICtrl.addExportButton("export_all","export_created_list");
            const token = await APICtrl.getToken();    
            const playlistSelect = UICtrl.inputField().playlist;
            const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
            const tracks = await APICtrl.getTracks(token, tracksEndPoint);
            tracks.forEach(el => {
                //check si le preview_url est disponible
                if (el.track.preview_url !== null) 
                    UICtrl.createTrack(el.track.href, el.track.name, el.track.artists[0].name,".song-list")
            })
            helpers.creatJsonData(tracks); //ici, on stocke les données de la playlist dans une variable playlistData
        }
        //boutton recherche par chaine de caractère
        else if (e.target && e.target.matches('#btn_search')){
            let query = document.getElementById('query').value
            if(query !== ""){
                UICtrl.resetTracks();
                UICtrl.addExportButton("export_all","export_created_list");
                e.preventDefault();
                const token = await APICtrl.getToken();    
                //const token = await UICtrl.getStoredToken();
                const tracks = await APICtrl.search(token, query, true)
                tracks.tracks.items.forEach(el => {
                    if (el.preview_url !== null) 
                        UICtrl.createTrack(el.href, el.name, el.artists[0].name,".song-list")
                });
                helpers.creatJsonData(tracks.tracks.items); 
            }
            else{
                alert('veuillez remplir le champs de recherche')
            }
        }
    });

    //boutton clicker sur un track
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = await APICtrl.getToken();    
        // get the track endpoint
        const trackEndpoint = e.target.id;
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        // load the track details
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name, track.preview_url);
    })
    
    //boutton créér une liste personnalisée
    document.addEventListener("click", async (e)=>{
        if (e.target && e.target.matches('.addtolist')){
            UICtrl.addExportButton("export_list", "browse");
            let track = new Object();
            track.question = e.target.value
            track.answer = e.target.name
            if(!createdPlaylistData.some(e => e.answer === track.answer)){
                UICtrl.createTrack(track.question, track.answer,null,".browse_list");       
                createdPlaylistData.push(track)
            }
            else {
                alert('ce track est déjà dans votre liste');
            }   
        }
    })

    //bouton exporter les données
    document.addEventListener('click', (e)=> {
        if (e.target && e.target.matches('#export_all')){
            if (playlistData.length !== 0 ) {
                let questions = helpers.createQuestions(playlistData);
                let answers = helpers.createAnswers(playlistData);
                playlistName = playlistName === undefined?
                        prompt("Veuillez entrer le nom que vous souhaitez donner à cette playliste"):playlistName;
                helpers.sendDataToController(playlistName,questions,answers);
                }
            else 
            alert('veuillez valider le champs de recherche')
        }
        else if (e.target && e.target.matches('#export_list')){
            if (createdPlaylistData.length !== 0 ) {
                let questions = helpers.createQuestions(createdPlaylistData);
                let answers = helpers.createAnswers(createdPlaylistData);
                let playlistName = prompt("Veuillez entrer le nom que vous souhaitez donner à cette playliste")
                helpers.sendDataToController(playlistName,questions,answers);
                }
            else 
            alert('veuillez valider le champs de recherche')
        }
    })
    //boutton supprimer
    document.addEventListener('click', (e)=> {
        if (e.target && e.target.matches(".delete_original")){

            playlistData.forEach(track=>{
                if (e.target.parentNode.textContent.trim() === track.answer.trim())
                {
                    e.target.parentNode.remove();
                    let indx = playlistData.findIndex(v => v.answer === track.answer);         
                    playlistData.splice(indx, 1);  
                }
                if (playlistData.length === 0)
                    document.getElementById("export_all").remove();
            })
        }
        else if (e.target && e.target.matches(".delete_personnalized")){
            createdPlaylistData.forEach(track=>{
                if (e.target.parentNode.textContent.trim() === track.answer.trim())
                {
                    e.target.parentNode.remove();
                    let indx = playlistData.findIndex(v => v.answer === track.answer);         
                    createdPlaylistData.splice(indx, 1);  
                }
                if (createdPlaylistData.length === 0){
                    document.getElementById("export_list").remove();
                }
            })
        }
    })

    return {
        init() {
            console.log('App is starting');
        }
    }

})(UIController, APIController);


const helpers = {
    getFileFromUrl: async(url, name, defaultType = 'audio')=>{
        const response = await fetch(url);
        const data = await response.blob();
        file = new File([data], name, {
        type: data.type || defaultType,
        });
        return file;
    },
    toBase64 : (file)=> new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        console.log(reader.result);
    }),
    objectToCSVRow : async (dataObject )=> {
        var dataArray = new Array;
        for (var o in dataObject) {
            var innerValue = dataObject[o]===null?'':dataObject[o].toString();
            var result = innerValue.replace(/"/g, '""');
            result = '"' + result + '"';
            dataArray.push(result);
        }
        return dataArray.join(' ') + '\r\n';
    },
    creatJsonData:(array)=>{  
        playlistData = [];

        for (let i = 0; i< array.length; i++){
            //on retire les éléments qui ont des urls vides 
            if (array[0].hasOwnProperty('track')){
                if (array[i].track.preview_url !==null){
                    playlistData.push({
                        question : array[i].track.preview_url, //ou url64 si on veut l'audio en base64
                        answer : array[i].track.name + ' by '+ array[i].track.artists[0].name
                    })
                }
            }
            else {
                if (array[i].preview_url !==null){
                    playlistData.push({
                        question : array[i].preview_url, //ou url64 si on veut l'audio en base64
                        answer : array[i].name + ' by '+ array[i].artists[0].name
                    })
                }
            }

        }
        return playlistData;
    },
    parseJSONToCSVStr : async (jsonData) =>{
        if(jsonData.length == 0) {
            return '';
        }

        let keys = Object.keys(jsonData[0]);

        let columnDelimiter = ',';
        let lineDelimiter = '\n';

        let csvColumnHeader = keys.join(columnDelimiter);
        let csvStr = csvColumnHeader + lineDelimiter;

        jsonData.forEach(item => {
            keys.forEach((key, index) => {
                if( (index > 0) && (index < keys.length-1) ) {
                    csvStr += columnDelimiter;
                }
                csvStr += item[key];
            });
            csvStr += lineDelimiter;
        });

        return encodeURIComponent(csvStr);;
    },
    Export : async (data, extention) => {
        let playlist;
        let dataUri;
        let name = playlistName;
        let exportFileDefaultName = name + '.' + extention;

        if (extention === 'csv') 
            {
                playlist = await parseJSONToCSVStr(data);
                dataUri = 'data:text/csv;charset=utf-8,' + playlist;
            }
        else if (extention ===  'json') 
            {
                playlist = JSON.stringify(data);
                dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(playlist);
            }

        if (playlistData !== null || dataUri !== null) 
        { 
            let linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
        else{
            alert(playlistData +' est vide !')
        }
    },
    downloadBlob : (blob, name = 'test.mp3') =>{
        // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
        const blobUrl = URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement("a");
        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = name+'.mp3';
        // Append link to the body
        document.body.appendChild(link);
        // Dispatch click event on the link
        // This is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
        new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true, 
            view: window 
        })
        );
        // Remove link from body
        document.body.removeChild(link);
    },
    createQuestions:(array)=>{
        let questions =[];
        for (let i = 0; i< array.length; i++){
                questions.push(array[i].question);
        }
        return questions;
    },
    createAnswers:(array)=>{
        let answers =[];
        for (let i = 0; i< array.length; i++){
                answers.push(array[i].answer);
        }
        return answers;
    },
    sendDataToController:(quizName,questions,answers )=>{
        var data = new Object();
        data.quizName = quizName;
        data.questions = questions
        data.answers =answers

        $.ajax({
        type: "POST",url: "/create/format", 
        data: {
                    questionType: "text",
                    answerType:"text",
                },
        success: function() {
            $.ajax({
                type: "POST",url: "/create/manualUpload", 
                data: data,
                success: function(e) {
                    alert('data sent successfully')
                }
            });
        },
        error: function() {
            alert("problem communicating with the server");
        }
        });
    }
}


