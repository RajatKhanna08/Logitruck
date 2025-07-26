import React, { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaShieldAlt, 
  FaEdit, 
  FaKey, 
  FaCog,
  FaRegCalendarAlt,
  FaUsers,
  FaTruck,
  FaBuilding,
  FaChartBar,
  FaClipboardList
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdAdminPanelSettings, MdOutlineDomainVerification } from 'react-icons/md';

const AdminProfile = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showActivityInfo, setShowActivityInfo] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock admin data
  const [adminData, setAdminData] = useState({
    fullName: 'John Smith',
    email: 'admin@company.com',
    phone: '9876543210',
    role: 'admin',
    profileImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    lastLogin: 'January 26, 2025 at 10:30 AM',
    joinedDate: 'March 15, 2023',
    totalUsers: 1250,
    totalOrders: 3847,
    totalCompanies: 125
  });

  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageCompanies: true,
    manageTransporters: true,
    manageDrivers: true,
    manageTrucks: true,
    manageOrders: true,
    manageReviews: true,
    viewAnalytics: true,
    manageSubscriptions: true,
    manageCommunity: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const permissionLabels = {
    manageUsers: 'Manage Users',
    manageCompanies: 'Manage Companies',
    manageTransporters: 'Manage Transporters',
    manageDrivers: 'Manage Drivers',
    manageTrucks: 'Manage Trucks',
    manageOrders: 'Manage Orders',
    manageReviews: 'Manage Reviews',
    viewAnalytics: 'View Analytics',
    manageSubscriptions: 'Manage Subscriptions',
    manageCommunity: 'Manage Community'
  };

  const recentActivities = [
    { id: 1, action: 'User Management', description: 'Updated user permissions', date: 'Jan 26, 2025', status: 'Completed' },
    { id: 2, action: 'System Maintenance', description: 'Performed database cleanup', date: 'Jan 25, 2025', status: 'Completed' },
    { id: 3, action: 'Order Review', description: 'Reviewed flagged orders', date: 'Jan 24, 2025', status: 'In Progress' },
    { id: 4, action: 'Company Verification', description: 'Verified new company registrations', date: 'Jan 23, 2025', status: 'Completed' }
  ];

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(e.target);
    
    const updatedData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone')
    };

    // Simulate API call
    setTimeout(() => {
      setAdminData(prev => ({ ...prev, ...updatedData }));
      setIsUpdating(false);
      setShowUpdateModal(false);
      alert('Profile updated successfully!');
    }, 1500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsUpdating(false);
      setShowPasswordModal(false);
      alert('Password changed successfully!');
    }, 1500);
  };

  const handlePermissionToggle = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const savePermissions = () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setShowPermissionsModal(false);
      alert('Permissions updated successfully!');
    }, 1500);
  };

  return (
    <div className="min-h-screen px-10 py-8 bg-gradient-to-tr from-yellow-50 via-white to-blue-50">
      {/* Profile Header */}
      <div className="bg-white mt-20 p-8 rounded-3xl shadow-xl border border-gray-200 mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex justify-center items-center gap-6">
            <img
              src={adminData.profileImg}
              alt="Admin Avatar"
              className="w-20 h-20 border-2 border-yellow-400 rounded-full object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold text-blue-900">{adminData.fullName}</h2>
              <div className="flex items-center gap-2 text-yellow-600 font-semibold mt-1">
                <MdAdminPanelSettings />
                <span>System Administrator</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating}
            >
              <FaEdit /> {isUpdating ? 'Updating...' : 'Update Profile'}
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
            >
              <FaKey /> Security
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-blue-900">
          <ProfileField icon={<FaUser />} label="Full Name" value={adminData.fullName} />
          <ProfileField icon={<FaEnvelope />} label="Email" value={adminData.email} />
          <ProfileField icon={<FaPhoneAlt />} label="Phone" value={adminData.phone} />
          <ProfileField icon={<FaShieldAlt />} label="Role" value="System Administrator" />
          <ProfileField icon={<FaRegCalendarAlt />} label="Last Login" value={adminData.lastLogin} />
          <ProfileField icon={<MdOutlineDomainVerification />} label="Joined Date" value={adminData.joinedDate} />

          {/* Admin Statistics Hover Card */}
          <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setShowActivityInfo(true)}
            onMouseLeave={() => setShowActivityInfo(false)}
          >
            <div className="flex items-center gap-3 font-semibold">
              <FaChartBar className="text-yellow-600" />
              <span>System Stats</span>
            </div>
            <div className="text-sm mt-1 text-gray-700">Click to view details</div>

            {showActivityInfo && (
              <div className="absolute z-50 top-12 left-0 w-64 mt-2 bg-white shadow-lg rounded-lg border border-gray-300 p-4 text-sm text-gray-800 transition-all duration-200">
                <div><strong>Total Users:</strong> {adminData.totalUsers.toLocaleString()}</div>
                <div><strong>Total Orders:</strong> {adminData.totalOrders.toLocaleString()}</div>
                <div><strong>Total Companies:</strong> {adminData.totalCompanies.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Permissions */}
          <div
            className="cursor-pointer"
            onClick={() => setShowPermissionsModal(true)}
          >
            <div className="flex items-center gap-3 font-semibold">
              <FaCog className="text-yellow-600" />
              <span>Permissions</span>
            </div>
            <div className="text-sm mt-1 text-gray-700">Manage access rights</div>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">🔧 Recent Administrative Activities</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="border rounded-xl p-4 shadow-md bg-blue-50 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-yellow-600">#{activity.id}</span>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-semibold ${
                    activity.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : activity.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
              <div className="text-gray-700 font-semibold">{activity.action}</div>
              <div className="text-gray-600 text-sm mb-2">{activity.description}</div>
              <div className="text-gray-700 flex items-center gap-2">
                <FaRegCalendarAlt /> {activity.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white mt-16 w-full max-w-2xl rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl hover:text-red-700 transition"
              disabled={isUpdating}
            >
              <IoClose />
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Edit Profile Details</h3>
            
            {isUpdating && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                Updating profile...
              </div>
            )}

            <form className="grid grid-cols-2 gap-3" onSubmit={handleProfileUpdate}>
              <Input label="Full Name" name="fullName" defaultValue={adminData.fullName} required />
              <Input label="Email" name="email" type="email" defaultValue={adminData.email} required />
              <Input label="Phone" name="phone" type="tel" defaultValue={adminData.phone} required />
              <div className="col-span-2">
                <Input label="Role" name="role" defaultValue="System Administrator" disabled />
              </div>
              
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white mt-16 w-full max-w-md rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl hover:text-red-700 transition"
              disabled={isUpdating}
            >
              <IoClose />
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Change Password</h3>
            
            {isUpdating && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                Changing password...
              </div>
            )}

            <form className="space-y-4" onSubmit={handlePasswordChange}>
              <Input 
                label="Current Password" 
                name="currentPassword" 
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required 
              />
              <Input 
                label="New Password" 
                name="newPassword" 
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required 
              />
              <Input 
                label="Confirm New Password" 
                name="confirmPassword" 
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required 
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white mt-16 w-full max-w-3xl rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowPermissionsModal(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl hover:text-red-700 transition"
              disabled={isUpdating}
            >
              <IoClose />
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Manage Permissions</h3>
            
            {isUpdating && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                Updating permissions...
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.entries(permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div>
                    <h4 className="font-semibold text-gray-800">{permissionLabels[key]}</h4>
                    <p className="text-sm text-gray-600">Access to {permissionLabels[key].toLowerCase()}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handlePermissionToggle(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setShowPermissionsModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                onClick={savePermissions}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-3 font-semibold">
      <span className="text-yellow-600">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="text-md mt-1 text-gray-700">{value}</div>
  </div>
);

const Input = ({ label, name, defaultValue, value, onChange, type = "text", required = false, disabled = false }) => (
  <div>
    <label className="block mb-1 font-semibold text-sm text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition ${
        disabled ? 'bg-gray-100 text-gray-500' : ''
      }`}
    />
  </div>
);

export default AdminProfile;