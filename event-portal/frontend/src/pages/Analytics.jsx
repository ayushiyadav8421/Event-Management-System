import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchEvents, getAttendees, getEventAnalytics } from '../services/api';
import { toast } from 'react-toastify';
import { FiBarChart2, FiUsers, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/');
      return;
    }

    const loadEvents = async () => {
      try {
        const { data } = await fetchEvents();
        const adminEvents = data.filter((e) => e.createdBy._id === user._id);
        setEvents(adminEvents);
      } catch (err) {
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [user, navigate]);

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setStatsLoading(true);

    try {
      const [attendeesRes, analyticsRes] = await Promise.all([
        getAttendees(event._id),
        getEventAnalytics(event._id),
      ]);

      setAnalytics({
        attendees: attendeesRes.data,
        stats: analyticsRes.data,
      });
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setStatsLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FiBarChart2 /> Event Analytics
          </h1>
          <p className="text-gray-500">View detailed statistics for your events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event List */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Your Events</h2>

            {events.length === 0 ? (
              <p className="text-gray-500 text-sm">No events created yet</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.map((event) => (
                  <button
                    key={event._id}
                    onClick={() => handleSelectEvent(event)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedEvent?._id === event._id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="font-semibold text-sm">{event.title}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Analytics Details */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <>
                {statsLoading ? (
                  <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center h-96">
                    <div className="animate-spin">Loading analytics...</div>
                  </div>
                ) : analytics ? (
                  <div className="space-y-6">
                    {/* Event Info */}
                    <div className="bg-white rounded-xl shadow p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {selectedEvent.title}
                      </h2>

                      <div className="grid grid-cols-3 gap-4">
                        {/* Total Registrations */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                          <p className="text-gray-600 text-sm font-semibold">Total Registrations</p>
                          <p className="text-3xl font-bold text-blue-600 mt-2">
                            {analytics.attendees.length}
                          </p>
                        </div>

                        {/* Checked In */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <p className="text-gray-600 text-sm font-semibold">Checked In</p>
                          <p className="text-3xl font-bold text-green-600 mt-2">
                            {analytics.stats?.checkedIn || 0}
                          </p>
                        </div>

                        {/* Check-in Rate */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                          <p className="text-gray-600 text-sm font-semibold">Check-in Rate</p>
                          <p className="text-3xl font-bold text-purple-600 mt-2">
                            {analytics.attendees.length > 0
                              ? Math.round(
                                  ((analytics.stats?.checkedIn || 0) /
                                    analytics.attendees.length) *
                                    100
                                )
                              : 0}
                            %
                          </p>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCalendar className="text-indigo-600" />
                          {new Date(selectedEvent.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-gray-600">{selectedEvent.location}</div>
                      </div>
                    </div>

                    {/* Attendees List */}
                    <div className="bg-white rounded-xl shadow p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FiUsers /> Attendees ({analytics.attendees.length})
                      </h3>

                      {analytics.attendees.length === 0 ? (
                        <p className="text-gray-500 text-sm">No attendees yet</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {analytics.attendees.map((attendee, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                            >
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {attendee.userId.name}
                                </p>
                                <p className="text-gray-500 text-xs">{attendee.userId.email}</p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                  attendee.checkedIn
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {attendee.checkedIn ? '✓ Checked In' : 'Registered'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow p-12 flex items-center justify-center h-96">
                <div className="text-center">
                  <FiBarChart2 className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Select an event to view analytics</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
