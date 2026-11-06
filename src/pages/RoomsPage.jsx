import { useEffect, useMemo, useState } from 'react';
import {
    Search,
    RefreshCw,
    BedDouble,
    Users,
    IndianRupee,
    Plus,
    Ban,
    Pencil,
    X
} from 'lucide-react';

import AdminLayout from '../components/layout/AdminLayout';
import { getAllRooms, deactivateRoom, createRoom, updateRoom } from '../services/roomServices';
import RoomForm from '../components/rooms/RoomsForm'
const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState('');

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await getAllRooms();
            setRooms(response.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load rooms.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                room.roomNumber?.toLowerCase().includes(searchText) ||
                room.roomType?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && room.isActive) ||
                (statusFilter === 'inactive' && !room.isActive);

            return matchesSearch && matchesStatus;
        });
    }, [rooms, search, statusFilter]);

    const handleDeactivate = async (room) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate room ${room.roomNumber}?`
        );

        if (!confirmed) return;

        try {
            setActionLoading(room._id);
            setError('');

            await deactivateRoom(room._id);

            setRooms((previousRooms) =>
                previousRooms.filter((item) => item._id !== room._id)
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to deactivate this room.'
            );
        } finally {
            setActionLoading('');
        }
    };

    const handleSaveRoom = async (roomData) => {
        try {
            setSaving(true)
            setError('');

            if (editingRoom) {
                await
                    updateRoom(editingRoom._id, roomData);
            } else {
                await createRoom(roomData);

            }
            setShowForm(false);
            setEditingRoom(null);
            await fetchRooms();

        } catch (err) {
            throw new Error(err.response?.data?.message || 'Unable to save room.')
        } finally {
            setSaving(false);
        }
    }

    const activeCount = rooms.filter((room) => room.isActive).length;
    const inactiveCount = rooms.length - activeCount;

    return (
        <AdminLayout title="Room Management">
            <div className="space-y-6">

                {/* Page heading */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Rooms
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your hotel's room inventory.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingRoom(null);
                            setShowForm(true);
                        }}
                        className='flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 '
                    >
                        <Plus size={18} />
                        Add room
                    </button>
                </div>

                {/* Add rooms details */}
                {showForm && (
                    <div className="rounded-xl border border-slate-200 shadow-md bg-white p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingRoom ? 'Edit room' : 'Add new room'}
                            </h3>

                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingRoom(null);
                                }}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <RoomForm
                            initialData={editingRoom}
                            onSubmit={handleSaveRoom}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingRoom(null);
                            }}
                            saving={saving}
                        />
                    </div>
                )}

                {/* Summary cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 shadow-md bg-white p-5">
                        <p className="text-sm text-gray-500">Total rooms</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {rooms.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 shadow-md bg-white p-5">
                        <p className="text-sm text-gray-500">Active rooms</p>
                        <p className="mt-2 text-2xl font-semibold text-green-600">
                            {activeCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 shadow-md bg-white p-5">
                        <p className="text-sm text-gray-500">Inactive rooms</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-600">
                            {inactiveCount}
                        </p>
                    </div>
                </div>

                {/* Search and filters */}
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by room number or type..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="all">All rooms</option>
                        <option value="active">Active rooms</option>
                        <option value="inactive">Inactive rooms</option>
                    </select>

                    <button
                        onClick={fetchRooms}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-white hover:bg-blue-600 disabled:opacity-50 bg-blue-500 "
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? 'animate-spin' : ''}
                        />
                        Refresh
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Room table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="border-b bg-gray-50 text-gray-500 border-slate-200 shadow-md">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Room</th>
                                    <th className="px-5 py-4 font-medium">Type</th>
                                    <th className="px-5 py-4 font-medium">Floor</th>
                                    <th className="px-5 py-4 font-medium">Capacity</th>
                                    <th className="px-5 py-4 font-medium">Price / night</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-12 text-center text-gray-500">
                                            Loading rooms...
                                        </td>
                                    </tr>
                                ) : filteredRooms.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-12 text-center text-gray-500">
                                            No rooms found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRooms.map((room) => (
                                        <tr key={room._id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <BedDouble size={17} className="text-gray-400" />
                                                    {room.roomNumber}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {room.roomType}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {room.floor}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Users size={15} />
                                                    {room.capacity}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <IndianRupee size={14} />
                                                    {Number(room.pricePerNight || 0).toLocaleString('en-IN')}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${room.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {room.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                {room.isActive && (
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setEditingRoom(room);
                                                                setShowForm(true);
                                                            }}
                                                            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Pencil size={15} />
                                                            Edit
                                                        </button>

                                                        {room.isActive && (
                                                            <button
                                                                onClick={() => handleDeactivate(room)}
                                                                disabled={actionLoading === room._id}
                                                                className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                                                            >
                                                                <Ban size={15} />
                                                                {actionLoading === room._id ? 'Deactivating...' : 'Deactivate'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {!room.isActive && (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-gray-200 px-5 py-3 text-xs text-gray-500">
                        Showing {filteredRooms.length} of {rooms.length} rooms
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default RoomsPage;