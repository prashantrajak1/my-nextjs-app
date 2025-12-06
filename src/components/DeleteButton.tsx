'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
    id: string;
    action: (formData: FormData) => Promise<void>;
    label?: string; // Optional text label
    className?: string;
}

export default function DeleteButton({ id, action, label = 'Delete', className }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
            const formData = new FormData();
            formData.append('id', id);
            startTransition(() => action(formData));
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className={className || "text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors flex items-center gap-1"}
        >
            {isPending ? '...' : (
                <>
                    {/* Only show icon if no label or if explicitly designed, but user asked for text buttons in labor section. 
                        We'll make it flexible. If label is provided, show label. */}
                    {label === 'Delete' && <Trash2 size={14} />}
                    {label}
                </>
            )}
        </button>
    );
}
