import React, { Fragment } from 'react';

import { mount, shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { build, oneOf } from 'test-data-bot';

import without from 'lodash/without';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';

import { CLASSNAME, DEFAULT_PROPS, Positions, Switch, SwitchProps, Themes } from './Switch';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<SwitchProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The main container.
     */
    root: Wrapper;

    /**
     * The wrapper of the hidden checkbox.
     */
    inputWrapper: Wrapper;

    /**
     * The hidden checkbox.
     */
    input: Wrapper;

    /**
     * The wrapper of the label and helper.
     */
    content: Wrapper;

    /**
     * The helper.
     */
    helper: Wrapper;

    /**
     * The label.
     */
    label: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {ISetupProps} props  The props to use to override the default props of the component.
 * @param  {boolean}     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return {ISetup}      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = true,
): ISetup => {
    const props: SwitchProps = {
        ...propsOverrides,
    };

    const renderer: (el: React.ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Switch {...props} />);

    return {
        root: wrapper.find('div').first(),

        input: wrapper.find('input'),
        inputWrapper: wrapper.find(`.${CLASSNAME}__input-wrapper`),

        content: wrapper.find(`.${CLASSNAME}__content`),
        helper: wrapper.find('span'),
        label: wrapper.find('label'),

        props,
        wrapper,
    };
};

jest.mock('uuid/v4', (): (() => string) => (): string => 'a7b5d992-fe30-4d58-967a-89b8bb7e109c');
describe(`<${Switch.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly without any label', (): void => {
            const { root, inputWrapper, input, content, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);

            expect(inputWrapper).toExist();
            expect(input).toExist();

            expect(content).not.toExist();
        });

        it('should render correctly with only a `label`', (): void => {
            const props: ISetupProps = { children: 'Label' };
            const { root, inputWrapper, input, content, helper, label, wrapper }: ISetup = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);

            expect(inputWrapper).toExist();
            expect(input).toExist();

            expect(content).toExist();
            expect(label).toExist();
            expect(helper).not.toExist();

            expect(label).toHaveText(props.children!);
        });

        it('should render correctly with a `label` and a `helper`', (): void => {
            const props: ISetupProps = { children: 'Label', helper: 'Helper' };
            const { root, inputWrapper, input, content, helper, label, wrapper }: ISetup = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);

            expect(inputWrapper).toExist();
            expect(input).toExist();

            expect(content).toExist();
            expect(label).toExist();
            expect(helper).toExist();

            expect(label).toHaveText(props.children!);
            expect(helper).toHaveText(props.helper!);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { root }: ISetup = setup();

            Object.keys(DEFAULT_PROPS).forEach(
                (prop: string): void => {
                    // tslint:disable-next-line: no-any
                    let defaultProp: any = DEFAULT_PROPS[prop];

                    if (prop === 'checked') {
                        prop = 'unchecked';
                        defaultProp = true;
                    }

                    expect(root).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: prop, value: defaultProp }));
                },
            );
        });

        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                // tslint:disable-next-line: no-any
                checked: true,
                position: oneOf(...without(Object.values(Positions), DEFAULT_PROPS.position)),
                theme: oneOf(...without(Object.values(Themes), DEFAULT_PROPS.theme)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { root }: ISetup = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'checked') {
                        if (modifiedProps[prop]) {
                            expect(root).toHaveClassName(
                                getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop]! }),
                            );
                        } else {
                            expect(root).toHaveClassName(
                                getBasicClass({ prefix: CLASSNAME, type: 'unchecked', value: true }),
                            );
                        }
                    } else {
                        expect(root).toHaveClassName(
                            getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                        );
                    }
                },
            );
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        const onToggle: jest.Mock = jest.fn();

        beforeEach(
            (): void => {
                onToggle.mockClear();
            },
        );

        it('should trigger `onToggle` when toggled', (): void => {
            const { input }: ISetup = setup({ onToggle }, false);

            input.simulate('click');
            expect(onToggle).toHaveBeenCalled();
        });
    });
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        it('should fail when more than one child is given', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    Label
                    <span>Label 2</span>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when anything else than a text or a <span> is given', (): void => {
            mockConsole('debug');

            const children: React.ReactNode = <div>Label</div>;

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should not display the `helper` if no `label` is given', (): void => {
            const props: ISetupProps = { helper: 'Helper' };
            const { content, wrapper }: ISetup = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(content).not.toExist();
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'root', prop: 'root' }, { className: CLASSNAME });
});
