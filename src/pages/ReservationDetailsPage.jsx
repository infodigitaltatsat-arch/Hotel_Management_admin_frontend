import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    CalendarDays,
    User,
    BedDouble,
    IndianRupee,
    LogIn,
    LogOut,
    RefreshCw
} from 'lucide-react';

import AdminLayout from '../components/layout/AdminLayout';
import {
    getReservationById,
    checkInGuest,
    checkOutGuest
} from '../services/reservationService';

import {
    getReservationPayments,
    recordPayment
} from '../services/paymentService';

const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const getReservation = (response) => {
    return response?.reservation || response?.data?.reservation || response?.data || response;
};

const ReservationDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paymentType, setPaymentType] = useState('payment');
    const [paymentNote, setPaymentNote] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState('');

    const fetchPayments = async () => {
        try {
            const response = await getReservationPayments(id);
            setPaymentInfo(response.data);
        } catch (error) {
            setPaymentError(err.response?.data?.message || 'Unable to load the payment');

        }

    }

    const fetchReservation = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await getReservationById(id);
            setReservation(getReservation(response));
            await fetchPayments();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load reservation details.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservation();
    }, [id]);


    const handleRecordPayment = async(e)=>{
        e.preventDefault();

        try{
            setPaymentLoading(true);
            setPaymentError('');
            setPaymentSuccess('');

            await recordPayment({
                reservationId: id,
                amount: Number(paymentAmount),
                method:paymentMethod,
                type:paymentType,
                note:paymentNote
            });

            setPaymentAmount('');
            setPaymentNote('');
            setPaymentSuccess('Payment recorded successfully');

            await fetchPayments();
            await fetchReservation();
        }catch(err){
            setPaymentError(err.response?.data?.message || 'Unable to record payment');
        }finally{
            setPaymentLoading(false);
        }
    }





    const handleCheckIn = async () => {
        try {
            setActionLoading(true);
            setError('');

            await checkInGuest(id);
            await fetchReservation();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Check-in failed. Please try again.'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setActionLoading(true);
            setError('');

            await checkOutGuest(id);
            await fetchReservation();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Check-out failed. Please try again.'
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Reservation Details">
                <div className="flex min-h-64 items-center justify-center gap-2 text-gray-500">
                    <RefreshCw className="animate-spin" size={18} />
                    Loading reservation...
                </div>
            </AdminLayout>
        );
    }

    if (!reservation) {
        return (
            <AdminLayout title="Reservation Details">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error || 'Reservation not found.'}
                    <button
                        onClick={() => navigate('/reservations')}
                        className="mt-4 block font-medium underline"
                    >
                        Back to reservations
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const guest = reservation.guest || {};
    const room = reservation.room || {};

    const status = String(reservation.bookingStatus || '').toLowerCase();
    const canCheckIn = ['confirmed', 'booked'].includes(status);
    const canCheckOut = ['checked_in', 'checked-in'].includes(status);

    return (
        <AdminLayout title="Reservation Details">
            <div className="space-y-6">
                <button
                    onClick={() => navigate('/reservations')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={18} />
                    Back to reservations
                </button>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm text-gray-500">Booking reference</p>
                        <h2 className="mt-1 text-xl font-semibold text-gray-900">
                            {reservation.bookingReference || reservation._id}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Status: {reservation.bookingStatus || 'Unknown'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {canCheckIn && (
                            <button
                                onClick={handleCheckIn}
                                disabled={actionLoading}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <LogIn size={17} />
                                Check in
                            </button>
                        )}

                        {canCheckOut && (
                            <button
                                onClick={handleCheckOut}
                                disabled={actionLoading}
                                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                <LogOut size={17} />
                                Check out
                            </button>
                        )}

                        <button
                            onClick={fetchReservation}
                            disabled={actionLoading}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    <section className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <User className="text-blue-600" size={20} />
                            <h3 className="font-semibold text-gray-900">Guest information</h3>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">Guest name</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {guest.name || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {guest.email || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {guest.phone || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Number of guests</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {reservation.numberOfGuests ?? '—'}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <BedDouble className="text-blue-600" size={20} />
                            <h3 className="font-semibold text-gray-900">Room information</h3>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500">Room number</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {room.roomNumber || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Room type</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {room.roomType || room.type || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Floor</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {room.floor ?? '—'}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <CalendarDays className="text-blue-600" size={20} />
                            <h3 className="font-semibold text-gray-900">Stay information</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Check-in date</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {formatDate(reservation.checkIn)}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">Check-out date</p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {formatDate(reservation.checkOut)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-gray-200 bg-white p-5">
    <div className="mb-5 flex items-center gap-2">
        <IndianRupee className="text-blue-600" size={20} />
        <h3 className="font-semibold text-gray-900">Payment information</h3>
    </div>

    <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
            <p className="text-gray-500">Total</p>
            <p className="mt-1 font-semibold">
                ₹{Number(reservation.totalPrice || 0).toLocaleString('en-IN')}
            </p>
        </div>

        <div>
            <p className="text-gray-500">Paid</p>
            <p className="mt-1 font-semibold text-green-600">
                ₹{Number(paymentInfo?.totalPaid || 0).toLocaleString('en-IN')}
            </p>
        </div>

        <div>
            <p className="text-gray-500">Balance</p>
            <p className="mt-1 font-semibold text-red-600">
                ₹{Number(paymentInfo?.balance ?? reservation.totalPrice).toLocaleString('en-IN')}
            </p>
        </div>
    </div>

    <p className="mt-4 text-sm">
        Payment status: <strong>{reservation.paymentStatus}</strong>
    </p>

    {paymentError && (
        <p className="mt-3 text-sm text-red-600">{paymentError}</p>
    )}

    {paymentSuccess && (
        <p className="mt-3 text-sm text-green-600">{paymentSuccess}</p>
    )}

    {Number(paymentInfo?.balance ?? reservation.totalPrice) > 0 && (
        <form onSubmit={handleRecordPayment} className="mt-6 space-y-3 border-t pt-5">
            <h4 className="font-semibold">Record payment</h4>

            <input
                type="number"
                min="0.01"
                max={paymentInfo?.balance ?? reservation.totalPrice}
                step="0.01"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-lg border p-3 text-sm"
            />

            <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border p-3 text-sm"
            >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank transfer</option>
                <option value="other">Other</option>
            </select>

            <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full rounded-lg border p-3 text-sm"
            >
                <option value="payment">Payment</option>
                <option value="deposit">Deposit</option>
            </select>

            <input
                type="text"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="Note (optional)"
                maxLength="300"
                className="w-full rounded-lg border p-3 text-sm"
            />

            <button
                type="submit"
                disabled={paymentLoading || !paymentAmount || Number(paymentAmount) <= 0}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {paymentLoading ? 'Recording...' : 'Record payment'}
            </button>
        </form>
    )}

    <div className="mt-6 border-t pt-5">
        <h4 className="mb-3 font-semibold">Payment history</h4>

        {paymentInfo?.payments?.length ? (
            <div className="space-y-3">
                {paymentInfo.payments.map((payment) => (
                    <div
                        key={payment._id}
                        className="rounded-lg bg-gray-50 p-3 text-sm"
                    >
                        <div className="flex justify-between gap-2">
                            <strong>
                                ₹{Number(payment.amount).toLocaleString('en-IN')}
                            </strong>
                            <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                        </div>

                        <p className="mt-1 text-gray-500">
                            {payment.type} · {formatDate(payment.createdAt)}
                        </p>

                        <p className="text-gray-500">
                            Received by: {payment.receivedBy?.name || 'Staff'}
                        </p>

                        {payment.note && (
                            <p className="mt-1 text-gray-600">{payment.note}</p>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-sm text-gray-500">No payments recorded yet.</p>
        )}
    </div>
</section>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReservationDetailsPage;