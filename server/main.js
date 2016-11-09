import { Meteor } from 'meteor/meteor';


if(Meteor.isClient){
    require('/js/preview.js');
}




Meteor.startup(() => {
  // code to run on server at startup
    
    if ( Meteor.users.find().count() === 0 ) {
    Accounts.createUser({
        username: 'admin',
        email: 'pockshocks@email.com',
        password: '123QWe',
        profile: {
            first_name: 'dino',
            last_name: 'kraljeta',
            company: 'push.IT',
        }
    });
        console.log("welcome, admin")
}
    var user = Meteor.users.find().fetch()[0]._id;
    
	if (!Websites.findOne()){
	console.log("- building DB for first boot");
	 Websites.insert({
		title:"Procrastination population",
		url:"#",
		description:"it begins here",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0,
		 loggedCount:0
	});
	 Websites.insert({
		title:"One-Star Books",
		url:"http://onestarbookreview.tumblr.com/",
		description:"reviews of classic books, culled from the internet's think tank",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	 Websites.insert({
		title:"Clickhole",
		url:"http://www.clickhole.com/",
		description:"it's easy during procrastination to fall into a click hole",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	Websites.insert({
		title:"The Useless Web",
		url:"http://www.theuselessweb.com/",
		description:"popular search engine.",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	Websites.insert({
		title:"Animals Sitting on Capybaras",
		url:"http://animalssittingoncapybaras.tumblr.com/",
		description:"the title says it all",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	Websites.insert({
		title:"Terrible real estate agent photos",
		url:"http://terriblerealestateagentphotos.com/",
		description:"look at that real estate, just look at it..",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	Websites.insert({
		title:"Pointer Pointer",
		url:"http://www.pointerpointer.com/",
		description:"point a coursor somewhere and you will not be alone",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	Websites.insert({
		title:"cat bounce",
		url:"http://cat-bounce.com/",
		description:"internet without cats is no internet at all, now look at them jump",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	Websites.insert({
		title:"lolz",
		url:"http://www.drawball.com/lolz/",
		description:"for the lolz",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	Websites.insert({
		title:"Baby Nicolas Cage",
		url:"http://babyniccage.tumblr.com/",
		description:"leonardo got an oscar, but cage remains",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	Websites.insert({
		title:"solitare winner",
		url:"http://mrdoob.com/lab/javascript/effects/solitaire/",
		description:"instant gratification",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0
	});
	  Websites.insert({
		title:"is it thursday",
		url:"http://isitthursday.org/",
		description:"well? is it, or is it not?",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0,
	});
	  Websites.insert({
		title:"DontEvenReply",
		url:"http://dontevenreply.com/",
		description:"e-mails from an a-hole",
		createdOn:new Date().toLocaleString().split('T')[0],
		user:"admin",
        addedBy:user,
        upVote:0,
        downVote:0,
	});
	}//end of /if Websites
    if(!Counter.findOne()){
        Counter.insert({
           clickCount:0
        });
		Counter.insert({
			logged:"true",
			login:0
        });
    }
    Meteor.methods({
    getMeta: function(url) {
        this.unblock();
        try {
            return HTTP.get(url, {npmRequestOptions: {gzip: true}});
        } catch (e) {
            console.error(e);
            return false;
        }
    }
});
});
