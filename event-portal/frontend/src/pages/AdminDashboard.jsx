import { useEffect, useState } from 'react';
import {
  fetchEvents, createEvent, updateEvent, deleteEvent, getAttendees, uploadEventImage
} from '../services/api';
import EventForm from '../components/EventForm';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiUsers, FiPlus, FiX, FiImage } from 'react-icons/fi';

const AdminDashboard = () => {
  const [events,     setEvents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [formOpen,   setFormOpen]   = useState(false);
  const [editEvent,  setEditEvent]  = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [attendees,  setAttendees]  = useState(null);
  const [attendeeEventTitle, setAttendeeEventTitle] = useState('');
  
  // Image Upload State
  const [imageUploadEvent, setImageUploadEvent] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = async () => {
    try {
      const { data } = await fetchEvents();
      setEvents(data);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditEvent(null); setFormOpen(true); };

  const openEdit = (event) => { setEditEvent(event); setFormOpen(true); };

  const closeForm = () => { setFormOpen(false); setEditEvent(null); };

  const handleSave = async ({ eventData, imageFile }) => {
    setSaving(true);
    try {
      let savedEvent;
      if (editEvent) {
        const { data } = await updateEvent(editEvent._id, eventData);
        savedEvent = data;
        toast.success('Event updated!');
      } else {
        const { data } = await createEvent(eventData);
        savedEvent = data;
        toast.success('Event created!');
      }

      // If an image file was selected, upload it immediately
      if (imageFile && savedEvent?._id) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await uploadEventImage(savedEvent._id, formData);
        toast.success('Image uploaded successfully!');
      }

      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleViewAttendees = async (event) => {
    try {
      const { data } = await getAttendees(event._id);
      setAttendees(data);
      setAttendeeEventTitle(event.title);
    } catch {
      toast.error('Failed to load attendees');
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return toast.warning('Please select an image file first');
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      
      await uploadEventImage(imageUploadEvent._id, formData);
      toast.success('Image uploaded successfully!');
      setImageUploadEvent(null);
      setUploadFile(null);
      load(); // Reload events to reflect the new image
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage events and track registrations</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          <FiPlus /> Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-600 text-white rounded-xl p-5">
          <p className="text-sm opacity-80">Total Events</p>
          <p className="text-3xl font-bold mt-1">{events.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {events.filter((e) => new Date(e.date) >= new Date()).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Past Events</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {events.filter((e) => new Date(e.date) < new Date()).length}
          </p>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 text-left w-16">Image</th>
              <th className="px-5 py-3 text-left">Title</th>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Location</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No events yet. Create one!
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    {ev.imageUrl ? (
                      <img src={ev.imageUrl} alt="Thumbnail" className="w-12 h-12 rounded object-cover border" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center border text-gray-400 text-xs">
                        <FiImage />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-800">{ev.title}</td>
                  <td className="px-5 py-4 text-gray-500">{ev.category}</td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(ev.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-gray-500">{ev.location}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewAttendees(ev)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="View Attendees"
                      >
                        <FiUsers />
                      </button>
                      <button
                        onClick={() => {
                          setImageUploadEvent(ev);
                          setUploadFile(null);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Upload Image"
                      >
                        <FiImage />
                      </button>
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(ev._id, ev.title)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Event Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
            <button
              onClick={closeForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="text-xl" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              {editEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <EventForm
              initialData={editEvent || {}}
              onSubmit={handleSave}
              loading={saving}
            />
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {attendees !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setAttendees(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="text-xl" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Attendees</h2>
            <p className="text-sm text-gray-500 mb-5">{attendeeEventTitle}</p>

            {attendees.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No registered attendees yet</p>
            ) : (
              <div className="space-y-3">
                {attendees.map((reg, i) => (
                  <div key={reg._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{reg.userId?.name}</p>
                      <p className="text-xs text-gray-500">{reg.userId?.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {imageUploadEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              onClick={() => {
                setImageUploadEvent(null);
                setUploadFile(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="text-xl" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Upload Image</h2>
            <p className="text-sm text-gray-500 mb-5">
              Upload an image for <strong>{imageUploadEvent.title}</strong>
            </p>

            <form onSubmit={handleImageUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!uploadFile || uploadingImage}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
