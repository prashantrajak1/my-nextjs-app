import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/db';
import { updateSale } from '@/app/actions';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function EditSalePage({ params }: { params: { id: string } }) {
    const sale = await prisma.sale.findUnique({
        where: { id: params.id }
    });

    if (!sale) {
        redirect('/sales');
    }

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <Link href="/sales" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to List
                </Link>

                <div className="max-w-md mx-auto">
                    <div className="glass-card animate-fade-in">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <ShoppingCart size={20} className="text-primary" />
                            Edit Sale
                        </h2>
                        <form action={updateSale} className="space-y-4">
                            <input type="hidden" name="id" value={sale.id} />
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle Number</label>
                                <input name="vehicleNo" type="text" defaultValue={sale.vehicleNo} className="glass-input" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                                    <input name="quantity" type="number" defaultValue={sale.quantity} className="glass-input" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Rate</label>
                                    <input name="rate" type="number" step="0.01" defaultValue={sale.rate} className="glass-input" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Received Amount</label>
                                <input name="receivedAmount" type="number" step="0.01" defaultValue={sale.receivedAmount} className="glass-input" required />
                            </div>
                            <button type="submit" className="glass-button w-full">
                                Update Sale
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
