import { mdiMenuDown, mdiPencil, mdiPlus } from 'LumX/icons';

/////////////////////////////

function DemoButtonController() {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.icons = {
        mdiMenuDown,
        mdiPencil,
        mdiPlus,
    };

    /**
     * Wheter the toggle button is selected or not.
     *
     * @type {Object}
     */
    vm.isSelected = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Toggle chip selected state.
     */
    function toggleSelected() {
        vm.isSelected = !vm.isSelected;
    }

    /////////////////////////////

    vm.toggleSelected = toggleSelected;
}

/////////////////////////////

angular.module('design-system').controller('DemoButtonController', DemoButtonController);

/////////////////////////////

export { DemoButtonController };
