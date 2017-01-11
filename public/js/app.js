// set up firebase

var config = {
    apiKey: "AIzaSyD3bzqXrH2eTaiyBdoqihbsfEU-52xNulM",
    authDomain: "torrential-times.firebaseapp.com",
    databaseURL: "https://torrential-times.firebaseio.com",
    storageBucket: "torrential-times.appspot.com",
    messagingSenderId: "840694220845"
};
firebase.initializeApp(config);
var database = firebase.database();
var usersRef = database.ref('users');
var articlesRef = database.ref('articles');
var localesRef = database.ref('locales');
var offersRef = database.ref('offers');
var tagsRef = database.ref('tags');
var testRef = database.ref('tests');

try {
    var user = firebase.auth().currentUser;    
    var userRef = database.ref('users/' + user.uid);       
}catch(err) {
    console.log(err.message);
}

Vue.component('tag-comp', {
    template: "#tag-template",
    props: ['tag'],
    data: function() {
        return {
            upvoted: false,
            downvoted: false
        }
    },    
    methods: {
        displayInfo: function(){
            
            var tagKey = this.tag['.key'];
            console.log(tagKey);
            var tagRef = database.ref('tags/' + tagKey);            

            tagRef.once('value', vm.gotData, vm.errData);
                        
            
        },
        upVote: function(){
            this.upvoted = !this.upvoted;
            this.downvoted = false;
            tagsRef.child(this.tag['.key']).update({"upVotes":this.tag.upVotes+1});
        },
        downvote: function(){
        },
        comment: function(){
        },
        filterResults: function(){

        }
    }   
});

Vue.component('article-comp', {
    template: "#article-template",
    props: ['article'],
    data: function() {
        return {
            upvoted: false,
            downvoted: false
        };
    },
    methods: {
        upVote: function() {
            drawResults();
            this.upvoted = !this.upvoted;
            this.downvoted = false;
            articlesRef.child(this.article['.key']).update({"upVotes":this.article.upVotes});
            console.log(this.article['.key']);
            
        },
        downVote: function() {
            this.downvoted = !this.downvoted;
            this.upvoted = false;
            articlesRef.child(this.article['.key']).update({"downVotes":this.article.downVotes+1});

        }
    },
    computed: {
        votes: function() {
            var votes = this.article.upVotes - this.article.downVotes;
            if (this.upvoted) {
                return votes + 1;
            } else if (this.downvoted) {
                return votes - 1;
            } else {
                return votes;
            }

        }
    }
});


Vue.component('profile', {
    template: "#profile-template",
    props: ['currentuser', 'displayuser'],
    methods: {
        displayUser: function(){
            
        }

    }

});

Vue.component('modal', {
    template: "#modal-template",
    props: ['newtag', 'newoffer', 'newarticle']
});


Vue.component('offer', {
    template: "#offer-template",
    
});

var vm = new Vue({
    el: '#app',
    mixins: [ VueFocus.mixin ],
    data: {
        tagName: '',
        tagShouldBe: '',
        tagWhy: '',
        post: false,
        postCount: 0,
        offerShow: false,
        articleShow: false,
        tagModal: false,
        registerShow: false,
        registerComplete: false,
        logInShow: true,
        news: true,
        classifieds: false,
        currentUser: '',
        user: {
            name: '',
            picture: '',
            credits: ''
           
        },
        newuser: {
            email: '',
            password: '',
            credits: 1000
        },
        newarticle: {
            postedBy: '',
            headline: '',
            tags: '',
            link: '',
            postedBy: '',
            upVotes: 0,
            downVotes: 0,
            location: '',
            lat: '',
            lng: '',
            cost: ''
        },
        newoffer: {
            postedBy: '',
            name: '',                        
            unitValues: {},
            tags: '',                        
            location: '',            
            validFrom: '',
            validTo: '',
            value: '',
            cost: '',
            lat: '',
            lng: ''
        },
        newtag: {
            name: '',
            postedby: '',
            canbe: '',
            shouldbe: '',
            why: '',            
            upVotes: 0,
            downVotes: 0,
            details: {},
            cost: ''
        },
        logIn: {
            email: '',
            password: ''
        }
    },
    firebase: {
        articles: articlesRef,
        offers: offersRef,
        users: usersRef,       
        tags: tagsRef,
        tests: testRef,
    },
    computed: {
        convertCredits: function(){


        }
    },
    methods: {
        gotData: function(data){
            this.tagName = data.val().name;
            this.tagShouldBe = data.val().shouldbe;
            this.tagWhy = data.val().why;
            console.log(data.val().upVotes + " are the upvotes");
            
        },
        errData: function(err){
            console.log(err);
        },
        tagTop: function(){},
        showPost: function(){            
            this.post=true;
            console.log("showing post form");
        },
        postArticle: function(){
            this.articleShow=true;
            this.postCount++;
        },
        postOffer: function(){
            this.offerShow=true;
            this.postCount++;
        },
        deployArticle: function(){
            
            var user = firebase.auth().currentUser;    
            var userArticlesRef = database.ref('users/' + user.uid + '/articles');
            userArticlesRef.push(this.newarticle);
            articlesRef.push(this.newarticle);
        },
        deployOffer: function(){
            var user = firebase.auth().currentUser;    
            var userOffersRef = database.ref('users/' + user.uid + '/offers');
            offersRef.push(this.newoffer);
            userOffersRef.push(this.newoffer);
        },
        cancelOffer: function(){
            this.post=false;
            this.articleShow=false;
            this.offerShow=false;
        },
        deployTag: function(){
            var user = firebase.auth().currentUser;    
            var userTagsRef = database.ref('users/' + user.uid + '/tags');        
            userTagsRef.push(this.newtag);
            tagsRef.push(this.newtag);
            testRef.push(this.newtag);
        },
        cancelTag: function(){
            this.tagModal=false;
        },
        cancelRegister: function(){
            this.registerShow=false;
        },

        addUser: function () {
            firebase.auth().createUserWithEmailAndPassword(this.newuser.email, this.newuser.password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
            console.log("adding user");
            var user = firebase.auth().currentUser;    
            var userRef = database.ref('users/' + user.uid + '/');
            userRef.set({'credits': this.newuser.credits});
            if (user){
                this.logInShow = false;
            }
        },        
        login: function(){            
            firebase.auth().signInWithEmailAndPassword(this.logIn.email, this.logIn.password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;                
                console.log(error.message);
            });
            console.log("trying to log in");
            try {
                var user = firebase.auth().currentUser;    
                var userRef = database.ref('users/' + user.uid + '/');
                this.logInShow = false;
                this.registerShow = false;
                
            }catch(err){
                console.log(err.message);
            }
            
        },
        logOut: function(){
            firebase.auth().signOut().then(function() {
                this.logInShow = true;
                // Sign-out successful.
            }, function(error) {
                // An error happened.
            });
        },
        toggleRegister: function(){
            console.log('toggled register');
            this.registerShow = !this.registerShow;
            this.logInShow = false;            
        },
        getUser: function(){
            if (user){
                // show user's name
                // show user's credits
                // 
                console.log(user + " is logged in");
            }

        }
    },
    mounted (){
        $("#get-offer-location")
            .geocomplete({ details: ".details" })
        /***** highlight start *****/
            .bind("geocode:result", function(event, result){
                
                //tried result.something but couldn't find the the same thing as `this.value`
                
                vm.newoffer.lat = result.geometry.location.lat();
                vm.newoffer.lng = result.geometry.location.lng();
            });

        $("#get-article-location")
            .geocomplete({ details: ".details" })
        /***** highlight start *****/
            .bind("geocode:result", function(event, result){
                
                //tried result.something but couldn't find the the same thing as `this.value`
                
                vm.newarticle.lat = result.geometry.location.lat();
                vm.newarticle.lng = result.geometry.location.lng();

            });

    }
    
});


//buttons interactivity
//$("#").hover('




//leaflet

var map = L.map('map', { zoomControl:false });
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);



map.setView([0, 0], 2);

var markers = new L.FeatureGroup();
map.addLayer(markers);

   
function drawResults(){
    // get offer keys
    var offers = new Array();
    var articles = [];


    offersRef.once("value", function(snapshot) {        
        var offerKeys = Object.keys(snapshot.val());
        for (var i=0; i<offerKeys.length; i++){
            var offer = snapshot.val()[offerKeys[i]];           
            var lat = offer.lat;
            
            var lng = offer.lng;
            offers.push([lat, lng]);
            var marker = L.marker([lat, lng]).addTo(markers);
            map.fitBounds(markers.getBounds());            
        }
            
    });

    
    articlesRef.once("value", function(snapshot) {        
        var articleKeys = Object.keys(snapshot.val());

        for (var j=0; j<articleKeys.length; j++){

            var article = snapshot.val()[articleKeys[j]];


        }
        
    });
    
    // draw offers to map
    
       
}

drawResults();



