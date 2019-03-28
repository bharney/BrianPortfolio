'use strict';

angular.module('brianPortfolioApp')
    .controller('MainCtrl', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal, $log) {
        var $ctrl = this;
        var size;
        $ctrl.email = {
            EmailID: 0,
            Name: '',
            EmailAddress: '',
            Phone: '',
            Message: ''
        };

        $ctrl.animationsEnabled = true;

        if (window.innerWidth > 724) {
            size = 'md';
        }
        else {
            size = 'sm';
        }

        $ctrl.open = function (size) {
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'contactModal.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                resolve: {
                    email: function () {
                        return $ctrl.email;
                    }
                }
            });

            modalInstance.result.then(function (email) {
                $ctrl.sendEmail(email);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $ctrl.sendEmail = function () {
            $http.post("/Home/Index", { email: $ctrl.email })
                .then(function onSuccess(response) {
                    $scope.email = {};
                }, function onError(err) {
                    console.log.err;
                });
        };
    }]);
angular.module('brianPortfolioApp').controller('ModalInstanceCtrl', ['$scope', '$http', '$uibModalInstance', function ($scope, $http, $uibModalInstance, email) {
    var $ctrl = this;
    $ctrl.email = email;

    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.email);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

