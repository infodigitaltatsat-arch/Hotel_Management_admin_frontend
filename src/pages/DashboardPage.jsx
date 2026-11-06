import { useEffect, useState } from 'react';
import { BedDouble, CalendarCheck, Users, Clock } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { getAllReservations } from '../services/reservationService';
import { getAllRooms } from '../services/roomServices';

const DashboardPage = () => {
    const [reservations, setReservations] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [reservationResponse, roomResponse] = await Promise.all([
                    getAllReservations(),
                    getAllRooms()
                ]);

                setReservations(reservationResponse.data || []);
                setRooms(roomResponse.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const today = new Date().toLocaleDateString('en-CA');

    const todayCheckIns = reservations.filter(
        (item) =>
            item.bookingStatus === 'confirmed' &&
            new Date(item.checkIn).toLocaleDateString('en-CA') === today
    ).length;

    const currentlyStaying = reservations.filter(
        (item) => item.bookingStatus === 'checked_in'
    ).length;

    const upcomingBookings = reservations.filter(
        (item) =>
            item.bookingStatus === 'confirmed' &&
            new Date(item.checkIn).toLocaleDateString('en-CA') > today
    ).length;

    const availableRooms = rooms.filter(
        (room) =>
            room.status === 'available' &&
            ['clean', 'inspected'].includes(room.houseKeepingStatus)
    ).length;

    const stats = [
        {
            title: 'Total Rooms',
            value: rooms.length,
            icon: BedDouble,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Available Rooms',
            value: availableRooms,
            icon: BedDouble,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            title: "Today's Check-ins",
            value: todayCheckIns,
            icon: CalendarCheck,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            title: 'Currently Staying',
            value: currentlyStaying,
            icon: Users,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        }
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    Overview
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Welcome to your hotel management dashboard.
                </p>
            </div>

            {loading ? (
                <p className="text-slate-500">Loading dashboard...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.title}
                                    className="rounded-xl border border-slate-200 bg-white p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                {stat.title}
                                            </p>
                                            <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                                {stat.value}
                                            </h2>
                                        </div>

                                        <div className={`rounded-xl p-3 ${stat.bg}`}>
                                            <Icon className={stat.color} size={24} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h3 className="mb-4 font-semibold text-slate-800">
                                Reservation Overview
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Total Reservations
                                    </span>
                                    <strong>{reservations.length}</strong>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Upcoming Bookings
                                    </span>
                                    <strong>{upcomingBookings}</strong>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Checked-out Guests
                                    </span>
                                    <strong>
                                        {reservations.filter(
                                            (item) => item.bookingStatus === 'checked_out'
                                        ).length}
                                    </strong>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Cancelled Bookings
                                    </span>
                                    <strong>
                                        {reservations.filter(
                                            (item) => item.bookingStatus === 'cancelled'
                                        ).length}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <Clock size={19} className="text-blue-600" />
                                <h3 className="font-semibold text-slate-800">
                                    Recent Reservations
                                </h3>
                            </div>

                            {reservations.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    No reservations found.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {[...reservations]
                                        .sort(
                                            (a, b) =>
                                                new Date(b.createdAt) - new Date(a.createdAt)
                                        )
                                        .slice(0, 5)
                                        .map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex justify-between gap-3 border-b border-slate-100 pb-3"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {item.guest?.name || 'Guest'}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {item.bookingReference}
                                                    </p>
                                                </div>

                                                <span className="h-fit rounded-full bg-blue-50 px-3 py-1 text-xs capitalize text-blue-600">
                                                    {item.bookingStatus.replace('_', ' ')}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default DashboardPage;