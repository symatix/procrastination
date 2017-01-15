Meteor.publish("websites", function(){
    return Websites.find({});
})
Meteor.publish("counter", function(){
    return Counter.find({});
})
Meteor.publish("votes", function(){
    return Votes.find({});
})