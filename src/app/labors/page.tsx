export const dynamic = 'force-dynamic';


import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { addLabor, deleteLabor } from '@/app/actions';
import { UserPlus, MapPin, Download } from 'lucide-react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export default async function LaborsPage() {
    const labors = await prisma.labor.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container min-h-screen pb-10">
            <Navbar />

            <header className="mb-8 animate-fade-in">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            Labor Management
                        </h1>
                        <p className="text-gray-400 mt-2">Manage laborers, payments, and dues.</p>
                    </div>
                    <a href="/api/labors/export" className="glass-button flex items-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Download size={16} />
                        Download Report
                    </a>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Labor Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-primary" />
                            Add New Labor
                        </h2>
                        <form action={addLabor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input name="name" type="text" className="glass-input" placeholder="Labor Name" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                                <input name="address" type="text" className="glass-input" placeholder="Address" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Rate per Brick (₹)</label>
                                <input name="brickRate" type="number" step="0.01" className="glass-input" placeholder="0.00" defaultValue="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Initial Due Amount (₹)</label>
                                <input name="due" type="number" step="0.01" className="glass-input" placeholder="0.00" defaultValue="0" />
                            </div>
                            <button type="submit" className="glass-button w-full">
                                Add Labor
                            </button>
                        </form>
                    </div>
                </div>

                {/* Labor List */}
                <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-bold mb-4">Labor Records</h2>
                    {labors.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No laborers found. Add one to get started.
                        </div>
                    ) : (
                        <div className="glass-table-container">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Rate/Brick</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {labors.map((labor) => {
                                        const moneyToPay = labor.bricksMade * labor.brickRate;
                                        return (
                                            <tr key={labor.id}>
                                                <td className="font-medium text-white">{labor.name}</td>
                                                <td className="text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} />
                                                        {labor.address}
                                                    </div>
                                                </td>
                                                <td className="text-gray-300">₹{labor.brickRate.toFixed(2)}</td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/labors/${labor.id}`}>
                                                            <button className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded hover:bg-purple-500/30 transition-colors font-medium">
                                                                View
                                                            </button>
                                                        </Link>
                                                        <Link href={`/labors/${labor.id}/edit`}>
                                                            <button className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors font-medium">
                                                                Edit
                                                            </button>
                                                        </Link>
                                                        <DeleteButton id={labor.id} action={deleteLabor} label="Delete" className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors font-medium" />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
