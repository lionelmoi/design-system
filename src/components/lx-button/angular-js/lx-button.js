import '../style/lx-button.scss';

/////////////////////////////

(function IIFE() {
    'use strict';

    /////////////////////////////

    lxButtonDirective.$inject = ['LxThemeConstant'];

    function lxButtonDirective(LxThemeConstant) {
        function getTemplate(el, attrs) {
            var buttonType = angular.isDefined(attrs.lxType) ? attrs.lxType : 'primary';
            var buttonColor = angular.isDefined(attrs.lxColor) ? attrs.lxColor : 'primary';
            var buttonSize = angular.isDefined(attrs.lxSize) ? attrs.lxSize : 'm';
            var buttonTheme = angular.isDefined(attrs.lxTheme) ? attrs.lxTheme : 'light';
            var buttonClass =
                'lx-button lx-button--type-' +
                buttonType +
                ' lx-button--size-' +
                buttonSize +
                ' lx-button--theme-' +
                buttonTheme;

            if (LxThemeConstant.includes(buttonColor)) {
                buttonClass += ' lx-button--color-' + buttonColor;
            } else {
                buttonClass += ' lx-button--color-custom';
            }

            if (isAnchor(attrs)) {
                return '<a class="' + buttonClass + '" ng-transclude></a>';
            } else {
                return '<button class="' + buttonClass + '" ng-transclude></button>';
            }
        }

        function isAnchor(attrs) {
            return (
                angular.isDefined(attrs.href) ||
                angular.isDefined(attrs.ngHref) ||
                angular.isDefined(attrs.ngLink) ||
                angular.isDefined(attrs.uiSref)
            );
        }

        function link(scope, el) {
            var transcludedIcon = el.find('i');
            var tanscludedText = el.find('span');

            if (transcludedIcon.length && !tanscludedText.length) {
                el.addClass('lx-button--shape-circled');
            } else {
                el.addClass('lx-button--shape-contained');
            }

            if (!transcludedIcon.length && !tanscludedText.length) {
                el.wrapInner('<span class="lx-button__text"></span>');
            }

            if (transcludedIcon.length) {
                transcludedIcon.addClass('lx-button__icon');
            }

            if (transcludedIcon.length && tanscludedText.length) {
                transcludedIcon.addClass('lx-button__icon--has-sibling');
            }

            if (tanscludedText.length) {
                tanscludedText.addClass('lx-button__text');
            }
        }

        return {
            link: link,
            replace: true,
            restrict: 'E',
            template: getTemplate,
            transclude: true,
        };
    }

    /////////////////////////////

    angular.module('lumx.button').directive('lxButton', lxButtonDirective);
})();
