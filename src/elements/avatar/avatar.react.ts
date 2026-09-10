import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiAvatar } from './avatar.js';

export type { AvatarSize, AvatarStatus } from './avatar.js';

/**
 * React wrapper for `<hmi-avatar>`.
 *
 * @example
 * <Avatar name="Ada Lovelace" status="online" />
 */
export const Avatar = createComponent({
    tagName: 'hmi-avatar',
    elementClass: HmiAvatar,
    react: React,
    displayName: 'Avatar',
});
