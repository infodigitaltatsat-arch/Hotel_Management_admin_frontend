import { useEffect, useState } from 'react';

const emptyForm = {
    roomNumber: '',
    roomType: '',
    floor: '',
    capacity: '2',
    pricePerNight: '',
    weekdayRate: '',
    weekendRate: '',
    amenities: ''
};

const RoomForm = ({ initialData, onSubmit, onCancel, saving }) => {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setForm({
                roomNumber: initialData.roomNumber || '',
                roomType: initialData.roomType || '',
                floor: initialData.floor ?? '',
                capacity: initialData.capacity ?? '2',
                pricePerNight: initialData.pricePerNight ?? '',
                weekdayRate: initialData.weekdayRate ?? '',
                weekendRate: initialData.weekendRate ?? '',
                amenities: Array.isArray(initialData.amenities)
                    ? initialData.amenities.join(', ')
                    : ''
            });
        } else {
            setForm(emptyForm);
        }
    }, [initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (
            !form.roomNumber.trim() ||
            !form.roomType.trim() ||
            form.floor === '' ||
            form.capacity === '' ||
            form.pricePerNight === ''
        ) {
            setError('Please fill in all required fields.');
            return;
        }

        const roomData = {
            roomNumber: form.roomNumber.trim(),
            roomType: form.roomType.trim(),
            floor: Number(form.floor),
            capacity: Number(form.capacity),
            pricePerNight: Number(form.pricePerNight),
            weekdayRate: Number(form.weekdayRate || form.pricePerNight),
            weekendRate: Number(form.weekendRate || form.pricePerNight),
            amenities: form.amenities
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
        };

        try {
            await onSubmit(roomData);
        } catch (err) {
            setError(err.message || 'Unable to save room.');
        }
    };

    const fields = [
        { name: 'roomNumber', label: 'Room number', type: 'text', required: true },
        { name: 'roomType', label: 'Room type', type: 'text', required: true },
        { name: 'floor', label: 'Floor', type: 'number', required: true },
        { name: 'capacity', label: 'Guest capacity', type: 'number', required: true },
        { name: 'pricePerNight', label: 'Base price per night (₹)', type: 'number', required: true },
        { name: 'weekdayRate', label: 'Weekday rate (₹)', type: 'number' },
        { name: 'weekendRate', label: 'Weekend rate (₹)', type: 'number' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.name}>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                        </label>

                        <input
                            type={field.type}
                            name={field.name}
                            min={field.type === 'number' ? '0' : undefined}
                            value={form[field.name]}
                            onChange={handleChange}
                            required={field.required}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                ))}
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Amenities
                </label>

                <input
                    type="text"
                    name="amenities"
                    value={form.amenities}
                    onChange={handleChange}
                    placeholder="Wi-Fi, AC, TV, Mini Bar"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                    Separate amenities with commas.
                </p>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : initialData ? 'Update room' : 'Create room'}
                </button>
            </div>
        </form>
    );
};

export default RoomForm;