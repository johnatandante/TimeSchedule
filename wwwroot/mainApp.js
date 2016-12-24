var app = angular.module('TimeSchedulerApp',
                            [
                                'mainControllers',
                                'ngRoute',
                            ]);
    // rewrite url
    // http://geekswithblogs.net/shaunxu/archive/2014/06/10/host-angularjs-html5mode-in-asp.net-vnext.aspx
    app.config(['$routeProvider', '$locationProvider',
      function ($routeProvider, $locationProvider) {
          $routeProvider.
            when('/home', {
                templateUrl: "views/home.html",
                controller: "schedulePlan",
                controllerAs: "plan"
            }).
            when("/schedule", {
                templateUrl: "/views/schedule.html",
                controller: "weekSchedule",
                controllerAs: "plan"
            }).
            when("/about", {
                templateUrl: "/views/about.html",
            }).
            when('/login', {
                templateUrl: "views/login.html"
            }).
             when('/user', {
                templateUrl: "views/userInfo.html",
                controller: "schedulePlan",
                controllerAs: "plan"
            }).
            when('/signup', {
                templateUrl: "views/signup.html"
            }).
            when('/logout', {
                templateUrl: "views/logout.html"
            }).
            otherwise({
                redirectTo: '/home'
            });
            
            $locationProvider.html5Mode(true);
               // .hashPrefix('!');
            
      }]);


