import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { updateLabor } from '@/app/actions';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function EditLaborPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const labor = await prisma.labor.findUnique({
        where: { id }
    });

    if (!labor) {
        redirect('/labors');
    }

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <Link href="/labors" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to List
                </Link>

                <div className="max-w-md mx-auto">
                    <div className="glass-card animate-fade-in">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-primary" />
                            Edit Labor
                        </h2>
                        <form action={updateLabor} className="space-y-4">
                            <input type="hidden" name="id" value={labor.id} />
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input name="name" type="text" defaultValue={labor.name} className="glass-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                                <input name="address" type="text" defaultValue={labor.address} className="glass-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">No. of Bricks Made</label>
                                <input name="bricksMade" type="number" defaultValue={labor.bricksMade} className="glass-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Rate per Brick (₹)</label>
                                <input name="brickRate" type="number" step="0.01" defaultValue={labor.brickRate} className="glass-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Current Due (₹)</label>
                                <input name="due" type="number" step="0.01" defaultValue={labor.due} className="glass-input" />
                            </div>
                            <button type="submit" className="glass-button w-full">
                                Update Labor
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
