var myApp = angular.module('footballApp', ['ngRoute','ui.bootstrap', 'ngResource','angularUtils.directives.dirPagination']);

myApp.controller("matchesController", ['$http', '$location', function($http,$location){
 
	var main = this;
	main.singleMatchDetail = function(match) {
    	if(match) {
    		window.localStorage.setItem('singleMatchDate', JSON.stringify(match));
    		$location.path( "/single-match");
    	}
    }// single match detail function ends here

    main.isDisplayed = true;
	main.predicate = 'team1';  
    main.reverse = true;  
    main.currentPage = 1; 	
	this.firstBaseUrl = 'http://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json';
	this.secondBaseUrl = 'http://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json';

	main.matchList = [];

	this.loadAllMatches = function(){
		main.yearSelected = '';
		main.monthSelected = '';
	    $http({
	        method: 'GET',
	        url: main.firstBaseUrl
	    }).then(function successCallback(response) {
			main.teamList = [];
        	angular.forEach(response.data.rounds, function(value, key){
		    	angular.forEach(value, function(value1, key1){
		    		if(key1 === "matches") {
					    angular.forEach(value1, function(value2, key2){
					    	value2.name = value.name;
					    	main.matchList.push(value2);
					    	main.teamList.push({'teamName' : value2.team1.name});
					    }); 
					}
				});//first response fetch and pushed in an array
			});
			$http({
		        method: 'GET',
		        url: main.secondBaseUrl
	    	}).then(function successCallback(response) {
	    		angular.forEach(response.data.rounds, function(data, k){
			    	angular.forEach(data, function(data1, k2){
			    		if(k2 === "matches") {
						    angular.forEach(data1, function(data3, k3){
						    	data3.name = data.name;
						    	if(data3.score1 == null || data3.score1 === "") {
						    		data3.score1 = 0;
						    	}
						    	if(data3.score2 == null) {
						    		data3.score2 = 0;
						    	}
						    	main.matchList = main.matchList.concat(data3);
						    }); 
						}
					});//second response fetch and is merged with with previous array
				});
		    	main.totalItems = main.matchList.length;

		        // start of date picker
				main.clear = function () {
					main.dt = null;
				};
				main.open = function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					main.opened = true;
				};
				main.open1 = function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					main.opened2 = true;
				};
				main.dateOptions = {
					formatYear: 'yy',
					startingDay: 1
				};
				main.format = 'yyyy-MM-dd';
		       //end of date picker

		        main.monthPickerOption = {
				    formatYear: 'yy',
	    			startingDay: 1
				};
				
	  			main.monthFormat = 'MM';
				main.openMonthPicker = function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					main.opened3 = true;
				};

				main.yearPickerOption = {
				    formatYear: 'yy',
	    			startingDay: 1
				};
				
	  			main.yearFormat = 'yyyy';
				main.openYearPicker = function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					main.opened4 = true;
				};

	    	}, function errorCallback(response) {
		        alert("some error occurred. Check the console.");
		        console.log(response);
		    });//second json url fetch request ends here
			main.isFiltered = false; //initially the boolean will be set as false
	    }, function errorCallback(response) {
	        alert("some error occurred. Check the console.");
	        console.log(response);
	    });// first json url fetch request ends here

    }// end load all football matches


    this.filterByMonthSelected = function() {
    	if(main.monthSelected) {
	    	var filteredDate = new Date(main.monthSelected),
		    fmonth = ("0" + (filteredDate.getMonth()+1)).slice(-2);
		    if(!main.monthSelected) return true;

		    if(main.filteredMonthList) {
				main.matchList = main.filteredMonthList;
			}
	    	main.filteredMonthList = main.matchList; //is assigned to different array
		    main.unfilteredMonthList = main.matchList;
	        main.matchList = []; //is empty to add filtered values to the array
	    	angular.forEach(main.filteredMonthList, function(obj){
	    		var elementDate = new Date(obj.date),
	   			emonth = ("0" + (elementDate.getMonth()+1)).slice(-2);
	    		if(emonth === fmonth){
	    			main.matchList.push(obj); //the filtered data is pushed to the main array 
	    									  //which is initially kept empty before iteration
	    		}
		    });
		    $('#dateModal').modal('hide');
		    
		    main.isFiltered = true;
    	}
	    if(main.filteredMonthList && !main.monthSelected) {
			main.matchList = main.unfilteredMonthList;
		}
	}

	this.filterByYearSelected = function() {
		if(main.yearSelected) {
			if(main.filteredYearList) {
				main.matchList = main.filteredYearList;
			}
			var filteredDate = new Date(main.yearSelected),
		    fYear = filteredDate.getFullYear();

		    main.filteredYearList = main.matchList; //is assigned to different array
		    main.unfilteredYearList = main.matchList;
	        main.matchList = []; //is empty to add filtered values to the array
	    	angular.forEach(main.filteredYearList, function(obj){
	    		var elementDate = new Date(obj.date),
		    	eYear = elementDate.getFullYear();
	    		if(eYear === fYear){
	    			main.matchList.push(obj); //the filtered data is pushed to the main array 
	    									  //which is initially kept empty before iteration
	    		}
		    });
		    $('#dateModal').modal('hide');
		   
		    main.isFiltered = true;
		}
		if(main.filteredYearList && !main.yearSelected) {
			main.matchList = main.unfilteredYearList;
		}
	}

    this.filterByDateRange = function() {
    	if(main.startDate && main.endDate) {
    		if(main.filteredList) {
				main.matchList = main.filteredList;
			}
    		var firstDate = new Date(main.startDate),
	        fmonth = ("0" + (firstDate.getMonth()+1)).slice(-2),
	        fday  = ("0" + firstDate.getDate()).slice(-2);
	        var startDate = [ firstDate.getFullYear(), fmonth, fday ].join("-"); //converted to suitable format

	        var secondDate = new Date(main.endDate),
	        smonth = ("0" + (secondDate.getMonth()+1)).slice(-2),
	        sday  = ("0" + secondDate.getDate()).slice(-2);
	        var endDate = [ secondDate.getFullYear(), smonth, sday ].join("-");//converted to suitable format

	        main.filteredList = main.matchList; //is assigned to different array
	        main.unfilteredDateList = main.matchList;
	        main.matchList = []; //is empty to add filtered values to the array
	    	angular.forEach(main.filteredList, function(obj){
	    		if(obj.date >= startDate && obj.date <= endDate){
	    			main.matchList.push(obj); //the filtered data is pushed to the main array 
	    									  //which is initially kept empty before iteration
	    		}
		    });
		    $('#dateModal').modal('hide');
		    
	        main.isFiltered = true; // set true to show the unfiltered button
    	}
    	if(main.filteredList && !main.startDate  && !main.endDate) {
			main.matchList = main.unfilteredDateList;
		}
    }//end of filter by date range

    main.toggle = true;
    this.showAndHide = function() {
		main.toggle = main.toggle === false ? true: false;
	}

	this.showUnfilteredList = function() {
		if(main.unfilteredDateList) {
			main.matchList = main.unfilteredDateList;
		}
		if(main.unfilteredMonthList) {
			main.matchList = main.unfilteredMonthList;
		}
		if(main.unfilteredYearList) {
			main.matchList = main.unfilteredYearList;
		}
	}

	this.clearPrevValues = function() {
		main.monthSelected = null;
		main.yearSelected = null;
		main.startDate = null;
		main.endDate = null;
	}// when the filter pop is opened again, there should be no values in the context

    this.loadAllMatches();
}]); 

myApp.controller("singleMatchController", ['$http', '$filter', function($http, $filter){
	var main = this;
	main.singleMatchDetail = JSON.parse(localStorage.getItem('singleMatchDate'));
}]);

myApp.controller("teamStatsController", ['$http', '$filter', function($http, $filter){
	var main = this;
	this.firstBaseUrl = 'http://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json';
	this.secondBaseUrl = 'http://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json';

	main.mainList = [];
	this.loadTeamWiseStatistics = function(){
		$http({
        method: 'GET',
        url: main.firstBaseUrl
	    }).then(function successCallback(response) {
	    	angular.forEach(response.data.rounds, function(value, key){
		    	angular.forEach(value, function(value1, key1){
		    		if(key1 === "matches") {
					    angular.forEach(value1, function(value2, key2){
					    	main.mainList.push(value2);
					    }); 
					}
				});
			});

			$http({
		        method: 'GET',
		        url: main.secondBaseUrl
	    	}).then(function successCallback(response) {
	    		angular.forEach(response.data.rounds, function(data, k){
			    	angular.forEach(data, function(data1, k2){
			    		if(k2 === "matches") {
						    angular.forEach(data1, function(data3, k3){
						    	data3.name = data.name;
						    	if(data3.score1 == null || data3.score1 === "") {
						    		data3.score1 = 0;
						    	}
						    	if(data3.score2 == null) {
						    		data3.score2 = 0;
						    	}
						    	main.mainList = main.mainList.concat(data3);
						    }); 
						}
					});
				});

		    	//new code started for team wise analysis
			    count = {};
			    //this loop fetch's the unique team name from the list of team name
			    for(var i=0; i<main.mainList.length; i++) {
			    	var team1 = main.mainList[i].team1.name;
			    	var team2 = main.mainList[i].team2.name;
			    	count[team1] = count[team1] + 1 || 1;
			    	count[team2] = count[team2] + 1 || 1;
			    }

			    main.teamWiseStatistics = [];
			    //HERE: First the uniques team list is iterated and then the whole array.
			    // The uniques team will be compared one by one with the teams in the array containing all teams list.
			    // Accordingly the values will be pushed in a new array
			    //When  a team name is repeated, the previous object is deleted	 and a new with new values is created to 
			    // avoid duplication.
			    for(var j in count){
			    	var counter = 0;
			    	for(var k=0; k<main.mainList.length; k++) {
				    	var team1 = main.mainList[k].team1.name;
				    	var team2 = main.mainList[k].team2.name;
				    	var apiTeam1Score = main.mainList[k].score1;
						var apiTeam2Score = main.mainList[k].score2;
						var team1WonCount = 0;
				    	var team1LostCount = 0;
				    	var team2WonCount = 0;
				    	var team2LostCount = 0;
				    	var team1DrawCount = 0;
				    	var team2DrawCount = 0;

						if(apiTeam1Score > apiTeam2Score) {
							team1WonCount = 1;team2LostCount = 1;
						}
						if(apiTeam2Score > apiTeam1Score) {
							team2WonCount = 1;team1LostCount = 1;
						}
						if(apiTeam2Score === apiTeam1Score) {
							team1DrawCount = 1; team2DrawCount = 1;
						}

						if(team1.indexOf(j) != -1) {
							if(counter === 0) {
								main.teamWiseStatistics.push({"teamName" : j, "totalScore": apiTeam1Score, "totalPlayed": count[j], "matchesWon": team1WonCount, "matchesLost" : team1LostCount, "matchesDraw" : team1DrawCount});
								counter++;
							}else {
								if(main.teamWiseStatistics.length > 0) {
									for(var l=0; l<main.teamWiseStatistics.length; l++) {
										if(main.teamWiseStatistics[l].teamName === j) {
											var prevScore = main.teamWiseStatistics[l].totalScore;

											var matchesWon = main.teamWiseStatistics[l].matchesWon;
											var matchesLost = main.teamWiseStatistics[l].matchesLost;
											var matchesDraw = main.teamWiseStatistics[l].matchesDraw || 0;

											main.teamWiseStatistics.splice(l,1);
											main.teamWiseStatistics.push({"teamName" : j, "totalScore": prevScore+apiTeam1Score, "totalPlayed": count[j], "matchesWon": matchesWon+team1WonCount, "matchesLost" : matchesLost+team1LostCount, "matchesDraw" : matchesDraw+team1DrawCount});
											break;
										}
										var results = $filter('filter')(main.teamWiseStatistics, {teamName : j}, true);
										if(results.length === 0) {
											main.teamWiseStatistics.push({"teamName" : j, "totalScore": apiTeam1Score, "totalPlayed": count[j], "matchesWon": team1WonCount, "matchesLost" : team1LostCount, "matchesDraw" : team1DrawCount});
											counter++;
											break;
										}
									}
								}
							}
						}

						if(team2.indexOf(j) != -1) {
							if(main.teamWiseStatistics.length > 0) {
								for(var l=0; l<main.teamWiseStatistics.length; l++) {
									if(main.teamWiseStatistics[l].teamName === j) {
										var prevScore = main.teamWiseStatistics[l].totalScore;

										var matchesWon = main.teamWiseStatistics[l].matchesWon;
										var matchesLost = main.teamWiseStatistics[l].matchesLost;
										var matchesDraw = main.teamWiseStatistics[l].matchesDraw || 0;

										main.teamWiseStatistics.splice(l,1);
										main.teamWiseStatistics.push({"teamName" : j, "totalScore": prevScore+apiTeam2Score, "totalPlayed": count[j], "matchesWon": matchesWon+team2WonCount, "matchesLost" : matchesLost+team2LostCount, "matchesDraw" : matchesDraw+team2DrawCount});
										break;
									}
									var results = $filter('filter')(main.teamWiseStatistics, {teamName : j}, true);
									if(results.length === 0) {
										main.teamWiseStatistics.push({"teamName" : j, "totalScore": apiTeam2Score, "totalPlayed": count[j], "matchesWon": team2WonCount, "matchesLost" : team2LostCount, "matchesDraw" : team2DrawCount});
										counter++;
										break;
									}
								}
							}else {
								main.teamWiseStatistics.push({"teamName" : j, "totalScore": apiTeam2Score, "totalPlayed": count[j], "matchesWon": team2WonCount, "matchesLost" : team2LostCount, "matchesDraw" : team2DrawCount});
								counter++;
							}
						}

					}
			    }
			},  function errorCallback(response) {
		        alert("some error occurred. Check the console.");
		        console.log(response);
		    });
		},  function errorCallback(response) {
	        alert("some error occurred. Check the console.");
	        console.log(response);
	    });
	}
	this.loadTeamWiseStatistics();
}]);
