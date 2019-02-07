import '../style/lx-text-field.scss';

(function IIFE() {
    'use strict';

    /////////////////////////////

    function lxTextFieldController() {}

    /////////////////////////////

    function lxTextFieldDirective() {
        function link(scope, el) {
            var input = el.find('input');
            var modelController = input.data('$ngModelController');

            input
                .on('focus', function onFocus() {
                    el.addClass('lx-text-field--is-focus');
                })
                .on('blur', function onBlur() {
                    el.removeClass('lx-text-field--is-focus');
                });

            modelController.$$attr.$observe('disabled', function(isDisabled) {
                if (isDisabled) {
                    el.addClass('lx-text-field--is-disabled');
                } else {
                    el.removeClass('lx-text-field--is-disabled');
                }
            });

            scope.$on('$destroy', function onDestroy() {
                input.off();
            });
        }

        return {
            bindToController: true,
            controller: lxTextFieldController,
            controllerAs: 'lxTextField',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {
                error: '=?lxError',
                helper: '@?lxHelper',
                icon: '@?lxIcon',
                label: '@?lxLabel',
                theme: '@?lxTheme',
                valid: '=?lxValid',
            },
            templateUrl: 'src/components/lx-text-field/angular-js/lx-text-field.html',
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.text-field').directive('lxTextField', lxTextFieldDirective);
})();
