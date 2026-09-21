import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiSkeleton } from './skeleton.js';

export type { SkeletonVariant } from './skeleton.js';

/**
 * React wrapper for `<hmi-skeleton>`.
 *
 * @example
 * <Skeleton variant="circle" width={40} height={40} />
 */
export const Skeleton = createComponent({
    tagName: 'hmi-skeleton',
    elementClass: HmiSkeleton,
    react: React,
    displayName: 'Skeleton',
});
