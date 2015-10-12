var mainControllers = angular.module('mainControllers', ['localDataService', 'ui.bootstrap']);

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
    ['TimeSchedule', function (TimeSchedule) {

        var thisObj = this;
        this.timeSlot = (new Date(1, 0, 1, 0, 30, 0)).toJSON();

        this.resetData = function () {
            thisObj.query = "";
            thisObj.day = "";
            thisObj.activityTodo = {};
        };

        this.resetData();

        this.getPlanTime = function () {
            var planTime = [];
            for (var i = 0 ; i < 24; i++) {
                for (var j = 0 ; j < 31; j += 30) {
                    planTime.push((new Date(1, 0, 1, i, j, 0)).toJSON());
                }
            }

            return planTime;
        };

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

            thisObj.planTime = thisObj.getPlanTime();

        });

        this.LogActivitiy = function ($event, activity) {
            $event.preventDefault();

            if (!activity || activity.done)
                return;

            var howLong = activity.howLong;
            var activityTime = new Date(activity.time);
            angular.forEach(thisObj.activityLogged, function (currentActivity) {

                if (howLong === 0)
                    return;

                var currentActivityTime = new Date(currentActivity.time);
                if (activity.done) {
                    currentActivity.description = activity.description;
                    howLong--;
                } else if (currentActivityTime.getHours() === activityTime.getHours() 
                    && currentActivityTime.getMinutes() === activityTime.getMinutes()) {
                    currentActivity.description = activity.description;
                    howLong--;
                    activity.done = true;
                } else {
                    //
                }
                                
            });

            if (activity.done) {
                // add to list
                var t = new Date(activity.time);
                var hours = t.getHours();
                var minutes = t.getMinutes();
                for (var i = 0; i < howLong; i++) {
                    thisObj.activityLogged.push({ time: (new Date(1, 0, 1, hours, minutes, 0)).toJSON(), description: activity.description, done: true });
                    if (i % 2 == 0) {
                        // add hour
                        hours++;
                        minutes = 0;
                    } else {
                        minutes = (new Date(thisObj.timeSlot)).getMinutes();
                    }
                }
            }

        };

        this.timeToString = u_timeToString;

    }]);

mainControllers.controller('weekSchedule',
    ['Schedule', function (Schedule) {
        var thisObj = this;

        this.resetData = function () {
            thisObj.query = "";
            thisObj.lastTimeStringed = "1901-01-01T00:00:00";
            thisObj.lastTime = new Date(thisObj.lastTimeStringed);
            thisObj.activities = [];
            thisObj.activitySchedule = { timePlan: [] };
        };

        this.resetData();

        Schedule.query(function (data) {
            if (!data) {
                this.resetData();
                return;
            }

            thisObj.activities = data["activities"];
            thisObj.activitySchedule = data["activitySchedule"]["sunday"];
            thisObj.planTimes = thisObj.getPlanTimesFrom(thisObj.getLastTimeFrom(thisObj.activitySchedule.timePlan));
            if (thisObj.planTimes.length > 0)
                thisObj.lastTime = thisObj.planTimes[0];;

        });

        this.getPlanTimesFrom = function (lastTime) {
            var ret = [];
            var date = new Date(lastTime);
            for (var i = date.getHours() ; i < 24; i++) {
                ret.push(new Date(1, 0, 1, i, 0, 0).toJSON());
            }
            return ret;
        };

        this.getLastTimeFrom = function (schedule) {
            var lastActivity = schedule.sort(u_reverse)[0];
            var ltime = new Date(lastActivity.time);
            return new Date(1, 0, 1,
                ltime.getHours() + lastActivity.howLong, ltime.getMinutes(), ltime.getSeconds());

        };

        this.AddToPlan = function ($event, activity) {
            $event.preventDefault();

            if (!activity || thisObj.activities.length === 0)
                return;

            var lastActivity = thisObj.activitySchedule.timePlan.sort(u_reverse)[0];
            var ltime = new Date(lastActivity.time);
            var lastFrom = new Date(1, 0, 1,
                ltime.getHours() + lastActivity.howLong, ltime.getMinutes(), ltime.getSeconds());

            // add to list
            thisObj.activitySchedule.timePlan.push({ time: lastFrom.toJSON(), howLong: activity.howLong, description: activity.description });
            var lastTime = thisObj.getLastTimeFrom(thisObj.activitySchedule.timePlan);
            thisObj.planTimes = thisObj.getPlanTimesFrom(lastTime);
            if (thisObj.planTimes.length > 0)
                thisObj.lastTime = thisObj.planTimes[0];
        };

        this.timeToString = u_timeToString;


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
    ['UserInfo', '$scope', '$location', function (UserInfo, $scope, $location) {
        
        $scope.version = "0.01";
        $scope.appName = "Time Scheduler"
        $scope.appFullName = $scope.appName + " (for lazy people)";
        
        $scope.mailTo = "dante.delfavero@gmail.com";
        $scope.mailToDescription = "dante.delfavero at gmail.com";

        $scope.utenteCorrente = "";
        $scope.dateLogin = "";
        $scope.timeLogin = "";
        
        $scope.userInfo = function() {
            var thisObj = this;

            this.resetData = function () {
                thisObj.userInfo = {};
            };

            this.isUserLoggedIn = function (userInfo) {
                return userInfo != undefined
                    && userInfo.utenteCorrente != undefined 
                    && userInfo.utenteCorrente != "";
            };

            this.isLoggedIn = function () {
                return thisObj.isUserLoggedIn($scope);
            };

            this.logOut = function () {
                thisObj.resetData();
                $location.path('/#/')
            };

            this.logIn = function (userName, password) {

                if (userName === "" || password === "")
                    return;

                UserInfo.query(function (data) {

                    if (!data)
                        return;

                    if (userName === data.userInfo.username
                        && password === data.userInfo.password) {

                        // set data scope
                        $scope.utenteCorrente = data.userInfo.name + " " + data.userInfo.lastName;
                        $scope.dateLogin = data.userInfo.loginHistory.sort()[data.userInfo.loginHistory.length - 1].when;
                        $scope.timeLogin = "";

                        $location.path('/home');
                    } else {
                        // alert("Redirecting for: " + $scope.userInfo.utenteCorrente);
                        $location.path('/signup');
                    }

                    //alert("Logged in: " + $scope.userInfo.isLoggedIn());
                });

            };

            this.resetData();
        };

        $scope.userInfo = new $scope.userInfo();

        //$scope.userInfo.logIn("dante", "dante");
    }]);

      
