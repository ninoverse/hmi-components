import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiAvatarStack } from './avatar-stack.js';

export type { AvatarSize } from '../avatar/avatar.js';

/**
 * React wrapper for `<hmi-avatar-stack>`.
 *
 * @example
 * <AvatarStack names={['Ada Lovelace', 'Alan Turing']} max={4} />
 */
export const AvatarStack = createComponent({
    tagName: 'hmi-avatar-stack',
    elementClass: HmiAvatarStack,
    react: React,
    displayName: 'AvatarStack',
});
