'use strict';

angular.module('chiamoApp')
  .controller('LoginCtrl', ['$scope', 'FS', 'User', '$window', function ($scope,FS,User,$window) {
    $scope.login = function() {
      FS.login($.param({username:$scope.user.name,
			password:$scope.user.password,
			grant_type:'password',
			client_id:'WCQY-7J1Q-GKVV-7DNM-SQ5M-9Q5H-JX3H-CMJK'
		       }),
	       function(data) {
		 $window.location.href = '/#/parents';
		 User.setToken(data.token);
	       },
	       function() {
		 $scope.user.error = 'Invalid username or password';
	       });
    };
  }]);
