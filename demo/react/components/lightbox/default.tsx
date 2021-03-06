import React, { Fragment, useCallback, useRef, useState } from 'react';

import {
    Button,
    ImageBlock,
    ImageBlockCaptionAlignments,
    ImageBlockProps,
    Lightbox,
    LightboxTheme,
    Slideshow,
    SlideshowItem,
    Themes,
} from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: LightboxTheme;
}

/////////////////////////////

const imageBlockDemoProps: Partial<ImageBlockProps> = {
    captionAlign: ImageBlockCaptionAlignments.center,
    description: 'What an image',
    fillHeight: true,
    tags: ['#tag1', '#tag2', '#tag3'],
    theme: Themes.dark,
    title: 'Nice Image',
};

/**
 * The demo for the default <Lightbox>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [isOpened, setIsOpened]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    // tslint:disable-next-line: no-any
    const triggerElement: React.RefObject<any> = useRef(null);

    const onOpenModal: () => void = useCallback(() => {
        // Do something.
    }, []);

    const onCloseModal: () => void = useCallback(() => {
        // Do something.
        setIsOpened(false);
    }, []);

    const handleClick: () => void = useCallback(() => {
        setIsOpened(!isOpened);
    }, [isOpened]);

    return (
        <Fragment>
            <Button
                buttonRef={triggerElement}
                aria-label="Close Modal"
                type="button"
                onClick={handleClick}
                theme={theme}
            >
                Open Lightbox
            </Button>

            <Lightbox
                isOpen={isOpened}
                parentElement={triggerElement}
                onClose={onCloseModal}
                onOpen={onOpenModal}
                theme={theme}
            >
                <Slideshow hasControls={true} autoPlay={true} fillHeight={true} theme={Themes.dark}>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=24" {...imageBlockDemoProps} />
                    </SlideshowItem>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=25" {...imageBlockDemoProps} />
                    </SlideshowItem>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=26" {...imageBlockDemoProps} />
                    </SlideshowItem>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=27" {...imageBlockDemoProps} />
                    </SlideshowItem>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=28" {...imageBlockDemoProps} />
                    </SlideshowItem>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=29" {...imageBlockDemoProps} />
                    </SlideshowItem>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=30" {...imageBlockDemoProps} />
                    </SlideshowItem>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=31" {...imageBlockDemoProps} />
                    </SlideshowItem>
                </Slideshow>
            </Lightbox>
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
