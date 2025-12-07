'use client';

import { useState } from 'react';
import { addLaborPayment } from '@/app/actions';
import { X } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

interface AddAdvanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    laborId: string;
    laborName: string;
}

export default function AddAdvanceModal({ isOpen, onClose, laborId, laborName }: AddAdvanceModalProps) {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await addLaborPayment(formData);
            onClose();
            setAmount('');
        } catch (error) {
            console.error('Failed to add advance:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">
                    {t('add_advance')} - {laborName}
                </h2>

                <form action={handleSubmit} className="space-y-4">
                    <input type="hidden" name="laborId" value={laborId} />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            {t('amount')} (₹)
                        </label>
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            className="glass-input"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="glass-button bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        >
                            {isSubmitting ? 'Adding...' : t('add_advance')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
