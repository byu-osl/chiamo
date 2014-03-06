'use strict';

angular.module('chiamoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'chiamoServices'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/parents', {
        templateUrl: 'views/parents.html',
        controller: 'ParentsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


var services = angular.module('chiamoServices', ['ngResource']);

services.service('User', function($http, $location) {
  return {

    setPerson: function() {

      $http({method: 'GET',
	     url: 'https://sandbox.familysearch.org/platform/tree/current-person?access_token=' + localStorage.getItem('token'),
	    }).
	success(function(data, status, headers, config) {
	  localStorage.setItem('personURL','https://sandbox.familysearch.org' + headers('Content-Location'));
	  var location = headers('Content-Location').split('/');
	  localStorage.setItem('personID',location[location.length-1]);
//	  $http({method: 'GET',
//		 url: 'https://sandbox.familysearch.org' + headers('Content-Location'),
//		 headers : {'Accept':'application/x-gedcomx-v1+json,application/x-fs-v1+json',
//			    'Authorization' : 'Bearer ' +localStorage.getItem('token')}
//	    }).
//	    success(function(data, status, headers, config) {
	      
//	    });
	});
    },

    getPersonID: function() {
      return localStorage.getItem('personID');
    },

    getParents: function(personID) {
      $http({method: 'GET',
	     url: 'https://sandbox.familysearch.org/platform/tree/persons-with-relationships?person=' + personID + '&persons',
	     headers : {'Accept':'application/x-gedcomx-v1+json,application/x-fs-v1+json',
			'Authorization' : 'Bearer ' +localStorage.getItem('token')}
	    }).
	success(function(data,status,headers,config) {
	  var relationships = data.childAndParentsRelationships;
	  for (var i = 0; i < relationships.length; i++) {
	    var childID = relationships[i].child.resourceId;
	    var fatherID = relationships[i].father.resourceId;
	    var motherID = relationships[i].mother.resourceId;
	    if (childID === undefined) {
	      continue;
	    }
	    if (childID === personID) {
	      console.log(fatherID,motherID);
	      return {'motherID':motherID,'fatherID':fatherID};
	    }
	    return undefined;
	  }
	}).
	error(function(data,status,headers,config) {
	  return undefined;
	});
    },

    isAuthenticated: function() {
      return (localStorage.getItem('token') !== undefined);
    },

    getToken: function() {
      return localStorage.getItem('token');
    },
    
    setToken: function(token) {
      localStorage.setItem('token', token);
    },

    endSession: function() {
      localStorage.removeItem('token');
      $location.path('/login');
    }
  };
});

//services.factory('user', function() {
//  return {
//    user: {}
//  };
//});

services.factory('FS', ['$resource','User',function($resource,User) {
  return $resource('',
		   {},
		   { discovery: { method:'GET',
				  url: 'https://familysearch.org/.well-known/app-meta.json'
				},

		     login: { method:'POST',
			      url: 'https://sandbox.familysearch.org/cis-web/oauth2/v3/token',
			      headers : {'Content-Type': 'application/x-www-form-urlencoded'},
			    },
		     user: { method:'GET',
			     url: 'https://sandbox.familysearch.org/platform/users/current',
			     headers : {'Accept':'application/x-gedcomx-v1+json,application/x-fs-v1+json',
					'Authorization' : 'Bearer ' + User.getToken()},
			   },
		     userPerson: { method:'GET',
				   url: 'https://sandbox.familysearch.org/platform/tree/current-person',
				   headers : {'Accept':'application/x-gedcomx-v1+json,application/x-fs-v1+json',
					      'Authorization' : 'Bearer ' + User.getToken()},
				 },
		   }
		  );
}]);
