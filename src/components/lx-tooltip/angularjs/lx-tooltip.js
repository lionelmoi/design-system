import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxTooltipController($element, $timeout, LxDepthService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lxTooltip = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * Delay before showing the tooltip on source element mouse enter.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _HOVER_DELAY = 500;

    /**
     * The tooltip element.
     *
     * @type {element}
     */
    let _hoverTimeout;

    /**
     * The tooltip label element.
     *
     * @type {element}
     */
    // eslint-disable-next-line one-var
    let _tooltip;
    /**
     * The source element mouse enter timeout.
     *
     * @type {Object}
     */
    // eslint-disable-next-line one-var
    let _tooltipLabel;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Set the tooltip position according to the position parameter.
     */
    function _setTooltipPosition() {
        const sourceProps = {
            height: $element.outerHeight(),
            left: $element.offset().left,
            top: $element.offset().top,
            width: $element.outerWidth(),
        };
        const tooltipProps = {
            height: _tooltip.outerHeight(),
            width: _tooltip.outerWidth(),
        };

        if (angular.isUndefined(lxTooltip.position) || lxTooltip.position === 'top') {
            // eslint-disable-next-line no-magic-numbers
            tooltipProps.left = sourceProps.left - tooltipProps.width / 2 + sourceProps.width / 2;
            tooltipProps.top = sourceProps.top - tooltipProps.height;
        } else if (lxTooltip.position === 'bottom') {
            // eslint-disable-next-line no-magic-numbers
            tooltipProps.left = sourceProps.left - tooltipProps.width / 2 + sourceProps.width / 2;
            tooltipProps.top = sourceProps.top + sourceProps.height;
        } else if (lxTooltip.position === 'left') {
            tooltipProps.left = sourceProps.left - tooltipProps.width;
            // eslint-disable-next-line no-magic-numbers
            tooltipProps.top = sourceProps.top + sourceProps.height / 2 - tooltipProps.height / 2;
        } else if (lxTooltip.position === 'right') {
            tooltipProps.left = sourceProps.left + sourceProps.width;
            // eslint-disable-next-line no-magic-numbers
            tooltipProps.top = sourceProps.top + sourceProps.height / 2 - tooltipProps.height / 2;
        }

        _tooltip
            .css({
                left: tooltipProps.left,
                top: tooltipProps.top,
            })
            .addClass('lx-tooltip--is-shown');
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Hide the tooltip on source element mouse leave.
     */
    function hideTooltip() {
        if (angular.isUndefined(_tooltip)) {
            return;
        }

        $timeout.cancel(_hoverTimeout);

        _tooltip.remove();
        _tooltip = undefined;
    }

    /**
     * Show the tooltip on source element mouse enter.
     */
    function showTooltip() {
        if (angular.isDefined(_tooltip)) {
            return;
        }

        const tooltipPoisition =
            angular.isDefined(lxTooltip.position) && lxTooltip.position ? lxTooltip.position : 'top';

        _tooltip = angular.element('<div/>', {
            class: `lx-tooltip lx-tooltip--position-${tooltipPoisition}`,
        });

        _tooltipLabel = angular.element('<span/>', {
            class: 'lx-tooltip__text',
            text: lxTooltip.text,
        });

        LxDepthService.increase();

        _tooltip
            .append(_tooltipLabel)
            .css('z-index', LxDepthService.get())
            .appendTo('body');

        _hoverTimeout = $timeout(_setTooltipPosition, _HOVER_DELAY);
    }

    /////////////////////////////

    lxTooltip.hideTooltip = hideTooltip;
    lxTooltip.showTooltip = showTooltip;
}

/////////////////////////////

function lxTooltipDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        el.on('mouseenter', ctrl.showTooltip);
        el.on('mouseleave', ctrl.hideTooltip);

        scope.$on('$destroy', () => {
            el.off();
        });
    }

    return {
        bindToController: true,
        controller: lxTooltipController,
        controllerAs: 'lxTooltip',
        link,
        restrict: 'A',
        scope: {
            position: '@?nglxTooltipPosition',
            text: '@nglxTooltip',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.tooltip`).directive(`${COMPONENT_PREFIX}Tooltip`, lxTooltipDirective);

/////////////////////////////

export { lxTooltipDirective };
