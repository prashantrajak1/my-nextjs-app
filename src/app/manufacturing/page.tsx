import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { addManufacturing, deleteManufacturing } from '@/app/actions';
import { Factory, Calendar, Users, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function ManufacturingPage() {
    const sortedManufacturing = await prisma.brickManufacturing.findMany({
        include: { labor: true },
        orderBy: { date: 'desc' }
    });

    const labors = await prisma.labor.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <header className="mb-8 animate-fade-in container mx-auto px-4 pt-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            Manufacturing Records
                        </h1>
                        <p className="text-gray-400 mt-2">Track brick production and manufacturing data.</p>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Manufacturing Record Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Factory size={20} className="text-primary" />
                            Record Production
                        </h2>
                        <form action={addManufacturing} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Brick Type</label>
                                <select name="brickType" className="glass-input bg-gray-800" required>
                                    <option value="No.1">Brick No.1</option>
                                    <option value="No.2">Brick No.2</option>
                                    <option value="No.3">Brick No.3</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                                <input name="quantity" type="number" className="glass-input" placeholder="0" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Labor (Optional)</label>
                                <select name="laborId" className="glass-input bg-gray-800">
                                    <option value="">-- No Labor Assigned --</option>
                                    {labors.map((labor) => (
                                        <option key={labor.id} value={labor.id}>
                                            {labor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                                <input
                                    name="date"
                                    type="date"
                                    className="glass-input"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <button type="submit" className="glass-button w-full">
                                Record Production
                            </button>
                        </form>
                    </div>
                </div>

                {/* Manufacturing Records List */}
                <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-xl font-bold mb-4">Production Records</h2>
                    {sortedManufacturing.length === 0 ? (
                        <div className="glass-panel p-8 text-center text-gray-400">
                            No manufacturing records yet.
                        </div>
                    ) : (
                        <div className="glass-table-container">
                            <table className="glass-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Brick Type</th>
                                        <th>Quantity</th>
                                        <th>Labor</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedManufacturing.map((record) => (
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
                                                        <button className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors">
                                                            <Edit size={14} />
                                                        </button>
                                                    </Link>
                                                    <form action={deleteManufacturing}>
                                                        <input type="hidden" name="id" value={record.id} />
                                                        <button type="submit" className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </form>
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
