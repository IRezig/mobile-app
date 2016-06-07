angular.module('SpamExpertsApp')
    .controller('IncomingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.incoming,
                    last_count: 0,
                    messages: [],
                    criteriaService: new SearchCriteriaService({
                        direction: GROUPS.incoming
                    })
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
                    messages: [],
                    criteriaService: new SearchCriteriaService({
                        direction: GROUPS.outgoing
                    })
                })
            });

        }
    ]);

angular.module('SpamExpertsApp')
    .controller('CommonMessagesCtrl', ['$scope', '$state', '$timeout', 'MessageQueue', 'messagesService', 'ActionManager',
        function($scope, $state, $timeout, MessageQueue, messagesService, ActionManager) {

            $scope.info = {
                count: 0,
                lastCount: 0
            };

            $scope.noMoreItemsAvailable = false;
            $scope.isOpen = false;

            $scope.loadingEntries = false;

            $scope.$on('refreshEntries', function () {
                MessageQueue.remove();
                messagesService.wipe();
                messagesService.getMessages();
                $scope.messageEntries = messagesService.getDataSet();

                $scope.noMoreItemsAvailable = false;
                $scope.bulkMode = false;
            });

            $scope.$on('$stateChangeSuccess', function () {
                    $scope.messageEntries = messagesService.getDataSet();
                    $scope.messageEntries.fetchMoreItems_(1);

            });


            var actionManager = new ActionManager();

            var barActions = actionManager.getActions('bar');
            var availableActions = actionManager.getActions('actionSheet');
            var tapAction = actionManager.getActions('tapAction');

            $scope.bulkMode = false;
            $scope.selectedCount = messagesService.countSelected();

            $scope.availableActions = availableActions;
            $scope.barActions = barActions;

            $scope.openMessage = function(message) {
                if (!isEmpty(tapAction)) {
                    $state.go('main.message-detail', {
                        message: message,
                        previousState: {
                            group: $state.current.data.group,
                            state: $state.current.data.state
                        }
                    }, {reload: true});
                } else {
                    actionManager.noViewAction();
                }
            };

            $scope.selectEntry = function(index) {
                if (!isEmpty(barActions) || !isEmpty(availableActions)) {
                    messagesService.selectMessage(index);
                    $scope.selectedCount = messagesService.countSelected();
                    $scope.bulkMode = messagesService.isBulkMode();
                } else {
                    actionManager.noAvailableAction();
                }
            };

            $scope.selectAll = function (toggle) {
                messagesService.selectAll(toggle);
                $scope.selectedCount = messagesService.countSelected();
                $scope.bulkMode = messagesService.isBulkMode();
            };

            $scope.processAction = function (action) {
                actionManager.processAction(
                    action,
                    function (action) {
                        messagesService
                            .bulkAction(action.name)
                            .then(function () {
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

    .controller('MessageDetailCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'MessageQueue', 'MessagesService', 'ActionManager',
        function($rootScope, $scope, $state, $timeout, MessageQueue, MessagesService, ActionManager) {

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

            var actionManager = new ActionManager($state.params.previousState.group);
            var availableActions = actionManager.getActions('actionSheet');

            $scope.availableActions = availableActions;

            $scope.hasActions = !isEmpty(availableActions);

            $scope.processAction = function (action) {
                actionManager.processAction(
                    action,
                    function (action) {
                        messageService
                            .bulkAction(action.name, message)
                            .then(function () {
                                $state.go($state.params.previousState.state, {keepMessageQueue: true}, {reload: true});
                                $timeout(function() {
                                    $rootScope.$broadcast('refreshEntries');
                                });
                            });
                    }
                );
            };

        }
    ]);