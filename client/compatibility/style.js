
// highlits what button user pressed
function styleVote(){
  if(Meteor.userId()){
    var webLength = Websites.find().fetch().length;
    console.log(webLength);
    for (var i = 0; i < webLength; i++){
      var userId = Meteor.user()._id;
      var website_id = Websites.find().fetch()[i]._id;
      var website_title = Websites.find().fetch()[i].title;
      if (Votes.findOne({"website_id":website_title, "addedBy":userId, "upVote":1})){
        $("#like"+website_id).css({"opacity":1});
        $("#js-downVote"+website_id).css({"opacity":0.3});
      } else
      if (Votes.findOne({"website_id":website_title, "addedBy":userId, "downVote":1})){
        $("#dislike"+website_id).css({"opacity":1});
        $("#js-upVote"+website_id).css({"opacity":0.3});
      }
    }
  }
}
Tracker.autorun(function(){
  styleVote();
});
