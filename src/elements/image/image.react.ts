import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiImage, type ImageLoadDetail } from './image.js';

export type { ImageFit, ImageLoadDetail, ImageRadius } from './image.js';

/**
 * React wrapper for `<hmi-image>`.
 *
 * `onLoad` and `onError` receive the event, with `event.detail.src`. To render
 * the image yourself, pass it as a child: `<Image …><NextImage fill … /></Image>`;
 * the shell still shows the placeholder and the fallback. `fallback` is a child
 * with `slot="fallback"`.
 *
 * @example
 * <Image src="/cover.jpg" alt="Cover" ratio={16 / 9} radius="large" />
 */
export const Image = createComponent({
    tagName: 'hmi-image',
    elementClass: HmiImage,
    react: React,
    displayName: 'Image',
    events: {
        onLoad: 'hmi-load' as EventName<CustomEvent<ImageLoadDetail>>,
        onError: 'hmi-error' as EventName<CustomEvent<ImageLoadDetail>>,
    },
});
