import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEvent, rsvpEvent, cancelRSVP, getMyRegistrations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiCalendar, FiMapPin, FiTag, FiUser, FiArrowLeft } from 'react-icons/fi';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event,      setEvent]      = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchEvent(id);
        setEvent(data);

        if (user) {
          const { data: regs } = await getMyRegistrations();
          const found = regs.find((r) => r.eventId?._id === id || r.eventId === id);
          setRegistered(!!found);
        }
      } catch {
        toast.error('Event not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleRSVP = async () => {
    if (!user) return navigate('/login');
    setRsvpLoading(true);
    try {
      await rsvpEvent(id);
      setRegistered(true);
      toast.success('Successfully registered! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancel = async () => {
    setRsvpLoading(true);
    try {
      await cancelRSVP(id);
      setRegistered(false);
      toast.info('Registration cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
        <div className="bg-white rounded-2xl shadow p-8 h-80" />
      </div>
    );

  if (!event) return null;

  const dateStr = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-indigo-600 hover:underline text-sm mb-6"
      >
        <FiArrowLeft /> Back to Events
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Banner Image */}
        {event.imageUrl && (
          <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-100">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* Category */}
          <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
            <FiTag className="inline mr-1" />{event.category}
          </span>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-2">{event.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <FiCalendar className="text-indigo-500" /> {dateStr}
          </span>
          <span className="flex items-center gap-1">
            <FiMapPin className="text-indigo-500" /> {event.location}
          </span>
          <span className="flex items-center gap-1">
            <FiUser className="text-indigo-500" /> Organized by {event.createdBy?.name}
          </span>
        </div>

        {/* Description */}
        <div className="border-t pt-5">
          <h2 className="font-semibold text-gray-700 mb-2">About this Event</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </div>

        {/* RSVP Section */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between">
          <div>
            {registered ? (
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                ✅ You're registered!
              </span>
            ) : (
              <span className="text-sm text-gray-400">You haven't registered yet</span>
            )}
          </div>

          {user?.role !== 'admin' && (
            registered ? (
              <button
                onClick={handleCancel}
                disabled={rsvpLoading}
                className="bg-red-100 text-red-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-red-200 transition disabled:opacity-60"
              >
                {rsvpLoading ? 'Cancelling...' : 'Cancel Registration'}
              </button>
            ) : (
              <button
                onClick={handleRSVP}
                disabled={rsvpLoading}
                className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {rsvpLoading ? 'Registering...' : 'Register (RSVP)'}
              </button>
            )
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
