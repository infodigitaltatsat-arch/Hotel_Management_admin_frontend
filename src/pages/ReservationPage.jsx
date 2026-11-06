import { useEffect, useMemo, useState } from 'react';
import { Search, Eye, CalendarDays, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AdminLayout from '../components/layout/AdminLayout';
import { getAllReservations } from '../services/reservationService';

const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const getStatusStyle = (status) => {
    const styles = {
        confirmed: 'bg-blue-50 text-blue-700',
        checked_in: 'bg-green-50 text-green-700',
        checked_out: 'bg-slate-100 text-slate-700',
        cancelled: 'bg-red-50 text-red-700',
        pending: 'bg-yellow-50 text-yellow-700'
    };

    return styles[String(status || '').toLowerCase()] ||
        'bg-slate-100 text-slate-600';
};

const ReservationsPage = () => {
    const navigate = useNavigate();

    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getAllReservations();

            // Supports common API response shapes.
            const list = Array.isArray(data)
                ? data
                : data.reservations || data.data || [];

            if (!Array.isArray(list)) {
                throw new Error('Unexpected reservations response.');
            }

            setReservations(list);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Unable to load reservations.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const filteredReservations = useMemo(() => {
        return reservations.filter((reservation) => {
            const guestName = reservation.guest?.name || '';
            const bookingReference = reservation.bookingReference || '';
            const roomNumber = reservation.room?.roomNumber || '';
            const query = search.toLowerCase();

            const matchesSearch = [
                guestName,
                bookingReference,
                roomNumber
            ].some((value) =>
                String(value).toLowerCase().includes(query)
            );

            const status = String(
                reservation.bookingStatus || ''
            ).toLowerCase();

            const matchesStatus =
                statusFilter === 'all' || status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [reservations, search, statusFilter]);

    return (
        <AdminLayout title="Reservations">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#0a192f]">
                        Reservations
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        View and manage hotel bookings.
                    </p>
                </div>

                <button
                    onClick={fetchReservations}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-blue-700 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="mb-5 grid gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <Search size={18} className="shrink-0 text-blue-600" />

                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search guest, booking ID or room..."
                        className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="all">All statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
                {loading ? (
                    <div className="p-12 text-center text-sm text-slate-500">
                        Loading reservations...
                    </div>
                ) : error ? (
                    <div className="p-10 text-center">
                        <p className="text-sm text-red-600">{error}</p>

                        <button
                            onClick={fetchReservations}
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredReservations.length === 0 ? (
                    <div className="p-12 text-center">
                        <CalendarDays
                            size={32}
                            className="mx-auto text-slate-300"
                        />
                        <p className="mt-3 font-medium text-slate-700">
                            No reservations found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left">
                            <thead className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600">
                                <tr>
                                    <th className="px-5 py-4">Booking</th>
                                    <th className="px-5 py-4">Guest</th>
                                    <th className="px-5 py-4">Room</th>
                                    <th className="px-5 py-4">Check-in</th>
                                    <th className="px-5 py-4">Check-out</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredReservations.map((reservation) => (
                                    <tr
                                        key={reservation._id}
                                        className="text-sm transition-colors duration-150 hover:bg-blue-50/80"
                                    >
                                        <td className="px-5 py-4 font-semibold text-[#0a192f]">
                                            {reservation.bookingReference || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-slate-700">
                                            {reservation.guest?.name || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-slate-700">
                                            {reservation.room?.roomNumber || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            {formatDate(reservation.checkIn)}
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            {formatDate(reservation.checkOut)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(reservation.bookingStatus)}`}>
                                                {reservation.bookingStatus || 'Unknown'}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() =>
                                                    navigate(`/reservations/${reservation._id}`)
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                <Eye size={15} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <p className="mt-3 text-sm font-medium text-slate-500">
                Showing {filteredReservations.length} of {reservations.length} reservations
            </p>
        </AdminLayout>
    );
};

export default ReservationsPage;
