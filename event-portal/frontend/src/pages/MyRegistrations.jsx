import { useEffect, useState } from 'react';
import { getMyRegistrations, cancelRSVP } from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCalendar, FiMapPin, FiTag, FiX } from 'react-icons/fi';

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-700',
  Cultural: 'bg-pink-100 text-pink-700',
  Sports: 'bg-green-100 text-green-700',
  Academic: 'bg-yellow-100 text-yellow-700',
  Workshop: 'bg-purple-100 text-purple-700',
  Other: 'bg-gray-100 text-gray-600',
};

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading,       setLoading]       = useState(true);

  const load = async () => {
    try {
      const { data } = await getMyRegistrations();
      setRegistrations(data);
    } catch {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (eventId) => {
    try {
      await cancelRSVP(eventId);
      toast.info('Registration cancelled');
      load();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">My Registrations</h1>
      <p className="text-gray-500 text-sm mb-6">Events you've signed up for</p>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-xl font-semibold">No registrations yet</p>
          <Link to="/" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
            Browse Events →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const event = reg.eventId;
            if (!event) return null;
            const dateStr = new Date(event.date).toLocaleDateString('en-IN', {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            });
            return (
              <div
                key={reg._id}
                className="bg-white rounded-xl shadow p-5 flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${categoryColors[event.category] || categoryColors.Other}`}>
                    <FiTag className="inline mr-1" />{event.category}
                  </span>
                  <Link
                    to={`/events/${event._id}`}
                    className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition"
                  >
                    {event.title}
                  </Link>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-indigo-400" />{dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-indigo-400" />{event.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(event._id)}
                  className="flex items-center gap-1 text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition whitespace-nowrap"
                >
                  <FiX /> Cancel
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
