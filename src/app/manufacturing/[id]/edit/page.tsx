import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { updateManufacturing } from '@/app/actions';
import { Factory, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export default async function EditManufacturingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const record = await prisma.brickManufacturing.findUnique({
        where: { id }
    });

    const labors = await prisma.labor.findMany({
        orderBy: { name: 'asc' }
    });

    if (!record) {
        redirect('/manufacturing');
    }

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <Link href="/manufacturing" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to List
                </Link>

                <div className="max-w-md mx-auto">
                    <div className="glass-card animate-fade-in">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Factory size={20} className="text-primary" />
                            Edit Manufacturing Record
                        </h2>
                        <form action={updateManufacturing} className="space-y-4">
                            <input type="hidden" name="id" value={record.id} />
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Brick Type</label>
                                <select name="brickType" defaultValue={record.brickType} className="glass-input bg-gray-800" required>
                                    <option value="No.1">Brick No.1</option>
                                    <option value="No.2">Brick No.2</option>
                                    <option value="No.3">Brick No.3</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                                <input name="quantity" type="number" defaultValue={record.quantity} className="glass-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Labor (Optional)</label>
                                <select name="laborId" defaultValue={record.laborId || ''} className="glass-input bg-gray-800">
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
                                    defaultValue={format(new Date(record.date), 'yyyy-MM-dd')}
                                    className="glass-input"
                                    required
                                />
                            </div>
                            <button type="submit" className="glass-button w-full">
                                Update Record
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
