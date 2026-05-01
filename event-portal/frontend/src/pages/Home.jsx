import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import { toast } from 'react-toastify';

const Home = () => {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await fetchEvents(filters);
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Upcoming Events</h1>
        <p className="text-gray-500 mt-1">Browse and register for events happening around you</p>
      </div>

      <EventFilters onFilter={loadEvents} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 animate-pulse h-56" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-xl font-semibold">No events found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
