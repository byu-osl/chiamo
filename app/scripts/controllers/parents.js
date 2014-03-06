'use strict';

angular.module('chiamoApp')
  .controller('ParentsCtrl', function ($scope,$window,FS,User) {
    FS.user({},function(u) {
      console.log(u.users[0].treeUserId);
      if (u.users[0].displayName !== undefined) {
	$scope.name = u.users[0].contactName;
      } else if (u.users[0].contactName !== undefined) {
	$scope.name = u.users[0].contactName;
      }
      User.setPerson();
      console.log(User.getParents(User.getPersonID()));
      var parents = User.getParents(User.getPersonID());
      console.log('Parents',parents);
      $scope.parents = parents;
    }, function() {
      $window.location.href = '/#/login';
    });
    }
  );
