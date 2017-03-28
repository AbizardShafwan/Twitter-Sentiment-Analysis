var sentimental = require('Sentimental');
var twit = require('twit');
var config = require("../../config");

module.exports = function(app) {


        app.get('/senti', function(req, res) {
		res.render('senti');
		
	} );


	app.post('/sentiments', function(req, res) {
		//var keyword = req.body.keyword;
		
		var choices = req.body.sentiments;
		var date = req.body.date;
		
		//console.log(req.body.sentiments);
		var today = new Date();
		var twitter = new twit({
    		consumer_key: config.consumer_key,
    		consumer_secret: config.consumer_secret,
    		access_token: config.access_token,
    		access_token_secret: config.access_token_secret
  		});
		var resultss = {};
		var dataFromTwitter = twitter.get('search/tweets', { q: ''+choices+' since:'+date+'', count: 100 }, function(err, data, response) {
var results = sentimentScore(data.statuses);		
  		//console.log(data.statuses);
		//score = sentimentScore(data.statuses);
		//JSON.stringify({'score': score, 'eventList': data.statuses})
		//res.render('sentiments', JSON.stringify({'score': score, 'eventList': data.statuses}));
		res.render('sentiments', {'eventList' : JSON.stringify(results)});
		})
		

		});

function sentimentScore(sentimentText) {
  var resultss = {};
  var results = 0;
  var sentiments = '';
  var key = 'tweetList';
  resultss[key] = [];
  for(var i = 0; i < sentimentText.length; i++) {
    tweet = sentimentText[i]['text']; //text of tweets
    tweet = tweet.replace('#', ''); //remove hashtag
    retweet = sentimentText[i]['retweet_count'];
    favorite = sentimentText[i]['favorite_count'];
    tweetDate = sentimentText[i]['created_at'];
    var score = sentimental.analyze(tweet)['score'];
    
    results += score;
  if(score > 0){
      if(retweet > 0) {
        results += (Math.log(retweet)/Math.log(2));
      }
      if(favorite > 0) {
        results += (Math.log(favorite)/Math.log(2));
      }
    }
    else if(score < 0){
      if(retweet > 0) {
        results -= (Math.log(retweet)/Math.log(2));
      }
      if(favorite > 0) {
        results -= (Math.log(favorite)/Math.log(2));
      }
    }
    else {
      results += 0;
    }
	if(results > 0){
	sentiments = 'Positive';
	}
	else if(results == 0){
	sentiments = 'Neutral';
	}
	else{
	sentiments = 'Negative';
	}
var data = {
	text: tweet,
	score: results,
	retweet: retweet,
	favorite: favorite,
	tweetDate: tweetDate,
	sentiments: sentiments
};
  resultss[key].push(data);
 results = 0;
  }
  //return score;
  //return [score, results, tweet, retweet, favorite];
  
 return resultss[key];
}
	

	
	
