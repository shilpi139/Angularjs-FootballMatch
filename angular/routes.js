myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{
        	templateUrl		: 'views/index-view.html',
            controller 		: 'matchesController',
        	controllerAs 	: 'allMatches'
        })
        .when('/single-match',{
        	templateUrl     : 'views/singleMatch-view.html',
        	controller 		: 'singleMatchController',
        	controllerAs 	: 'matchDetails'
        })
        .when('/team-statistics',{
        	templateUrl     : 'views/teamStatistics.html',
        	controller 		: 'teamStatsController',
        	controllerAs 	: 'teamStats'
        })
        .otherwise(
            {
                //redirectTo:'/'
                template   : '<h1>404 page not found</h1>'
            }
        );
}]);