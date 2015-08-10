exports.get = function(io){

    var Twitter = require('node-twitter');
    var tweets = [];
    var tweetsTemp = [];
    io.on('connection', function(socket){
        var socketId = socket.id;
        console.log('connected to: ' + socketId);
        io.emit('tweets', tweets);
    });

    var twitterRestClient = new Twitter.RestClient(

    );

    var getTweetsInterval = setInterval(function() {
        tweetsTemp = [];
        getTweets();
    }, 300000);

    var accounts = ['fellowshipbapt'];
    var accountIndex;
    var accountInterval;
    var getTweets = function() {
        accountIndex = 0;
        accountInterval = setInterval(function(){
            getTweetsByName(accountIndex);
            accountIndex++;
        },30000);
    };
    var getTweetsByName = function(index){
        twitterRestClient.statusesUserTimeline({
            screen_name: accounts[index],
            count: 200,
            include_rts: false,
            exclude_replies: true
        }, function (error, result) {
            if (error) {
                console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
            }

            if (result) {
                //console.log(result);
                for (var i = 0; i < result.length; i++) {
                    var resultIndex = result.length - 1;
                    //console.log(tweetsTemp.length);
                    var tweetsIndex = tweetsTemp.length;
                    tweetsTemp[tweetsIndex] = {
                        account: '',
                        text: '',
                        time: '',
                        url: ''
                    };
                    tweetsTemp[tweetsIndex].account = result[i].user.name;
                    console.log(JSON.stringify(result[i]));
                    tweetsTemp[tweetsIndex].text = result[i].text;
                    tweetsTemp[tweetsIndex].time = result[i].created_at;
                    if(result[i].extended_entities){
                        if(result[i].extended_entities.media[0]){
                            if(result[i].extended_entities.media[0].media_url){
                                tweetsTemp[tweetsIndex].pic = result[i].extended_entities.media[0].media_url;
                            }
                        }
                    }
                    //console.log(result[i].created_at);
                    if(index == 0){
                        tweetsTemp[tweetsIndex].url = 'https://twitter.com/fellowshipbapt/status/' + result[i].id_str;
                        if(i == resultIndex) {
                            tweets = tweetsTemp;
                            io.emit('tweets', tweets);
                            console.log(tweets);
                            clearInterval(accountInterval);
                        }
                    }
                }
            }
        });
    };
    getTweets();
};