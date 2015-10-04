var mainControllers = angular.module('mainControllers', ['localDataService']);

mainControllers.controller('userInfoController',
    ['UserInfo', function (UserInfo) {
        var thisObj = this;

        thisObj.resetData = function () {
            thisObj.userInfo = {};

            thisObj.utenteCorrente = "";
            thisObj.dateLogin = "";
            thisObj.timeLogin = "";

        };

        thisObj.isLoggedIn = function () {
            return thisObj.userInfo && thisObj.userInfo.name;
        };

        UserInfo.query(function (data) {

            thisObj.userInfo = data.userInfo;

            // set data scope
            thisObj.utenteCorrente = thisObj.userInfo.name + " " + thisObj.userInfo.lastName;
            thisObj.dateLogin = thisObj.userInfo.loginHistory.sort()[thisObj.userInfo.loginHistory.length - 1].when;
            thisObj.timeLogin = "";

        });

    }]);

mainControllers.controller('schedulePlan',
    ['TimeSchedule', 'Schedule', function (TimeSchedule, Schedule) {
        var thisObj = this;

        this.resetData = function () {
            thisObj.query = "";
            thisObj.activitySchedule = {};
            thisObj.day = "";
            thisObj.activityTodo = {};
        };

        this.resetData();

        this.LogActivitiy = function ($event, activity) {
            $event.preventDefault();

            if (!activity || activity.done)
                return;
            
            var howLong = activity.howLong;
            angular.forEach(thisObj.activityLogged, function (currentActivity) {

                if (howLong == 0) 
                    return;

                if (activity.done) {
                    currentActivity.description = activity.description;
                    howLong--;
                } else if (currentActivity.time == activity.time) {
                    currentActivity.description = activity.description;                    
                    howLong--;
                    activity.done = true;
                } else {
                    //
                }

            });

            if (!activity.done) {
                // add to list
                for (var i = 0; i < howLong; i++) {
                    thisObj.activityLogged.push({ time: activity.time, description: activity.description, done: true });
                }

            }


        };

        Schedule.query(function (data) {
            if (!data) {
                thisObj.activitySchedule = {};
                return;
            }

            thisObj.activitySchedule = data;

        });

        TimeSchedule.query(function (data) {
            if (!data) {
                thisObj.day = "";
                thisObj.activityTodo = {};
                thisObj.activityLogged = {};
                return;
            }

            thisObj.day = data.day;
            thisObj.activityTodo = data.activityTodo;
            thisObj.activityLogged = data.activityLogged;

            thisObj.planTime = [
            "08:00", 
            "08:30", 
            "09:00", 
            "09:30", 
            "10:00", 
            "10:30", 
            "11:00", 
            "11:30", 
            "12:00",
            ];

        });

    }]);

mainControllers.filter('unvisible', function () {
    return function (data, property) {
        var ret = [];
        if (!data)
            return ret;

        var ret = [];
        angular.forEach(data, function (item) {
            if (!item[property])
                ret.push(item);

        });

        return ret;

    }
});

mainControllers.filter('isvisible', function () {
    return function (data, property) {        
        var ret = [];
        if (!data)
            return ret;

        angular.forEach(data, function (item) {
            if (item[property])
                ret.push(item);

        });

        return ret;

    }
});

mainControllers.controller('navController',
    ['$location', 'Menu', function ($location, Menu) {
        var thisObj = this;

        Menu.query(function (data) {
            if (!data) {
                thisObj.locations = [];
                return;
            }

            thisObj.locations = data;

        })

        this.isActive = function (viewLocation) {
            return viewLocation === $location.path()
                && thisObj.locations[viewLocation];
        };

    }]);


mainControllers.controller('mainController',
    ['$scope',  function ($scope) {

        $scope.version = "0.01";
        $scope.appName = "Time Scheduler"
        $scope.appFullName = $scope.appName + " (for lazy people)";

    }]);