import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiProgress } from './progress.js';

/**
 * React wrapper for `<hmi-progress>`.
 *
 * @example
 * <Progress value={64} label="Uploading" />
 */
export const Progress = createComponent({
    tagName: 'hmi-progress',
    elementClass: HmiProgress,
    react: React,
    displayName: 'Progress',
});
