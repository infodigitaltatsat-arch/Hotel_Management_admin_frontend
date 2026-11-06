import { useEffect, useState } from 'react';
import { Search, IndianRupee } from 'lucide-react';

import AdminLayout from '../components/layout/AdminLayout';
import { getAllReservations } from '../services/reservationService';

const PaymentsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getAllReservations();
                setReservations(
                    response.reservations || response.data || response
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const filteredPayments = reservations.filter((item) =>
        `${item.bookingReference} ${item.guest?.name}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalAmount = reservations.reduce(
        (sum, item) => sum + Number(item.totalPrice || 0),
        0
    );

    const paidAmount = reservations
        .filter((item) => item.paymentStatus === 'paid')
        .reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);

    const pendingAmount = totalAmount - paidAmount;

    return (
        <AdminLayout title="Payments">
            <div className="space-y-6">

                <div>
                    <h2 className="text-xl font-semibold">Payments</h2>
                    <p className="text-sm text-gray-500">
                        View reservation payment records.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <IndianRupee className="text-blue-600" />
                        <p className="mt-3 text-sm text-gray-500">Total bookings value</p>
                        <h3 className="mt-1 text-2xl font-semibold">
                            ₹{totalAmount.toLocaleString('en-IN')}
                        </h3>
                    </div>

                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <IndianRupee className="text-green-600" />
                        <p className="mt-3 text-sm text-gray-500">Paid amount</p>
                        <h3 className="mt-1 text-2xl font-semibold">
                            ₹{paidAmount.toLocaleString('en-IN')}
                        </h3>
                    </div>

                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <IndianRupee className="text-orange-600" />
                        <p className="mt-3 text-sm text-gray-500">Unpaid amount</p>
                        <h3 className="mt-1 text-2xl font-semibold">
                            ₹{pendingAmount.toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-4 border-slate-200">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search booking or guest..."
                            className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none border-slate-300 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border bg-white border-slate-200 shadow-md">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b border-slate-200 shadow-md">
                            <tr>
                                <th className="p-4">Booking Reference</th>
                                <th className="p-4">Guest</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Payment Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y ">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        Loading payments...
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        No payment records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((item) => (
                                    <tr key={item._id}>
                                        <td className="p-4">
                                            {item.bookingReference || item._id}
                                        </td>

                                        <td className="p-4">
                                            {item.guest?.name || '—'}
                                        </td>

                                        <td className="p-4">
                                            {item.room?.roomNumber || '—'}
                                        </td>

                                        <td className="p-4">
                                            ₹{Number(item.totalPrice || 0).toLocaleString('en-IN')}
                                        </td>

                                        <td className="p-4">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                                                {item.paymentStatus || 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PaymentsPage;