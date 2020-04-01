var appButton = angular.module("loginButton", []);

appButton.controller("loginControl", ["$scope", "$window", function($scope, $window) {
    $scope.enterSite = function() {
        $window.location.href = "../app/dashboard/dashboard.component.html";
    }
}]);