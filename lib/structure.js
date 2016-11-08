import { Index, MinimongoEngine } from 'meteor/easy:search'
//collections
Websites = new Mongo.Collection("websites");
Counter = new Mongo.Collection("counter");
Votes = new Mongo.Collection("votes");

WebpagesIndex = new EasySearch.Index({
  collection: Websites,
  fields: ['title', 'description', 'user'],
  engine: new EasySearch.Minimongo({sort: function(){
      return { user:-1, upVote: -1 };
   }
  })
});
//comments
Comments.config({
   template: 'ionic' // or ionic, semantic-ui
});
Comments.config({
  allowAnonymous: () => true,
  anonymousSalt: 'myRandomSalt'
});

//restrictions
Websites.allow({
    insert:function(userId, doc){
        if (Meteor.user()){ // if logged in
            doc.addedBy = userId;
            if (userId != doc.addedBy){
                consol.log("..i see you..");
                return false; // if id do not mach - access denied
            } else {
                return true;
            }
        } else {
            consol.log("..i see you..");
            return false;  // if user not logged in - access denied
        }
    },
    remove:function(userId, doc){
        if (Meteor.user()){
            if (userId != doc.addedBy){ // can remove only his own images
                consol.log("..i see you..");
				return false;
            } else {
                return true;
            }
        } else {
			consol.log("..i see you..");
            return false;
        }
    },
    update() {return true;}
	  //			function(userId, doc){
      //  			if (Meteor.user()){ // can rate only his own images
      //          		return true;
      //      		} else {
      //          		return false;
      //          		consol.log("..i see you..");
      //      		}
      // 		}
});

Counter.allow({
    update(){return true;
			},
    insert:function(userId, doc){
        if (Meteor.user()){ // if logged in
            doc.addedBy = userId;
            if (userId != doc.addedBy){
                consol.log("..i see you..");
                return false; // if id do not mach - access denied
            } else {
                return true;
            }
        } else {
            consol.log("..i see you..");
            return false;  // if user not logged in - access denied
        }
    }
});

Votes.allow({
    insert:function(userId, doc){
        if (Meteor.user()){ // if logged in
            doc.addedBy = userId;
            if (userId != doc.addedBy){
                consol.log("..i see you..");
                return false; // if id do not mach - access denied
            } else {
                return true;
            }
        } else {
            consol.log("..i see you..");
            return false;  // if user not logged in - access denied
        }
    }
});
