import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { type BannerDismissDetail, HmiBanner } from './banner.js';

export type { BannerDismissDetail, BannerVariant } from './banner.js';

/**
 * React wrapper for `<hmi-banner>`.
 *
 * @example
 * <Banner variant="success" dismissible onDismiss={hide}><span slot="title">Saved</span>All set.</Banner>
 */
export const Banner = createComponent({
    tagName: 'hmi-banner',
    elementClass: HmiBanner,
    react: React,
    displayName: 'Banner',
    events: {
        onDismiss: 'hmi-dismiss' as EventName<CustomEvent<BannerDismissDetail>>,
    },
});
