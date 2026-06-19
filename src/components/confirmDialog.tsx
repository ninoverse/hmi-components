import { type ReactNode, useEffect } from 'react';
import { Button } from './button';
import { Modal } from './modal';

export type ConfirmDialogVariant = 'default' | 'danger';

export type ConfirmDialogProps = {
    /** Whether the dialog is shown. */
    open: boolean;
    /** Called on cancel, backdrop/escape close. */
    onCancel: () => void;
    /** Called when the confirm button (or Enter) is activated. */
    onConfirm: () => void;
    /** Dialog heading. */
    title: ReactNode;
    /** Optional supporting text under the title. */
    description?: ReactNode;
    /** Confirm button label. @default 'Confirm' */
    confirmLabel?: ReactNode;
    /** Cancel button label. @default 'Cancel' */
    cancelLabel?: ReactNode;
    /** `danger` styles the confirm button as destructive. @default 'default' */
    variant?: ConfirmDialogVariant;
    /** Disable both buttons while an action is in flight. @default false */
    loading?: boolean;
    /** Disable only the confirm button (e.g. failed validation). @default false */
    confirmDisabled?: boolean;
};

/**
 * Confirmation dialog built on {@link Modal} with cancel/confirm buttons and
 * Enter-to-confirm. Use for destructive or irreversible actions.
 *
 * @example
 * <ConfirmDialog open={open} title="Delete?" variant="danger"
 *     onCancel={close} onConfirm={remove} />
 */
export function ConfirmDialog({
    open,
    onCancel,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    loading = false,
    confirmDisabled = false,
}: ConfirmDialogProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.metaKey &&
                !event.ctrlKey &&
                !event.altKey
            ) {
                const target = event.target as HTMLElement | null;
                const tag = target?.tagName;
                // Skip Enter when focus is in a multiline input
                if (tag === 'TEXTAREA') return;
                event.preventDefault();
                if (!loading && !confirmDisabled) onConfirm();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
        };
    }, [open, loading, confirmDisabled, onConfirm]);

    if (!open) return null;

    return (
        <Modal
            open={open}
            onClose={onCancel}
            title={title}
            description={description}
            actions={
                <>
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        disabled={loading || confirmDisabled}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        />
    );
}
