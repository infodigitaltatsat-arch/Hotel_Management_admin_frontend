import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Eye } from 'lucide-react';

import AdminLayout from '../components/layout/AdminLayout';
import { getAllReservations } from '../services/reservationService';

const GuestsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGuests = async () => {
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

        fetchGuests();
    }, []);

    // Get unique guests
    const guests = reservations.reduce((unique, reservation) => {
        const guest = reservation.guest;

        if (guest && !unique.find((item) => item._id === guest._id)) {
            unique.push(guest);
        }

        return unique;
    }, []);

    // Search guests
    const filteredGuests = guests.filter((guest) =>
        `${guest.name} ${guest.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Guest Management">
            <div className="space-y-5">
                <div>
                    <h2 className="text-xl font-semibold">Guests</h2>
                    <p className="text-sm text-gray-500">
                        View guest information and booking activity.
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-4 border-slate-200">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search guests..."
                        className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-blue-500"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <Users className="text-blue-600" />
                        <p className="mt-3 text-sm text-gray-500">
                            Total guests
                        </p>
                        <h3 className="text-2xl font-semibold">
                            {guests.length}
                        </h3>
                    </div>

                    <div className="rounded-xl border bg-white p-5 border-slate-200 shadow-md">
                        <Users className="text-green-600" />
                        <p className="mt-3 text-sm text-gray-500">
                            Total reservations
                        </p>
                        <h3 className="text-2xl font-semibold">
                            {reservations.length}
                        </h3>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border bg-white border-slate-200 shadow-md">
                    <table className="w-full min-w-[650px] text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-slate-200 shadow-md">
                            <tr>
                                <th className="p-4">Guest</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Bookings</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        Loading guests...
                                    </td>
                                </tr>
                            ) : filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        No guests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map((guest) => {
                                    const bookingCount = reservations.filter(
                                        (item) => item.guest?._id === guest._id
                                    ).length;

                                    return (
                                        <tr key={guest._id}>
                                            <td className="p-4 font-medium">
                                                {guest.name}
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {guest.email}
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {guest.phone || '—'}
                                            </td>
                                            <td className="p-4">
                                                {bookingCount}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/guests/${guest._id}`)
                                                    }
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default GuestsPage;
