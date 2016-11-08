var toggle = 0;
// routing
Router.configure({layoutTemplate:'global_template'});

Router.route('/', function () {
    this.render('welcome', {to:"main"});
});

Router.route('/procrastination', function () {
    this.render('navbar', {to:"navbar"});
    this.render('search_box', {to:"search"});
    this.render('website_list', {to:"main"});
});
Router.route('/wait', function () {
    this.render('wait', {to:"main"});
});
Router.route('/procrastination/logged_in', function () {
    this.render('navbar', {to:"navbar"});
    this.render('search_box', {to:"search"});
    this.render('website_list', {to:"main"});
});
Accounts.ui.config({
	passwordSignupFields:"USERNAME_AND_EMAIL"
});

Comments.ui.config({
    template: 'bootstrap'
});
Comments.config({
    rating: 'likes-and-dislikes',
    publishUserFields: { defaultAvatar: 0, emails: 1, username: 1 }
});
Comments.ui.setContent({
            'title':'write a comment',
            'placeholder-textarea':'waste a few seconds',
            'add-button':'boom'
});
// load 20 more sites on reaching bottom scroll
Session.set("siteLimit", 20);
lastScrollTop = 0;
$(window).scroll(function(){
    if($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
      var scrollTop = $(this).scrollTop();
      if (scrollTop > lastScrollTop){
      	Session.set("siteLimit", Session.get("siteLimit") + 20);
      }
      lastScrollTop = scrollTop;
    }
});

// template helpers


	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort:{upVote:-1, downVote:-1}
        //, limit:Session.get("siteLimit")  will enable after figuring out search-link-titleDiv
      });
		},
        upVote:function(){
            return Websites.find({upVote:this._id});
        },
        downVote:function(){
            return Websites.find({downVote:this._id});
        }
	});

  Template.welcome.helpers({
    userCount:function(){ // population count
      		return Meteor.users.find().fetch().length;
    }
  });

  Template.navbar.helpers({
    userCount:function(){ // population count
      		return Meteor.users.find().fetch().length;
    },
    counter:function(){
      		return Counter.find().fetch()[0].clickCount;
    }
  });

  Template.searchBox.helpers({
    WebpagesIndex: () => WebpagesIndex,
    insertId: function(){
      if (Meteor.user()){
        var userId = Meteor.user()._id;
        var user = Meteor.users.findOne({"_id":userId}).username;
        return {id:"searchInput", placeholder:"search deeper, "+ user};
      } else {
        return {id:"searchInput", placeholder:"search deeper"};
      }
    },
    title:function(){

      var webId = this._id;
      return Websites.findOne({"_id":webId}).title;
    },
    keypressed:function(){
      var input = $("#searchInput").val();
      if (input){
        return { upVote: -1 };
      }
    }
  });


  Template.website_item.helpers({
    userSite:function(){
        var webId = this._id;
        var userAdded = Websites.findOne({"_id":webId}).addedBy;
        var userId = Meteor.user()._id;
        if (userAdded == userId){
          return true;
        }
    },
    addedBy:function(){
      var webId = this._id;
      var webUser = Websites.findOne({"_id":webId}).addedBy;
      if (webUser != undefined){
        var user = Meteor.users.findOne({"_id":webUser}).username; //"PuJfNmHqCNzaMJ3h9"
        return user;
      }
      return "admin";
    }
  });
  Template.website_search_item.helpers({
    username:function(){
      var webId = this._id;
      var webUser = Websites.findOne({"_id":webId}).addedBy;
      if (webUser != undefined){
        var user = Meteor.users.findOne({"_id":webUser}).username; //"PuJfNmHqCNzaMJ3h9"
        return user;
      }
      return "admin";
    }
  });

/////////////////////////////////////////////////////// EVENTS
  Template.loginButtons.events({
    "click #login-buttons-password":function(){ 
		var counterId = Websites.find().fetch()[0]._id;
		setTimeout(function(){ // updates collection for voting rerender after timeout - waits for all data to load
			Websites.update({"_id":counterId},{$inc: {loggedCount:1}});
		}, 500);
		
    },
    "click #login-buttons-logout":function(){
      Router.go('/procrastination');
    }
  });

	Template.website_item.events({
        "click .preview-div":function(event){
          var webId = this._id;
          var divHeight = $("#"+webId).css("height");
            if ($(event.target).is(".btn-detail")){
                event.preventDefault();
            } else if (divHeight == "130px"){
                $("#"+webId).animate({"height":"600px"}, 500);
                $("#comment-"+webId).css({"display":"block"});
                $("#detail-"+webId).css({"display":"block"});
                $("#detail-"+webId).animate({"opacity":1},100);
                $("#comment-"+webId).animate({"opacity":"1"}, 650, function(){
                    $("#"+webId).css({"overflow-y":"scroll"});
                });
            }  else {
                $("#"+webId).css({"overflow-y":"hidden"});
                $("#detail-"+webId).animate({"opacity":0},100);
                $("#detail-"+webId).css({"display":"none"});
				$("#detail-view-"+webId).animate({"opacity":0},100);
				$("#detail-view-"+webId).css({"display":"none"});
                $("#comment-"+webId).animate({"opacity":"0"}, 450, function(){
                  $("#comment-"+webId).css({"display":"none"});
                });
                $("#"+webId).animate({"height":"130px"}, 500);
            }
        },
        "click .add-detail":function(event){
          var webId = this._id;
          var url = Websites.findOne({"_id":webId}).url;
          var toggle = $("#detail-view-"+webId).css("opacity");
          if(toggle != 1){
              $("#detail-view-"+webId).attr("src",url);
              $("#detail-view-"+webId).animate({"opacity":1},200);
              $("#detail-view-"+webId).css({"display":"block"});
            } else {
              $("#detail-view-"+webId).animate({"opacity":0},100);
              $("#detail-view-"+webId).css({"display":"none"});
            }
        },
		"click .js-upvote":function(event){
			var website_id = this._id;
      		var website_title = this.title;
      		var userId = Meteor.user()._id;
      // preventing multiple votes
		    if(Meteor.user()){
			    if (!Votes.findOne({"website_id":website_title, "addedBy":userId})){
				  Votes.insert({
				    website_id:website_title,
				    upVote:1
				  });
				  Websites.update({_id:website_id},{$inc: {upVote:1}});
				  $("#like"+website_id).css({"opacity":"1"});
			    } else {
				  $("#like"+website_id).toggle("slow",function(){
				    $("#like"+website_id).toggle("slow");
				  });
				return false;
			  }
		  }
		return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){
			var website_id = this._id;
		    var website_title = this.title;
		    var userId = Meteor.user()._id;
		    // preventing multiple votes
		    if(Meteor.user()){
			    if (!Votes.findOne({"website_id":website_title, "addedBy":userId})){
				  Votes.insert({
				    website_id:website_title,
				    downVote:1,
				  });
				  Websites.update({_id:website_id},{$inc: {downVote:-1}});
				  $("#dislike"+website_id).css({"opacity":"1"});
			    } else {
				  $("#dislike"+website_id).toggle("slow",function(){
				    $("#dislike"+website_id).toggle("slow");
				  });
				}
			return false;
			}
		return false;// prevent the button from reloading the page
		},
        "click .js-report-broken":function(event){
            alert("future feature, but at least this click contributed to the passage of time on your side. always here to pleasure, you're welcome. - admin")
        },
		"click .js-remove-web":function(event){
		  var webId = this.addedBy;
			  var web = this._id;
		  if(Meteor.user()){
			  var userId = Meteor.user()._id;
			  if (userId != webId){ // can remove only his own images - was used before magically dissapearence of nonuser remove buttons
				   alert("not yours...why bother?")
			  } else {
			   $("#"+web).hide(300, function(){
				 Websites.remove({"_id":web});
				});
			  }
        	}
       	}
    });

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){
            var url = event.target.url.value;
            var title = event.target.title.value;
            var description = event.target.description.value;
            var userId = Meteor.user()._id;
            var user = Meteor.users.findOne({"_id":userId}).username;
            if (Meteor.user()){
                 Websites.insert({
                     url:url,
                     title:title,
                     description:description,
                     createdOn: new Date().toLocaleString().split('T')[0],
                     addedBy:userId,
                     user:user,
                     upVote:0,
                     downVote:0
                 });
                alert("effort well wasted");
             }
            $("#website_form").hide('slow');
			var url = event.target.url.value;
			console.log("I hope the "+url+" is valid...");
			return false;// stop the form submit from reloading the page
		}
	});


	Template.navbar.events({
		"click #title-click":function(event){
            var clickId = Counter.find().fetch()[0]._id;
            Counter.update({_id:clickId},{$inc: {clickCount:1}});
		}
	});

    Template.wait.events({
		"click #js-btn-no":function(event){
			$("#js-btn-no").animate({opacity:0,}, 500, function(){
				$("#js-btn-no").css("display","none");
				$("#hidden-text").animate({opacity:1}, 500);
        $(".btn-yes").animate({"width":"300px", "height":"300px"}, 1000);
			});
		}
	});
