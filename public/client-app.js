'use strict';

angular
  .module('watson-adventure', [])
  .controller('ConversationController', ['$scope', '$q', '$anchorScroll', '$http', function($scope, $q, $anchorScroll, $http) {
    var vm = this;
    vm.symptoms = {};
    vm.finished = false;

    vm.conversation = [
    ];

    vm.talkToWatson = function(message) {
      vm.watsonTyping = true;

      var deferred = $q.defer();

      var options = {
        data : {
          input : {
            text : message
          },
          context : vm.context
        }
      };
      $http.post('/message', options).then(
        function success (response) {
          console.log(response);
          if (response.data.output.text) {
            vm.conversation.unshift({
              who: 'watson',
              text: response.data.output.text
            });
            vm.context = response.data.context;
            if (vm.context.freedom || vm.context.dead) {
              vm.finished = true;
            }
          } else {
            deferred.resolve('Sorry the connection dropped.  What was the last thing you said?');
          }
          vm.watsonTyping = false;
        },
        function failure (error) {
          console.log(error);
          vm.watsonTyping = false;
          deferred.resolve('Sorry the connection dropped.  What was the last thing you said?');
        }
      );

      return deferred.promise;
    };

    vm.talkToWatson('');

}]);
