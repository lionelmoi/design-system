import { MODULE_NAME } from '@lumx/angularjs/lumx'

import '../style/lx-dialog.scss';
import template from './lx-dialog.html';

/////////////////////////////

function lxDialogController(
    $element,
    $rootScope,
    $scope,
    $timeout,
    LxDepthService,
    LxEventSchedulerService,
    LxFocusTrapService,
) {
    // eslint-disable-next-line consistent-this
    const lxDialog = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The escape key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _ESCAPE_KEY_CODE = 27;

    /**
     * The duration before checking scroll end again.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _SCROLL_CHECK_TIMEOUT = 500;

    /**
     * The dialog open/close transition duration.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _TRANSITION_DURATION = 400;

    /**
     * The dialog.
     *
     * @type {Element}
     */
    const _dialog = $element;

    /**
     * The dialog content.
     *
     * @type {Element}
     */
    let _dialogContent;

    /**
     * The dialog black filter.
     *
     * @type {Element}
     */
    const _dialogFilter = angular.element('<div/>', {
        class: 'lx-dialog-filter',
    });

    /**
     * The event scheduler id.
     *
     * @type {string}
     */
    let _idEventScheduler;

    /**
     * Whether the dialog is an alert dialog or not.
     *
     * @type {boolean}
     */
    let _isAlertDialog = false;

    /**
     * Whether the dialog is a confirm dialog or not.
     *
     * @type {boolean}
     */
    let _isConfirmDialog = false;

    /**
     * The dialog parent element.
     *
     * @type {Element}
     */
    const _parentElement = _dialog.parent();

    /**
     * The source element.
     *
     * @type {element}
     */
    let _sourceEl;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The dialog identifier.
     *
     * @type {string}
     */
    lxDialog.id = undefined;

    /**
     * Whether the dialog is open or not.
     *
     * @type {boolean}
     */
    lxDialog.isOpen = false;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Check if user srcolls to the ind of the dialog content.
     */
    function _checkScrollEnd() {
        if (_dialogContent.scrollTop() + _dialogContent.innerHeight() < _dialogContent[0].scrollHeight) {
            return;
        }

        $rootScope.$broadcast('lx-dialog__scroll-end', lxDialog.id);

        _dialogContent.off('scroll', _checkScrollEnd);

        $timeout(function waitBeforeCheckingScrollAgain() {
            _dialogContent.on('scroll', _checkScrollEnd);
        }, _SCROLL_CHECK_TIMEOUT);
    }

    /**
     * Close the current dialog.
     */
    function _close() {
        if (!lxDialog.isOpen) {
            return;
        }

        if (angular.isDefined(_idEventScheduler)) {
            LxEventSchedulerService.unregister(_idEventScheduler);
            _idEventScheduler = undefined;
        }

        $rootScope.$broadcast('lx-dialog__close-start', lxDialog.id);

        _dialog.addClass('lx-dialog--is-hidden');
        _dialogFilter.addClass('lx-dialog-filter--is-hidden');

        if (angular.isDefined(_sourceEl)) {
            _sourceEl.focus();
        }

        $timeout(function onDialogCloseEnd() {
            if (_isAlertDialog || _isConfirmDialog) {
                _dialog.remove();
            } else {
                _dialog.hide().appendTo(_parentElement);
            }

            _dialogFilter.remove();

            _dialog.removeClass('lx-dialog--is-hidden');
            _dialogFilter.removeClass('lx-dialog-filter--is-hidden');

            lxDialog.isOpen = false;

            $rootScope.$broadcast('lx-dialog__close-end', lxDialog.id);
        }, _TRANSITION_DURATION);
    }

    /**
     * Close dialog on echap key up.
     *
     * @param {Event} evt The key up event.
     */
    function _onKeyUp(evt) {
        if (evt.keyCode === _ESCAPE_KEY_CODE) {
            _close();
        }

        evt.stopPropagation();
    }

    /**
     * Open the current dialog.
     *
     * @param {Object} params An optional object that holds extra parameters.
     */
    function _open(params) {
        if (lxDialog.isOpen) {
            return;
        }

        LxDepthService.increase();

        _dialogFilter
            .css('z-index', LxDepthService.get())
            .appendTo('body')
            .show();

        if (angular.isUndefined(lxDialog.autoClose) || lxDialog.autoClose) {
            _dialogFilter.on('click', () => {
                _close();
            });
        }

        if (angular.isUndefined(lxDialog.escapeClose) || lxDialog.escapeClose) {
            _idEventScheduler = LxEventSchedulerService.register('keyup', _onKeyUp);
        }

        _dialog
            .css('z-index', LxDepthService.get() + 1)
            .appendTo('body')
            .show();

        $timeout(function onDialogOpenStart() {
            $rootScope.$broadcast('lx-dialog__open-start', lxDialog.id, params);

            lxDialog.isOpen = true;
            LxFocusTrapService.activate(_dialog);

            $timeout(function onDialogContentDisplay() {
                _dialogContent = _dialog.find('.lx-dialog__content');
                _dialogContent.on('scroll', _checkScrollEnd);
            });
        });

        $timeout(function onDialogOpenEnd() {
            $rootScope.$broadcast('lx-dialog__open-end', lxDialog.id, params);
        }, _TRANSITION_DURATION);
    }

    /**
     * Register the source element that triggered the dialog.
     *
     * @param {element} sourceEl The source element that triggered the dialog.
     */
    function _registerSource(sourceEl) {
        _sourceEl = sourceEl;
    }

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Open a given dialog.
     *
     * @param {Event}  evt      The dropdown open event.
     * @param {string} dialogId The dialog identifier.
     * @param {Object} params   An optional object that holds extra parameters.
     */
    $scope.$on('lx-dialog__open', (evt, dialogId, params) => {
        if (dialogId === lxDialog.id) {
            _open(params);

            if (angular.isDefined(params) && angular.isDefined(params.isAlertDialog) && params.isAlertDialog) {
                _isAlertDialog = true;
            }

            if (angular.isDefined(params) && angular.isDefined(params.isConfirmDialog) && params.isConfirmDialog) {
                _isConfirmDialog = true;
            }

            if (angular.isDefined(params) && angular.isDefined(params.source) && params.source) {
                _registerSource(angular.element(params.source));
            }
        }
    });

    /**
     * Close a given dialog.
     *
     * @param {Event}  evt      The dropdown open event.
     * @param {string} dialogId The dialog identifier.
     */
    $scope.$on('lx-dialog__close', (evt, dialogId) => {
        if (dialogId === lxDialog.id || dialogId === undefined) {
            _close();
        }
    });

    /**
     * Close the current dialog on destroy.
     */
    $scope.$on('$destroy', () => {
        _close();
    });
}

/////////////////////////////

function lxDialogDirective() {
    function link(scope, el, attrs, ctrl) {
        attrs.$observe('id', (newId) => {
            ctrl.id = newId;
        });
    }

    return {
        bindToController: true,
        controller: lxDialogController,
        controllerAs: 'lxDialog',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            autoClose: '=?lxAutoClose',
            escapeClose: '=?lxEscapeClose',
            size: '@?lxSize',
        },
        template,
        transclude: {
            content: 'lxDialogContent',
            footer: '?lxDialogFooter',
            header: '?lxDialogHeader',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.dialog`).directive('lxDialog', lxDialogDirective);

/////////////////////////////

export { lxDialogDirective };