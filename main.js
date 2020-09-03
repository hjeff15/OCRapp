// Create page for saved notes. Cards?
// Use CSS grid to organise divs
// If saved text, add input boxes for Title/Catagory/Reference

const cards = [{
    title: 'My First Note', 
    content:'Text goes here',
}]
//================ Define Elements
const myApiKey = config.key;

// ============= Error event handler ============
function handleError(err){
    console.log(err);
    console.log("Oh no! Something went wrong!");

}

new Vue({
    el: "#new-card",
    data: {
        cards: cards,
        header: 'OCR App',
        subHeader: "Store all your notes by taking a picture",
        newTitle: '',
        newContent: '',
        shownImage: "https://easypdf.com/images/OCR-tool.png",
        error: false
    },
    methods: {
        newCard: function(){
            console.log(extractedText.textContent);
        },
        deleteText: function(){
            extractedText.textContent = '';
        },
        createCard: function(){
            if(!this.newContent){
                this.error = true;
                console.log("aint' working")
            }else{
                this.cards.push({
                    title: this.newTitle,
                    content: this.newContent
                })
                this.newContent = '';
                this.newTitle = '';
                this.shownImage = "https://easypdf.com/images/OCR-tool.png";
            }
        },
        changeImg: function(event){
           const image = event.target.files[0];
           const reader = new FileReader();
           reader.readAsDataURL(image);
           reader.onload = e => {
               this.shownImage = e.target.result;
            //    console.log(this.shownImage);
           }
        },
        getText: async function(){
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
            
            const response = await fetch(Url, requestOptions);
            const data = await response.json();
            console.log(data);
            this.newContent = data.ParsedResults[0].ParsedText;
        }
    }
})