// Hide "Add title" input until thumbs up/down buttons used
// If X span is clicked add CSS transition to the div

const defaultImage = "assets/camera.png";
const notes = [{
    title: 'My First Note', 
    content:'Text goes here',
    showDetail: false
}]
//================ API KEY
const myApiKey = config.key;

function handleError(err){
        console.log(err);
        console.log("Oh no! Something went wrong!");
}

new Vue({
    el: "#new-note",
    data: {
        notes: notes,
        header: 'OCR App',
        subHeader: "Store all your notes by taking a picture",
        newTitle: '',
        newContent: '',
        shownImage: defaultImage,
        showText: false,
        showButton: false,
        showSaveInfo: false,
        showTitleInput: false
    },
    methods: {
        // ===========DELETE TEXT IF NOT SAVED============
        deleteText: function(){
            this.newContent = '';
            this.newTitle = '';
            this.shownImage = defaultImage;
            this.showText = false;
            this.showButton = false;
        },
        // =============CREATE NEW NOTE============
        createnote: function(){
            if(!this.newContent || !this.newTitle){
                this.error = true;
                alert("You need a Title AND content in order to save your note😁!")
            }else{
                this.notes.push({
                    title: this.newTitle,
                    content: this.newContent,
                    showDetail: false
                })
                this.newContent = '';
                this.newTitle = '';
                this.shownImage = defaultImage;
                this.showText = false;  
                this.showButton = false;
                this.showSaveInfo = false;
                this.showTitleInput = false;
            }
        },
        // ============UPLOAD IMAGE TO VIEWER============
        changeImg: function(event){
            const image = event.target.files[0];
            if(image.size > 99999){
                alert("This image is too large. Please use an image that is smaller than 1MB");
            }else{
                const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = e => {
                    this.shownImage = e.target.result;
                    this.showButton = true;
                //    console.log(this.shownImage);
                }
            }
        },
        // ==========SEND IMAGE TO API===============
        getText: async function(){
            if(this.shownImage === defaultImage){
                alert("Please select an image to read.")
            }else{
                this.showText = true;
                this.newContent = "Your text is being loaded..."
                let Url = "https://api.ocr.space/parse/image";
                var myHeaders = new Headers();
                myHeaders.append("apikey", "760098e37488957");
                
                var formdata = new FormData();
                formdata.append("language", "eng");
                formdata.append("isOverlayRequired", "false");
                formdata.append("iscreatesearchablepdf", "false");
                formdata.append("issearchablepdfhidetextlayer", "false");
                formdata.append("base64Image", this.shownImage);
                
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };
                
                const response = await fetch(Url, requestOptions).catch(handleError);
                const data = await response.json();
    
                this.newContent = data.ParsedResults[0].ParsedText;
                this.showButton = false;
                this.showSaveInfo = true;
            }
 
        },
        // =============TOGGLE NOTE VIEW===============
        toggleDetail: function(){
            this.showDetail = !this.showDetail;
        },
        showTitle: function(){
            this.showTitleInput = true;
            this.showSaveInfo = false;
            this.showText = false;
        }
    }
})