import { MODULE_NAME } from '@lumx/angularjs/lumx'

import '../style/lx-icon.scss';

/////////////////////////////

function lxIconDirective() {
    /**
     * Get icon template according to color and size.
     *
     * @return {string} The icon html template.
     */
    function getTemplate() {
        return `
            <i class="lx-icon">
                <svg
                    aria-hidden="true"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                    width="1em"
                >
                    <path fill="currentColor" />
                </svg>
            </i>
        `;
    }

    function link(scope, el, attrs) {
        attrs.$observe('lxPath', (path) => {
            el.find('path').attr('d', path);
        });

        attrs.$observe('lxColor', (color) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-icon--color-\S+/g) || []).join(' ');
            }).addClass(`lx-icon--color-${color}`);
        });

        attrs.$observe('lxSize', (size) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-icon--size-\S+/g) || []).join(' ');
            }).addClass(`lx-icon--size-${size}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: getTemplate,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.icon`).directive('lxIcon', lxIconDirective);

/////////////////////////////

export { lxIconDirective };