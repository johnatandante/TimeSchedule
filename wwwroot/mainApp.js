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
                templateUrl: "views/currentPlan.html",
                controller: "schedulePlan",
                controllerAs: "plan"
            }).
            when("/about", {
                templateUrl: "/views/about.html",
                controller: "schedulePlan",
                controllerAs: "plan"
            }).
            when('/login', {
                templateUrl: "views/login.html",
                controller: "schedulePlan",
                controllerAs: "plan"
            }).
            when('/signup', {
                templateUrl: "views/signup.html",
                controller: "schedulePlan",
                controllerAs: "plan"
            }).
            otherwise({
                redirectTo: '/home'
            });
            
            $locationProvider.html5Mode(true);
               // .hashPrefix('!');
            
      }]);


