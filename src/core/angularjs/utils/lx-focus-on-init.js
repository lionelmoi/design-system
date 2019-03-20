import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function lxFocusOnInitDirective($timeout) {
    'ngInject';

    function link(scope, el) {
        $timeout(() => {
            el.focus();
        });
    }

    return {
        link,
    };
}

/////////////////////////////

angular
    .module(`${MODULE_NAME}.utils.focus-on-init`)
    .directive(`${COMPONENT_PREFIX}FocusOnInit`, lxFocusOnInitDirective);

/////////////////////////////

export { lxFocusOnInitDirective };
