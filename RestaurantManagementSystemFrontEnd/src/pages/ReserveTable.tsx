import { useState } from 'react';
import { motion } from 'framer-motion';
import { reservationApi, ReservationPayload } from '../services/api';

export const CreateReservation = () => {
  const [formData, setFormData] = useState<ReservationPayload>({
    customerName: '',
    contactNumber: '',
    email: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 1,
    specialRequests: '',
    status: 'PENDING',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await reservationApi.createReservation(formData);
      setSuccessMessage(`Reservation created for ${result.customerName}`);

      setFormData({
        customerName: '',
        contactNumber: '',
        email: '',
        reservationDate: '',
        reservationTime: '',
        numberOfGuests: 1,
        specialRequests: '',
        status: 'PENDING',
      });
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl border border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">🍽️ Create Reservation</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-600 mb-4 text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              aria-label="Customer Name"
              name="customerName"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={handleChange}
              required
              disabled={loading}
              className="p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              aria-label="Contact Number"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              disabled={loading}
              className="p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              aria-label="Email"
              name="email"
              type="email"
              placeholder="Email (Optional)"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <select
              aria-label="Reservation Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              aria-label="Reservation Date"
              name="reservationDate"
              type="date"
              value={formData.reservationDate}
              onChange={handleChange}
              required
              disabled={loading}
              className="p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              aria-label="Reservation Time"
              name="reservationTime"
              type="time"
              value={formData.reservationTime}
              onChange={handleChange}
              required
              disabled={loading}
              className="p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              aria-label="Number of Guests"
              name="numberOfGuests"
              type="number"
              min="1"
              value={formData.numberOfGuests}
              onChange={handleChange}
              required
              disabled={loading}
              className="p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <textarea
            aria-label="Special Requests"
            name="specialRequests"
            placeholder="Special Requests (Optional)"
            rows={3}
            value={formData.specialRequests}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className={`px-6 py-3 text-white font-medium rounded-xl shadow ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-800'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Reservation'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
