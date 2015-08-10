var myApp = angular.module('myApp', ['ngRoute', 'angular-carousel', 'angular-flexslider']).factory('socket', function ($rootScope) {
    var socket = io.connect('http://104.131.145.165');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
}).config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'https://www.youtube.com/**']);
}).config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'https://www.soundcloud.com/**']);
});

var myController = myApp.controller('myController', function($scope, $rootScope, socket, $timeout){

    $scope.data = {
        home: true,
        about: false,
        ministries: false,
        media: false,
        audio: false,
        videos: false,
        giving: false,
        beliefs: true,
        mission: false,
        staff: false,
        rick: false,
        charlie: false,
        worship: true,
        children: false,
        students: false,
        college: false,
        adults: false,
        givingFAQS: false,
        featuredTweets :[],
        images: [
            '/images/6.jpg','/images/8.jpg','/images/9.jpg','/images/10.jpg',
            '/images/11.jpg','/images/12.jpg', '/images/13.jpg'
        ],
        tweets: []
    };
    $scope.workers = {
        home: function(){
            $scope.data.home = true;
            $scope.data.about = false;
            $scope.data.ministries = false;
            $scope.data.media = false;
            $scope.data.giving = false;
        },
        about: function(){
            $scope.data.home = false;
            $scope.data.about = true;
            $scope.data.ministries = false;
            $scope.data.media = false;
            $scope.data.giving = false;
        },
        ministries: function(){
            $scope.data.home = false;
            $scope.data.about = false;
            $scope.data.ministries = true;
            $scope.data.media = false;
            $scope.data.giving = false;
        },
        media: function(){
            $scope.data.home = false;
            $scope.data.about = false;
            $scope.data.ministries = false;
            $scope.data.media = true;
            $scope.data.giving = false;
        },
        audio: function(){
            if($scope.data.audio == true){
                $scope.data.audio = false;
                $scope.data.videos = false;

            }else{
                $scope.data.audio = true;
                $scope.data.videos = false;
            }
        },
        video: function(){
            if($scope.data.videos == true){
                $scope.data.videos = false;
                $scope.data.audio = false;
            }else{
                $scope.data.audio = false;
                $scope.data.videos = true;
            }
        },
        giving: function(){
            $scope.data.home = false;
            $scope.data.about = false;
            $scope.data.ministries = false;
            $scope.data.media = false;
            $scope.data.giving = true;
        },
        beliefs: function(){
            $scope.data.beliefs = true;
            $scope.data.mission = false;
            $scope.data.staff = false;
        },
        mission: function(){
            $scope.data.beliefs = false;
            $scope.data.mission = true;
            $scope.data.staff = false;
        },
        staff: function(){
            $scope.data.beliefs = false;
            $scope.data.mission = false;
            $scope.data.staff = true;
        },
        rick: function(){
            if($scope.data.rick == true){
                $scope.data.rick = false;
            }else{
                $scope.data.rick = true;
            }
        },
        charlie: function(){
            if($scope.data.charlie == true){
                $scope.data.charlie = false;
            }else{
                $scope.data.charlie = true;
            }
        },
        worship: function(){
            $scope.data.worship = true;
            $scope.data.children = false;
            $scope.data.students = false;
            $scope.data.college = false;
            $scope.data.adults = false;
        },
        children: function(){
            $scope.data.worship = false;
            $scope.data.children = true;
            $scope.data.students = false;
            $scope.data.college = false;
            $scope.data.adults = false;
        },
        students: function(){
            $scope.data.worship = false;
            $scope.data.children = false;
            $scope.data.students = true;
            $scope.data.college = false;
            $scope.data.adults = false;
        },
        college: function(){
            $scope.data.worship = false;
            $scope.data.children = false;
            $scope.data.students = false;
            $scope.data.college = true;
            $scope.data.adults = false;
        },
        adults: function(){
            $scope.data.worship = false;
            $scope.data.children = false;
            $scope.data.students = false;
            $scope.data.college = false;
            $scope.data.adults = true;
        },
        givingFAQS: function(){
            if($scope.data.givingFAQS == false){
                $scope.data.givingFAQS = true;
            }else{
                $scope.data.givingFAQS = false;
            }
        }
    };
    socket.on('tweets', function(data){
        for(var i=0;i<data.length;i++){
            $scope.data.tweets[i] = {
                account : data[i].account,
                href    : data[i].url,
                time    : data[i].time
            };
            var featured = data[i].text.indexOf('#FBCfeatured');
            if(featured != -1) {
                var index = data[i].text.indexOf('http://t.co/');
                if (index) {
                    $scope.data.tweets[i].text = data[i].text.substring(0, featured);
                    if(data[i].pic){
                        $scope.data.tweets[i].pic = data[i].pic;
                        var featured = {
                            text: data[i].text.substring(0, featured),
                            pic : data[i].pic
                        }
                        $scope.data.featuredTweets[i] = featured;
                    }
                } else {
                    $scope.data.tweets[i].text = data[i].text;
                }
            }else{
                $scope.data.tweets[i].text = data[i].text;
            }
            if(data[i].account == 'Fellowship Baptist'){
                $scope.data.tweets[i].img = '/images/6.jpg';
            }
        }
    })
});