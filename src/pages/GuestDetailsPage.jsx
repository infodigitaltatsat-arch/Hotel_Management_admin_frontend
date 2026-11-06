import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CalendarDays } from 'lucide-react';

import AdminLayout from '../components/layout/AdminLayout';
import { getAllReservations } from '../services/reservationService';

const GuestDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [guest, setGuest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuest = async () => {
            try {
                const response = await getAllReservations();
                const reservations =
                    response.reservations || response.data || response;

                const guestBookings = reservations.filter(
                    (item) => item.guest?._id === id
                );

                setBookings(guestBookings);
                setGuest(guestBookings[0]?.guest || null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGuest();
    }, [id]);

    const completed = bookings.filter(
        (item) => item.bookingStatus === 'checked_out'
    ).length;

    const cancelled = bookings.filter(
        (item) => item.bookingStatus === 'cancelled'
    ).length;

    const totalPaid = bookings
        .filter((item) => item.paymentStatus === 'paid')
        .reduce((total, item) => total + Number(item.totalPrice || 0), 0);

    if (loading) {
        return (
            <AdminLayout title="Guest Details">
                <p>Loading guest details...</p>
            </AdminLayout>
        );
    }

    if (!guest) {
        return (
            <AdminLayout title="Guest Details">
                <p>Guest not found.</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Guest Details">
            <div className="space-y-6">

                <button
                    onClick={() => navigate('/guests')}
                    className="flex items-center gap-2 text-sm text-gray-600"
                >
                    <ArrowLeft size={18} />
                    Back to guests
                </button>

                {/* Guest information */}
                <div className="rounded-xl border border-slate-200 shadow-md bg-white p-6">
                    <User size={28} className="mb-3 text-blue-600" />

                    <h2 className="text-xl font-semibold">{guest.name}</h2>
                    <p className="text-sm text-gray-500">{guest.email}</p>
                    <p className="mt-1 text-sm text-gray-500">
                        {guest.phone || 'No phone number'}
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <p className="text-sm text-gray-500">Total bookings</p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            {bookings.length}
                        </h3>
                    </div>

                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <p className="text-sm text-gray-500">Completed stays</p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            {completed}
                        </h3>
                    </div>

                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <p className="text-sm text-gray-500">Cancelled bookings</p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            {cancelled}
                        </h3>
                    </div>

                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <p className="text-sm text-gray-500">Total paid</p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            ₹{totalPaid.toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>

                {/* Booking history */}
                <div className="overflow-x-auto rounded-xl border bg-white border-slate-200 shadow-md">
                    <div className="border-b p-5 border-slate-200 shadow-md">
                        <h3 className="font-semibold">Booking History</h3>
                    </div>

                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-4">Booking ID</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Check-in</th>
                                <th className="p-4">Check-out</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="p-4">
                                        {booking.bookingReference || booking._id}
                                    </td>
                                    <td className="p-4">
                                        {booking.room?.roomNumber || '—'}
                                    </td>
                                    <td className="p-4">
                                        {new Date(booking.checkIn).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="p-4">
                                        {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="p-4">
                                        ₹{Number(booking.totalPrice || 0).toLocaleString('en-IN')}
                                    </td>
                                    <td className="capitalize p-4">
                                        {booking.bookingStatus?.replace('_', ' ') || '—'}
                                    </td>
                                </tr>
                            ))}

                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center">
                                        No booking history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default GuestDetailsPage;