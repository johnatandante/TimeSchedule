var app = angular.module('TimeSchedulerApp',
                            [
                                'mainControllers',
                                'ngRoute',
                            ]);

    app.config(['$routeProvider',
      function ($routeProvider) {
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
      }]);


