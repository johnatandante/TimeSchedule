
var mainControllers = angular.module('mainControllers', ['localDataService']);

mainControllers.controller('userInfoController',
    ['UserInfo', '$scope', '$location', function (UserInfo, $scope, $location) {
        var thisObj = this;

        this.resetData = function () {
            thisObj.userInfo = {};

        };
        
        this.isUserLoggedIn = function (userInfo) {
            return userInfo != undefined
                && userInfo.name != undefined;
        };

        this.isLoggedIn = function () {
            return thisObj.isUserLoggedIn(thisObj.userInfo);
        };

        this.logOut = function () {
            thisObj.resetData();
            $location.path('/#/')
        };

        this.logIn = function (userName, password) {
            
            UserInfo.query(function (data) {

                if( !data
                    || userName != data.userInfo.username 
                    || password != data.userInfo.password)
                    return;
                
                thisObj.userInfo = data.userInfo;
                
                // set data scope
                thisObj.userInfo.utenteCorrente = thisObj.userInfo.name + " " + thisObj.userInfo.lastName;
                thisObj.userInfo.dateLogin = thisObj.userInfo.loginHistory.sort()[thisObj.userInfo.loginHistory.length - 1].when;
                thisObj.userInfo.timeLogin = "";
                //thisObj.resetData();
                
                $scope.userInfo = thisObj.userInfo;
                alert("Redirecting for: " + $scope.userInfo.utenteCorrente);
                $location.path('/signup');
                
            });
            
        };

        $scope.userInfoController = thisObj;
        this.mailTo = $scope.mailTo;
        this.mailToDescription = $scope.mailToDescription;
            
        this.resetData();

    }]);

mainControllers.controller('logOutController',
    ['$scope', function ($scope) {
        var thisObj = this;

        this.resetData = function () {
            // 
            thisObj.name = $scope.userInfoController.userInfo.name;
        };

        this.resetData();

        this.logOutUser = function () {
            $scope.userInfoController.logOut();
        };

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

        this.getLocationUpdatedFor = function (userInfo) {
            var userLogged = userInfo && userInfo.isLoggedIn();
            var item;
            for (var i = 0; thisObj.locations && i < thisObj.locations.length; i++) {
                item = thisObj.locations[i];
                item.visible = !item.disabled; 
                // if loggedIn then isloggedin must be true
                if (item.showAlways)
                    item.visible = item.visible && item.showAlways;
                else if (item.loggedIn)
                    item.visible = item.visible && userLogged;
                else
                    item.visible = item.visible && !userLogged;

            }

            return thisObj.locations;
        };

        this.doAction = function (menuItem, userInfo) {
            if (!menuItem.action)
                return;

            userInfo[menuItem.action]();

        };

    }]);


mainControllers.controller('mainController',
    ['$scope', function ($scope) {

        $scope.version = "0.01";
        $scope.appName = "Time Scheduler"
        $scope.appFullName = $scope.appName + " (for lazy people)";
        
        $scope.mailTo = "dante.delfavero@gmail.com";
        $scope.mailToDescription = "dante.delfavero at gmail.com";
        
        $scope.userInfo = { userName: "1", utenteCorrente: "xx" };
    }]);