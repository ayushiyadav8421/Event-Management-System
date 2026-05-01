import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiTag } from 'react-icons/fi';

const categoryColors = {
  Tech:      'bg-blue-100 text-blue-700',
  Cultural:  'bg-pink-100 text-pink-700',
  Sports:    'bg-green-100 text-green-700',
  Academic:  'bg-yellow-100 text-yellow-700',
  Workshop:  'bg-purple-100 text-purple-700',
  Other:     'bg-gray-100 text-gray-600',
};

const EventCard = ({ event }) => {
  const dateStr = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col border border-gray-100 overflow-hidden">
      {/* Event Image */}
      {event.imageUrl ? (
        <div className="h-48 w-full bg-gray-200">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center">
          <FiCalendar className="text-4xl text-indigo-300" />
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category Badge */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full w-fit flex items-center gap-1 ${
            categoryColors[event.category] || categoryColors.Other
          }`}
        >
          <FiTag className="text-xs" /> {event.category}
        </span>

      {/* Title */}
      <h2 className="text-lg font-bold text-gray-800 leading-snug">{event.title}</h2>

      {/* Description (truncated) */}
      <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>

      {/* Meta */}
      <div className="flex flex-col gap-1 text-sm text-gray-500 mt-auto">
        <span className="flex items-center gap-1">
          <FiCalendar className="text-indigo-500" /> {dateStr}
        </span>
        <span className="flex items-center gap-1">
          <FiMapPin className="text-indigo-500" /> {event.location}
        </span>
      </div>

      {/* View Button */}
      <Link
        to={`/events/${event._id}`}
        className="mt-2 text-center bg-indigo-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        View Details
      </Link>
      </div>
    </div>
  );
};

export default EventCard;
