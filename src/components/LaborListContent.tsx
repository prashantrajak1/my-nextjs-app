'use client';

import Navbar from '@/components/Navbar';
import { addLabor, deleteLabor } from '@/app/actions';
import { UserPlus, MapPin, Download } from 'lucide-react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import AddAdvanceModal from './AddAdvanceModal';
import { useTranslation } from '@/context/TranslationContext';
import { Labor } from '@prisma/client';
import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';

interface LaborListContentProps {
    labors: Labor[];
}

export default function LaborListContent({ labors }: LaborListContentProps) {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expandedDates, setExpandedDates] = useState<string[]>([]);
    const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
    const [selectedLabor, setSelectedLabor] = useState<{ id: string, name: string } | null>(null);

    const handleAddAdvance = (labor: Labor) => {
        setSelectedLabor({ id: labor.id, name: labor.name });
        setIsAdvanceModalOpen(true);
    };

    // Filter labors based on date range
    const filteredLabors = useMemo(() => {
        return labors.filter(labor => {
            const laborDate = new Date(labor.createdAt);
            laborDate.setHours(0, 0, 0, 0);

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (laborDate < start) return false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                if (laborDate > end) return false;
            }
            return true;
        });
    }, [labors, startDate, endDate]);

    // Group labors by date
    const groupedLabors = useMemo(() => {
        const groups: { [key: string]: Labor[] } = {};
        filteredLabors.forEach(labor => {
            const dateKey = format(new Date(labor.createdAt), 'yyyy-MM-dd');
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(labor);
        });
        return groups;
    }, [filteredLabors]);

    // Sort dates descending
    const sortedDates = Object.keys(groupedLabors).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Toggle accordion
    const toggleDate = (date: string) => {
        setExpandedDates(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        );
    };

    // Initialize with first date expanded
    useEffect(() => {
        if (sortedDates.length > 0 && expandedDates.length === 0) {
            setExpandedDates([sortedDates[0]]);
        }
    }, [sortedDates.length]);

    const downloadUrl = `/api/labors/export?startDate=${startDate}&endDate=${endDate}`;

    return (
        <div className="dashboard">
            <Navbar />

            <main className="dashboard-inner">
                <header className="dashboard-header-card mb-8 animate-fade-in">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 w-full">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                {t('labor_list')}
                            </h1>
                            <p className="text-gray-400 mt-2">Manage laborers, payments, and dues.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full xl:w-auto">
                            <div className="flex flex-wrap gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/10">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-400 ml-1">From</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-transparent border-none text-white text-sm focus:ring-0 p-1 w-32"
                                    />
                                </div>
                                <span className="text-gray-500">-</span>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-400 ml-1">To</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-transparent border-none text-white text-sm focus:ring-0 p-1 w-32"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Labor Form */}
                    <div className="lg:col-span-1">
                        <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <UserPlus size={20} className="text-primary" />
                                {t('add_labor')}
                            </h2>
                            <form action={addLabor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('name')}</label>
                                    <input name="name" type="text" className="glass-input" placeholder={t('name')} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('address')}</label>
                                    <input name="address" type="text" className="glass-input" placeholder={t('address')} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('rate_per_brick')} (₹)</label>
                                    <input name="brickRate" type="number" step="0.01" className="glass-input" placeholder="0.00" defaultValue="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">{t('current_advance')} (₹)</label>
                                    <input name="due" type="number" step="0.01" className="glass-input" placeholder="0.00" defaultValue="0" />
                                </div>
                                <button type="submit" className="glass-button w-full">
                                    {t('add_new')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Labor List */}
                    <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{t('labor_list')}</h2>
                            <a href={downloadUrl} className="glass-button flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs px-4 py-2 h-auto whitespace-nowrap">
                                <Download size={14} />
                                {t('download_csv')}
                            </a>
                        </div>
                        {sortedDates.length === 0 ? (
                            <div className="glass-panel p-8 text-center text-gray-400">
                                No laborers found for the selected period.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sortedDates.map((date) => {
                                    const isExpanded = expandedDates.includes(date);
                                    const dayLabors = groupedLabors[date];

                                    return (
                                        <div key={date} className="glass-panel overflow-hidden border border-white/5">
                                            <button
                                                onClick={() => toggleDate(date)}
                                                className="w-full flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                                        ▶
                                                    </div>
                                                    <span className="font-bold text-lg">
                                                        {format(new Date(date), 'PPP')}
                                                    </span>
                                                    <span className="text-sm text-gray-400">
                                                        ({dayLabors.length} joined)
                                                    </span>
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="p-4 animate-fade-in">
                                                    <div className="glass-table-container">
                                                        <table className="glass-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>{t('name')}</th>
                                                                    <th>{t('address')}</th>
                                                                    <th>{t('rate_per_brick')}</th>
                                                                    <th>{t('current_advance')}</th>
                                                                    <th>{t('actions')}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {dayLabors.map((labor) => (
                                                                    <tr key={labor.id}>
                                                                        <td className="font-medium text-white">{labor.name}</td>
                                                                        <td className="text-gray-400">
                                                                            <div className="flex items-center gap-2">
                                                                                <MapPin size={14} />
                                                                                {labor.address}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-gray-300">₹{labor.brickRate.toFixed(2)}</td>
                                                                        <td className="font-bold">
                                                                            {labor.due > 0 ? (
                                                                                <span className="text-green-400" style={{ color: '#4ade80' }}>
                                                                                    {t('advance')}: ₹{labor.due.toLocaleString()}
                                                                                </span>
                                                                            ) : labor.due < 0 ? (
                                                                                <span className="text-red-400" style={{ color: '#f87171' }}>
                                                                                    {t('pending')}: ₹{Math.abs(labor.due).toLocaleString()}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-gray-500">-</span>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                                <Link href={`/labors/${labor.id}`}>
                                                                                    <button
                                                                                        className="text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                                                                                        style={{
                                                                                            backgroundColor: 'rgba(168, 85, 247, 0.2)',
                                                                                            color: '#d8b4fe',
                                                                                            border: '1px solid rgba(168, 85, 247, 0.3)',
                                                                                            padding: '6px 14px',
                                                                                            borderRadius: '8px',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    >
                                                                                        {t('enter')}
                                                                                    </button>
                                                                                </Link>

                                                                                <Link href={`/labors/${labor.id}/edit`}>
                                                                                    <button
                                                                                        className="text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                                                                                        style={{
                                                                                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                                                                            color: '#93c5fd',
                                                                                            border: '1px solid rgba(59, 130, 246, 0.3)',
                                                                                            padding: '6px 14px',
                                                                                            borderRadius: '8px',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    >
                                                                                        {t('edit')}
                                                                                    </button>
                                                                                </Link>

                                                                                <a href={`/api/labors/${labor.id}/export`}>
                                                                                    <button
                                                                                        className="text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-1"
                                                                                        style={{
                                                                                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                                                                            color: '#86efac',
                                                                                            border: '1px solid rgba(34, 197, 94, 0.3)',
                                                                                            padding: '6px 14px',
                                                                                            borderRadius: '8px',
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            gap: '6px',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    >
                                                                                        <Download size={14} strokeWidth={3} />
                                                                                        {t('csv')}
                                                                                    </button>
                                                                                </a>

                                                                                <div style={{ marginLeft: '4px' }}>
                                                                                    <DeleteButton
                                                                                        id={labor.id}
                                                                                        action={deleteLabor}
                                                                                        label={t('delete')}
                                                                                        className="text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {selectedLabor && (
                <AddAdvanceModal
                    isOpen={isAdvanceModalOpen}
                    onClose={() => setIsAdvanceModalOpen(false)}
                    laborId={selectedLabor.id}
                    laborName={selectedLabor.name}
                />
            )}
        </div>
    );
}
