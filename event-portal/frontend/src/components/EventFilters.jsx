import { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Other'];

const EventFilters = ({ onFilter }) => {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [date,     setDate]     = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ search, category, date, location });
  };

  const handleReset = () => {
    setSearch(''); setCategory(''); setDate(''); setLocation('');
    onFilter({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-3 items-end mb-6"
    >
      {/* Search */}
      <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg pl-9 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
        <input
          type="text"
          placeholder="City / Venue"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <FiFilter /> Filter
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
        >
          <FiX /> Reset
        </button>
      </div>
    </form>
  );
};

export default EventFilters;
