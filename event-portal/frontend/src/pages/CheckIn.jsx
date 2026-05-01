import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyRegistrations, checkInEvent } from '../services/api';
import { toast } from 'react-toastify';
import { FiCamera, FiCheck, FiAlertCircle, FiVideo, FiVideoOff } from 'react-icons/fi';
import { Scanner } from '@yudiel/react-qr-scanner';

const CheckIn = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [qrInput, setQrInput] = useState('');
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const { data } = await getMyRegistrations();
        setRegistrations(data);
      } catch (err) {
        toast.error('Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadRegistrations();
    }
  }, [user]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !qrInput.trim()) {
      toast.warning('Please select an event and scan QR code');
      return;
    }

    try {
      await checkInEvent(selectedEvent._id, { qrCode: qrInput });
      setCheckInStatus({ success: true, message: 'Successfully checked in!' });
      setQrInput('');
      toast.success('✅ Check-in successful!');
      
      setTimeout(() => setCheckInStatus(null), 3000);
      inputRef.current?.focus();
    } catch (err) {
      setCheckInStatus({ success: false, message: err.response?.data?.message || 'Check-in failed' });
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please login to check in</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-600 text-white rounded-full p-4">
                <FiCamera className="text-3xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Event Check-In</h1>
            <p className="text-gray-500 text-sm mt-2">Scan QR code to check in to your event</p>
          </div>

          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No registered events found</p>
            </div>
          ) : (
            <form onSubmit={handleCheckIn} className="space-y-6">
              {/* Select Event */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Event *
                </label>
                <select
                  value={selectedEvent?._id || ''}
                  onChange={(e) => {
                    const event = registrations.find(
                      (r) => r.eventId._id === e.target.value
                    );
                    setSelectedEvent(event?.eventId);
                  }}
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                >
                  <option value="">Choose an event...</option>
                  {registrations.map((reg) => (
                    <option key={reg.eventId._id} value={reg.eventId._id}>
                      {reg.eventId.title} -{' '}
                      {new Date(reg.eventId.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* QR Code Input */}
              {selectedEvent && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Scan QR Code *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCameraOpen(!isCameraOpen);
                        setCameraError('');
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 focus:outline-none"
                    >
                      {isCameraOpen ? <FiVideoOff /> : <FiVideo />}
                      {isCameraOpen ? 'Close Camera' : 'Open Camera'}
                    </button>
                  </div>

                  {isCameraOpen && (
                    <div className="mb-4">
                      {cameraError && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-3 border border-red-200">
                          <strong>Camera Error:</strong> {cameraError}
                          <p className="mt-1 text-xs">Ensure you have granted camera permissions and are using a secure connection (localhost or HTTPS).</p>
                        </div>
                      )}
                      <div className="rounded-lg overflow-hidden border-2 border-indigo-200 bg-gray-900 min-h-[300px] relative flex items-center justify-center">
                        <Scanner 
                          onScan={(result) => {
                            if (result && result.length > 0) {
                              setQrInput(result[0].rawValue);
                              setIsCameraOpen(false);
                              setCameraError('');
                              toast.info('QR Code scanned successfully! Click Check In to proceed.');
                            }
                          }} 
                          onError={(error) => {
                            console.log('Scanner error:', error);
                            setCameraError(error?.message || 'Unable to access camera or camera not found.');
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="Click here and scan QR code..."
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Make sure your camera/scanner is ready
                  </p>
                </div>
              )}

              {/* Status Message */}
              {checkInStatus && (
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    checkInStatus.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {checkInStatus.success ? (
                    <FiCheck className="text-green-600 text-xl mt-1" />
                  ) : (
                    <FiAlertCircle className="text-red-600 text-xl mt-1" />
                  )}
                  <p
                    className={`text-sm ${
                      checkInStatus.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {checkInStatus.message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedEvent || !qrInput.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <FiCheck /> Check In
              </button>
            </form>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Ask the event organizer for the QR code. You can also use a mobile scanner or camera app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
