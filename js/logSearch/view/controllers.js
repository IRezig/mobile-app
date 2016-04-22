angular.module('SpamExpertsApp')
    .controller('IncomingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.incoming,
                    last_count: 0,
                    messages: []
                }),
                criteriaService: new SearchCriteriaService({
                    direction: GROUPS.incoming,
                    searchCriteria: {}
                })
            });

        }
    ]);

angular.module('SpamExpertsApp')
    .controller('OutgoingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.outgoing,
                    last_count: 0,
                    messages: []
                }),
                criteriaService: new SearchCriteriaService({
                    direction: GROUPS.outgoing,
                    searchCriteria: {}
                })
            });

        }
    ]);

angular.module('SpamExpertsApp')
    .controller('CommonMessagesCtrl', ['$scope', '$state', '$timeout', '$ionicScrollDelegate', 'messagesService', 'criteriaService', 'actionManager',
        function($scope, $state, $timeout, $ionicScrollDelegate, messagesService, criteriaService, actionManager) {

            $scope.info = {
                count: 0,
                lastCount: 0
            };

            $scope.noMoreItemsAvailable = false;

            $scope.loadingEntries = false;

            $scope.$on('refreshEntries', function () {
                messagesService.wipe();
                $scope.messageEntries = messagesService.getMessages();
                $scope.noMoreItemsAvailable = false;
                $ionicScrollDelegate.resize();
            });

            $scope.doRefresh = function() {
                $scope.loadingEntries = true;

                var criteria = criteriaService.getSearchCriteria();

                criteria.until = criteriaService.getDate();
                criteria.refresh = true;
                criteria.last_count = messagesService.getLastCount();

                messagesService.fetch(criteria)
                    .then(function () {
                        $scope.messageEntries = messagesService.getMessages();

                        $scope.info.count = messagesService.count();
                        $scope.info.lastCount = messagesService.getLastCount();

                        $scope.loadingEntries = false;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            };

            $scope.loadMoreData = function() {
                $scope.loadingEntries = true;

                var criteria = criteriaService.getSearchCriteria();

                criteria.refresh = false;
                criteria.offset = messagesService.count();

                messagesService.fetch(criteria)
                    .then(function () {
                        var count = messagesService.count();
                        var lastCount = messagesService.getLastCount();
                        $scope.messageEntries = messagesService.getMessages();

                        $scope.info.count = count;
                        $scope.info.lastCount = lastCount;

                        if (count == lastCount) {
                            $scope.noMoreItemsAvailable = true;
                        }

                        $scope.loadingEntries = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };

            $scope.openMessage = function(message) {
                $state.go('main.message-detail', {
                    message: message,
                    previousState: {
                        group: $state.current.group,
                        state: $state.current.name
                    }
                }, {reload: true});
            };

            $scope.bulkMode = false;
            $scope.selectedCount = messagesService.countSelected();

            $scope.selectEntry = function(index) {
                messagesService.selectMessage(index);
                $scope.selectedCount = messagesService.countSelected();
                $scope.bulkMode = messagesService.isBulkMode();
            };

            $scope.selectAll = function (toggle) {
                messagesService.selectAll(toggle);
                $scope.selectedCount = messagesService.countSelected();
                $scope.bulkMode = messagesService.isBulkMode();
            };

            var availableActions = actionManager.getActions('actionSheet');
            $scope.barActions = actionManager.getActions('bar');

            $scope.processAction = function (action) {
                actionManager.processAction(
                    (isEmpty(action) ? availableActions : action),
                    function (action) {
                        messagesService
                            .bulkAction(action.name)
                            .then(function () {
                                $state.go($state.current, {}, {reload: true});
                                $timeout(function() {
                                    $scope.$broadcast('refreshEntries');
                                });
                                $scope.bulkMode = false;
                            });
                    }
                );
            };

        }
    ])

    .controller('MessageDetailCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'MessageQueue', 'MessagesService', 'actionManager',
        function($rootScope, $scope, $state, $timeout, MessageQueue, MessagesService, actionManager) {

            var message = angular.copy($state.params.message);
            if (isEmpty(message)) {
                $state.go('main.dash', {}, {reload: true});
                return;
            }

            var messageService = new MessagesService({
                direction: $state.params.previousState.group,
                messageParts: {}
            });

            $scope.message = message;

            $scope.showRaw = false;

            $scope.toggleRaw = function() {
                $scope.showRaw = !$scope.showRaw;
            };

            $scope.back = function () {
                $state.go($state.params.previousState.state);
            };

            messageService.viewMessage(message).then(function() {
                $scope.message = messageService.getMessageParts();
            });

            var availableActions = actionManager.getActions('actionSheet');

            $scope.processAction = function () {
                actionManager.processAction(
                    availableActions,
                    function (action) {
                        messageService
                            .bulkAction(action.name, message)
                            .then(function () {
                                $state.go($state.params.previousState.state, {}, {reload: true});
                                $timeout(function() {
                                    $rootScope.$broadcast('refreshEntries');
                                });
                            });
                    }
                );
            };

        }
    ]);