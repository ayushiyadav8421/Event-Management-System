import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiShield, FiLogOut } from 'react-icons/fi';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getMe();
        setProfile(data);
      } catch (err) {
        toast.error('Failed to load profile');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-600 text-white rounded-full p-6">
                <FiUser className="text-4xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-500 text-sm mt-1">User Profile</p>
          </div>

          {/* Profile Info */}
          <div className="space-y-4 mb-8">
            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <FiMail className="text-indigo-600 text-xl mt-1" />
              <div>
                <p className="text-sm text-gray-500 font-semibold">Email</p>
                <p className="text-gray-800">{profile.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <FiShield className="text-indigo-600 text-xl mt-1" />
              <div>
                <p className="text-sm text-gray-500 font-semibold">Role</p>
                <p className="text-gray-800 capitalize">
                  {profile.role === 'admin' ? (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-semibold">
                      {profile.role}
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-semibold">
                      {profile.role}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 font-semibold">Member Since</p>
              <p className="text-gray-800">
                {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
