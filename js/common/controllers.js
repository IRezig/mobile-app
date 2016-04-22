angular.module('SpamExpertsApp')
    .controller('AppCtrl', ['$scope', '$state', '$ionicPopup', '$ionicSideMenuDelegate', '$window', 'AuthService', 'MessageQueue', 'MENU_ITEMS',
        function($scope, $state, $ionicPopup, $ionicSideMenuDelegate, $window, AuthService, MessageQueue, MENU_ITEMS) {

            $scope.menuItems = MENU_ITEMS;

            $scope.$on('$stateChangeSuccess', function () {
                $ionicSideMenuDelegate.toggleLeft(false);
                $ionicSideMenuDelegate.toggleRight(false);
            });

            $scope.canDragRight = function() {
                $ionicSideMenuDelegate.canDragContent(true);
            };

            $scope.canDragLeft = function () {
                if (
                    isEmpty($state.current.views['right-side-menu']) &&
                    !$ionicSideMenuDelegate.isOpenLeft()
                ) {
                    $ionicSideMenuDelegate.canDragContent(false);
                    $ionicSideMenuDelegate.toggleRight(false);
                }
            };

            $scope.removeQueueMessage = function(item) {
                delete $scope.messageQueue[item];
                MessageQueue($scope.messageQueue);
            };

            $scope.logout = function() {
                $ionicPopup
                    .confirm({
                        title: 'Confirm action',
                        template: 'Are you sure you want to log out?'
                    })
                    .then(function(choice) {
                        if (choice) {
                            AuthService.logout();
                            $state.go('login');
                            $window.location.reload();
                        }
                    });
            };


        }
    ]);
