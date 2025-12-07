'use client';

import Navbar from '@/components/Navbar';
import { addManufacturing, deleteManufacturing } from '@/app/actions';
import { Factory, Calendar, Users, Download } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { useTranslation } from '@/context/TranslationContext';
import { BrickManufacturing, Labor } from '@prisma/client';

interface ManufacturingListContentProps {
    manufacturing: (BrickManufacturing & { labor: Labor | null })[];
    labors: Labor[];
}

export default function ManufacturingListContent({ manufacturing, labors }: ManufacturingListContentProps) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <header className="mb-8 animate-fade-in container mx-auto px-4 pt-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {t('manufacturing_records')}
                        </h1>
                        <p className="text-gray-400 mt-2">Track brick production and manufacturing data.</p>
                    </div>
                    <a href="/api/manufacturing/export" className="glass-button flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Download size={16} />
                        {t('download_csv')}
                    </a>
                </div>
            </header>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Manufacturing Record Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Factory size={20} className="text-primary" />
                            {t('record_production')}
                        </h2>
                        <form action={addManufacturing} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('brick_type')}</label>
                                <select name="brickType" className="glass-input bg-gray-800" required>
                                    <option value="No.1">Brick No.1</option>
                                    <option value="No.2">Brick No.2</option>
                                    <option value="No.3">Brick No.3</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('quantity')}</label>
                                <input name="quantity" type="number" className="glass-input" placeholder="0" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('labor')} (Optional)</label>
                                <select name="laborId" className="glass-input bg-gray-800">
                                    <option value="">-- {t('no_labor_assigned')} --</option>
                                    {labors.map((labor) => (
                                        <option key={labor.id} value={labor.id}>
                                            {labor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('date')}</label>
                                <input
                                    name="date"
                                    type="date"
                                    className="glass-input"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <button type="submit" className="glass-button w-full">
                                {t('record_production')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Manufacturing Records List */}
                <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-bold mb-4">{t('production_records')}</h2>
                    {manufacturing.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No manufacturing records yet.
                        </div>
                    ) : (
                        <div className="glass-table-container">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>{t('date')}</th>
                                        <th>{t('brick_type')}</th>
                                        <th>{t('quantity')}</th>
                                        <th>{t('labor')}</th>
                                        <th>{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {manufacturing.map((record) => (
                                        <tr key={record.id}>
                                            <td className="text-gray-400 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-primary" />
                                                    {format(new Date(record.date), 'PPP')}
                                                </div>
                                            </td>
                                            <td className="font-medium text-white">
                                                <div className="flex items-center gap-2">
                                                    <Factory size={14} className="text-yellow-400" />
                                                    {record.brickType}
                                                </div>
                                            </td>
                                            <td className="text-lg font-bold text-yellow-400">
                                                {record.quantity.toLocaleString()}
                                            </td>
                                            <td className="text-sm text-gray-300">
                                                {record.labor ? (
                                                    <div className="flex items-center gap-2">
                                                        <Users size={14} className="text-blue-400" />
                                                        {record.labor.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-600">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/manufacturing/${record.id}/edit`}>
                                                        <button className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors font-medium">
                                                            {t('edit')}
                                                        </button>
                                                    </Link>
                                                    <DeleteButton id={record.id} action={deleteManufacturing} label={t('delete')} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors font-medium" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
