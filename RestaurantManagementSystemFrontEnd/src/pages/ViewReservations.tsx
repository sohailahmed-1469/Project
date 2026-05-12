import { useEffect, useState } from 'react';
import { reservationApi } from '../services/api';
import { Reservation } from '../types/auth';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaStickyNote
} from 'react-icons/fa';

type UpdatingState = {
  id: string;
  status: string;
} | null;

export const ViewReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<UpdatingState>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    setLoading(true);
    reservationApi
      .getAllReservations()
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reservations:', err);
        setLoading(false);
      });
  };

  const updateReservationStatus = (id: string, status: string) => {
    setUpdating({ id, status });
    reservationApi
      .updateReservationStatus(id, status)
      .then((updatedReservation) => {
        setReservations((prev) =>
          prev.map((res) => (res.id === id ? updatedReservation : res))
        );
      })
      .catch((error: any) => {
        console.error('Error updating reservation:', error);
        alert('Failed to update reservation status. Please try again.');
      })
      .finally(() => {
        setUpdating(null);
      });
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-300 font-poppins">
        Loading reservations...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins">
      <h1 className="text-4xl font-extrabold mt-12 mb-12 text-gray-900 dark:text-gray-100">
        All Reservations
      </h1>

      {reservations.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No reservations found.</p>
      )}

      <ul className="space-y-10">
        {reservations.map((reservation, index) => (
          <li
            key={reservation.id ?? index}
            className="relative border border-gray-300 dark:border-gray-700 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800"
          >
            {/* Buttons top-right */}
            <div className="absolute top-6 right-6 flex gap-4">
              <button
                disabled={
                  (updating?.id === reservation.id && updating?.status === 'CONFIRMED') ||
                  reservation.status === 'CONFIRMED'
                }
                onClick={() => updateReservationStatus(reservation.id, 'CONFIRMED')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-white text-sm shadow-md transition ${
                  reservation.status === 'CONFIRMED'
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {updating?.id === reservation.id && updating?.status === 'CONFIRMED' ? (
                  'Updating...'
                ) : (
                  <>
                    <FaCheckCircle className="text-lg" /> Confirm
                  </>
                )}
              </button>

              <button
                disabled={
                  (updating?.id === reservation.id && updating?.status === 'CANCELLED') ||
                  reservation.status === 'CANCELLED'
                }
                onClick={() => updateReservationStatus(reservation.id, 'CANCELLED')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-white text-sm shadow-md transition ${
                  reservation.status === 'CANCELLED'
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {updating?.id === reservation.id && updating?.status === 'CANCELLED' ? (
                  'Updating...'
                ) : (
                  <>
                    <FaTimesCircle className="text-lg" /> Cancel
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 text-gray-900 dark:text-gray-100">
              <div className="font-medium text-lg tracking-wide flex items-center gap-2">
                <FaUser /> Customer Name :
              </div>
              <div className="text-lg bg-transparent">{reservation.customerName}</div>

              <div className="font-medium text-lg tracking-wide flex items-center gap-2">
                <FaPhone /> Contact Number :
              </div>
              <div className="text-lg">{reservation.contactNumber}</div>

              {reservation.email && (
                <>
                  <div className="font-medium text-lg tracking-wide flex items-center gap-2">
                    <FaEnvelope /> Email :
                  </div>
                  <div className="text-lg">{reservation.email}</div>
                </>
              )}

              <div className="font-medium text-lg tracking-wide flex items-center gap-2">
                <FaCalendarAlt /> Reservation Date :
              </div>
              <div className="text-lg">{reservation.reservationDate}</div>

              <div className="font-medium text-lg tracking-wide flex items-center gap-2">
                <FaClock /> Reservation Time :
              </div>
              <div className="text-lg">{reservation.reservationTime}</div>

              <div className="font-medium text-lg tracking-wide flex items-center gap-2">
                <FaUsers /> Number of Guests :
              </div>
              <div className="text-lg">{reservation.numberOfGuests}</div>

              {reservation.specialRequests && (
                <>
                  <div className="font-medium text-lg tracking-wide flex items-center gap-2">
                    <FaStickyNote /> Special Requests :
                  </div>
                  <div className="text-lg italic text-gray-600 dark:text-gray-400">
                    {reservation.specialRequests}
                  </div>
                </>
              )}

              <div className="font-medium text-lg tracking-wide">Status :</div>
              <div
                className={`capitalize font-semibold ${
                  reservation.status === 'CONFIRMED'
                    ? 'text-green-600'
                    : reservation.status === 'CANCELLED'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {reservation.status}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
