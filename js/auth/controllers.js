angular.module('SpamExpertsApp')
    .controller('LoginCtrl', ['$scope', '$state', '$ionicPopup', 'AuthService', 'MessageQueue',
        function($scope, $state, $ionicPopup, AuthService, MessageQueue) {

            $scope.$on('$stateChangeSuccess', function () {
                $scope.data = AuthService.getUserCredentials();
            });

            $scope.toggleRemember = function(remember) {
                AuthService.toggleRemember(remember);
            };

            $scope.credentialChanged = function () {
                AuthService.invalidateToken();
            };

            $scope.login = function(data) {

                var failedPopup = {
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                };

                if (
                    isEmpty(data.hostname) ||
                    isEmpty(data.username) ||
                    isEmpty(data.password)
                ) {
                    $ionicPopup.alert(failedPopup);
                } else {
                    AuthService.login(data.hostname, data.username, data.password, data.remember)
                        .then(function(response) {
                            if (!response.data.token) {
                                $ionicPopup.alert(failedPopup);
                            } else {
                                MessageQueue.remove();
                                $state.go('main.dash', {}, {reload: true});
                            }
                        });
                }
            };
        }
    ]);