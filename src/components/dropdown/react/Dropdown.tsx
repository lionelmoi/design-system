import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps, getRootClassName } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IDropdownProps extends IGenericProps {}
type DropdownProps = IDropdownProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<DropdownProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Dropdown`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////

/**
 * Displays a dropdown.
 *
 * @return {React.ReactElement} The component.
 */
const Dropdown: React.FC<DropdownProps> = ({
    children,
    className = '',
    ...props
}: DropdownProps): React.ReactElement => (
    <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
        {children}
    </div>
);
Dropdown.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Dropdown, DropdownProps };
