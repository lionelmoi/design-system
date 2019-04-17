// tslint:disable
import React, { Fragment, useState } from 'react';

import { Orientations } from 'LumX/components';

import { Button, ButtonEmphasises, ButtonSizes, ButtonThemes, IconButton, UserBlock, UserBlockTheme } from 'LumX';

import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: UserBlockTheme;
}

const demoFields: string[] = ['Creative developer', 'Denpasar'];

const createSimpleAction: React.FC<ButtonThemes> = (
    theme: ButtonThemes,
): any => ( // Tslint:disable-line.
    <Button
        emphasis={ButtonEmphasises.medium}
        color={theme === ButtonThemes.dark ? 'light' : undefined}
        size={ButtonSizes.s}
        theme={theme}
    >
        Follow
    </Button>
);

const demoActions: string[] = [mdiPhone, mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiSlack];

const createMultipleActions: React.FC<ButtonThemes> = (
    theme: any, // Tslint:disable-line.
) => (
    <Fragment>
        {demoActions.map(
            (demoAction: string, idx: number): IconButton => (
                <IconButton
                    key={`ubAction${idx}`}
                    emphasis={ButtonEmphasises.low}
                    color={theme === ButtonThemes.dark ? 'light' : undefined}
                    icon={demoAction}
                    theme={theme}
                />
            ),
        )}
    </Fragment>
);

const dtProvider = new Array(20).fill(0);

/////////////////////////////

/**
 * The demo for the default <UserBlock>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [minWidth, setMinWidth] = useState(213);
    const [maxWidth, setMaxWidth] = useState((213 * 1.5) >> 0);

    return (
        <Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: 8 }}>
                <div>
                    min-width <input type="number" value={minWidth} onChange={(evt) => setMinWidth(evt.target.value)} />
                </div>
                <div>
                    max-width
                    <input type="number" value={maxWidth} onChange={(evt) => setMaxWidth(evt.target.value)} />
                </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', backgroundColor: '#eeeeee', padding: 8 }}>
                {dtProvider.map((elm, idx) => {
                    return (
                        <div
                            key={'idx' + idx}
                            style={{
                                backgroundColor: `white`,
                                borderRadius: 2,
                                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.12)',
                                display: 'flex',
                                flex: 'auto',
                                justifyContent: 'center',
                                margin: 8,
                                paddingBottom: 16,
                                paddingTop: 25,
                                maxWidth: Number(maxWidth),
                                minWidth: Number(minWidth),
                            }}
                        >
                            <UserBlock
                                theme={theme}
                                name="Guillaume Nachury"
                                fields={demoFields}
                                avatar="http://i.pravatar.cc/128"
                                orientation={Orientations.vertical}
                                onMouseEnter={(): void => console.log('Mouse entered')}
                                onMouseLeave={(): void => console.log('Mouse left')}
                                onClick={(): void => console.log('UserBlock clicked')}
                                simpleAction={createSimpleAction(theme)}
                                multipleActions={createMultipleActions(theme)}
                            />
                        </div>
                    );
                })}
            </div>
        </Fragment>
    );
};
/////////////////////////////

export default {
    view: DemoComponent,
};
