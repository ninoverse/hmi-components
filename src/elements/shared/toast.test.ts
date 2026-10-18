import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    getToasts,
    pauseToast,
    resetToasts,
    resumeToast,
    subscribeToasts,
    toast,
} from './toast.js';

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    resetToasts();
    vi.useRealTimers();
});

const ids = () => getToasts().map((item) => item.id);

describe('the toast queue', () => {
    it('queues a toast and returns its id, one more each time', () => {
        const first = toast.show({ title: 'One' });
        const second = toast.show({ title: 'Two' });
        expect(second).toBe(first + 1);
        expect(ids()).toEqual([first, second]);
    });

    it('defaults to an info toast of 4000 ms, and keeps what it is given', () => {
        const link = document.createElement('a');
        const id = toast.show({ title: 'Title', body: link });
        expect(getToasts().find((item) => item.id === id)).toEqual({
            id,
            variant: 'info',
            title: 'Title',
            body: link,
            duration: 4000,
            leaving: false,
        });
        expect(getToasts()[0]?.body).toBe(link);
    });

    it('shows with no options', () => {
        const id = toast.show();
        expect(ids()).toEqual([id]);
    });

    it('has a shortcut per variant, taking a title, a body and the other options', () => {
        toast.info('a', 'b');
        toast.success('c');
        toast.warning('d', 'e', { duration: 10 });
        toast.danger('f', undefined, { duration: 0 });
        expect(
            getToasts().map(({ variant, title, body, duration }) => ({
                variant,
                title,
                body,
                duration,
            })),
        ).toEqual([
            { variant: 'info', title: 'a', body: 'b', duration: 4000 },
            { variant: 'success', title: 'c', body: undefined, duration: 4000 },
            { variant: 'warning', title: 'd', body: 'e', duration: 10 },
            { variant: 'danger', title: 'f', body: undefined, duration: 0 },
        ]);
    });
});

describe('dismissing', () => {
    it('plays the exit first, then takes the toast out 220 ms later', () => {
        const id = toast.show({ title: 'x', duration: 0 });
        toast.dismiss(id);
        expect(getToasts()[0]?.leaving).toBe(true);
        vi.advanceTimersByTime(219);
        expect(ids()).toEqual([id]);
        vi.advanceTimersByTime(1);
        expect(ids()).toEqual([]);
    });

    it('dismisses on its own after the duration', () => {
        const id = toast.show({ title: 'x', duration: 1000 });
        vi.advanceTimersByTime(999);
        expect(getToasts()[0]?.leaving).toBe(false);
        vi.advanceTimersByTime(1);
        expect(getToasts()[0]?.leaving).toBe(true);
        vi.advanceTimersByTime(220);
        expect(ids()).not.toContain(id);
    });

    it('stays until dismissed with a duration of 0', () => {
        toast.show({ title: 'x', duration: 0 });
        vi.advanceTimersByTime(60_000);
        expect(getToasts()).toHaveLength(1);
        expect(getToasts()[0]?.leaving).toBe(false);
    });

    it('leaves the others alone', () => {
        const a = toast.show({ title: 'a', duration: 0 });
        const b = toast.show({ title: 'b', duration: 0 });
        toast.dismiss(a);
        vi.advanceTimersByTime(220);
        expect(ids()).toEqual([b]);
    });

    it('does nothing for an id that is not queued, or one already leaving', () => {
        const id = toast.show({ title: 'x', duration: 0 });
        const listener = vi.fn();
        subscribeToasts(listener);
        toast.dismiss(id + 100);
        expect(listener).not.toHaveBeenCalled();
        toast.dismiss(id);
        toast.dismiss(id);
        expect(listener).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(220);
        expect(listener).toHaveBeenCalledTimes(2);
        toast.dismiss(id);
        expect(listener).toHaveBeenCalledTimes(2);
    });

    it('stops the clock of a toast that is dismissed by hand', () => {
        const id = toast.show({ title: 'x', duration: 1000 });
        toast.dismiss(id);
        vi.advanceTimersByTime(220);
        const listener = vi.fn();
        subscribeToasts(listener);
        vi.advanceTimersByTime(5000);
        expect(listener).not.toHaveBeenCalled();
    });
});

describe('pausing', () => {
    it('stops the clock, and goes on with the time that was left', () => {
        toast.show({ title: 'x', duration: 1000 });
        const id = getToasts()[0]?.id as number;
        vi.advanceTimersByTime(400);
        pauseToast(id);
        vi.advanceTimersByTime(60_000);
        expect(getToasts()[0]?.leaving).toBe(false);
        resumeToast(id);
        vi.advanceTimersByTime(599);
        expect(getToasts()[0]?.leaving).toBe(false);
        vi.advanceTimersByTime(1);
        expect(getToasts()[0]?.leaving).toBe(true);
    });

    it('keeps the time over several pauses', () => {
        const id = toast.show({ title: 'x', duration: 1000 });
        vi.advanceTimersByTime(300);
        pauseToast(id);
        resumeToast(id);
        vi.advanceTimersByTime(300);
        pauseToast(id);
        resumeToast(id);
        vi.advanceTimersByTime(399);
        expect(getToasts()[0]?.leaving).toBe(false);
        vi.advanceTimersByTime(1);
        expect(getToasts()[0]?.leaving).toBe(true);
    });

    it('is the same to pause or resume twice, and to do either to a toast with no clock', () => {
        const id = toast.show({ title: 'x', duration: 1000 });
        pauseToast(id);
        pauseToast(id);
        resumeToast(id);
        resumeToast(id);
        vi.advanceTimersByTime(1000);
        expect(getToasts()[0]?.leaving).toBe(true);
        const sticky = toast.show({ title: 'y', duration: 0 });
        pauseToast(sticky);
        resumeToast(sticky);
        pauseToast(999_999);
        resumeToast(999_999);
        vi.advanceTimersByTime(60_000);
        expect(getToasts().find((item) => item.id === sticky)?.leaving).toBe(
            false,
        );
    });
});

describe('listening', () => {
    it('tells a listener the queue after each change, until it stops', () => {
        const listener = vi.fn();
        const stop = subscribeToasts(listener);
        const id = toast.show({ title: 'x', duration: 0 });
        expect(listener).toHaveBeenLastCalledWith([
            expect.objectContaining({ id, leaving: false }),
        ]);
        toast.dismiss(id);
        expect(listener).toHaveBeenLastCalledWith([
            expect.objectContaining({ id, leaving: true }),
        ]);
        stop();
        listener.mockClear();
        toast.show({ title: 'y' });
        expect(listener).not.toHaveBeenCalled();
    });

    it('is emptied, and its clocks stopped, by a reset', () => {
        toast.show({ title: 'a', duration: 1000 });
        toast.show({ title: 'b', duration: 0 });
        resetToasts();
        expect(getToasts()).toEqual([]);
        const listener = vi.fn();
        subscribeToasts(listener);
        vi.advanceTimersByTime(5000);
        expect(listener).not.toHaveBeenCalled();
    });
});
