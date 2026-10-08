import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { type BreadcrumbsNavDetail, HmiBreadcrumbs } from './breadcrumbs.js';

export type { BreadcrumbItem, BreadcrumbsNavDetail } from './breadcrumbs.js';

/**
 * React wrapper for `<hmi-breadcrumbs>`.
 *
 * `items` is a property. `onNav` receives the event, whose `detail` is
 * `{ value, index }`: call `event.preventDefault()` to keep the browser from
 * following `href`. Rich labels are children with `slot="label-<index>"`, and
 * one child with `slot="separator"` is copied between the crumbs. `label` is
 * the landmark's name.
 *
 * @example
 * <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />
 */
export const Breadcrumbs = createComponent({
    tagName: 'hmi-breadcrumbs',
    elementClass: HmiBreadcrumbs,
    react: React,
    displayName: 'Breadcrumbs',
    events: {
        onNav: 'hmi-nav' as EventName<CustomEvent<BreadcrumbsNavDetail>>,
    },
});
