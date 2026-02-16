import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Upload } from 'lucide-react';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();

  // Profile state
  const [fullName, setFullName] = useState('John Smith');
  const [email, setEmail] = useState('john.smith@example.com');
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences state
  const [theme, setTheme] = useState<'Light' | 'Dark' | 'Auto'>('Auto');
  const [language, setLanguage] = useState<'English' | 'Urdu'>('English');
  const [timezone, setTimezone] = useState<string>('Asia/Karachi');

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [browserNotifications, setBrowserNotifications] = useState<boolean>(true);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(false);

  // Validation and feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password validations
    if (newPassword || confirmPassword || currentPassword) {
      if (newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters long.';
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'New password and confirmation do not match.';
      }
      if (!currentPassword) {
        newErrors.currentPassword = 'Please enter your current password to update.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Mock save
    setTimeout(() => {
      setSuccessMessage('Settings saved successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 600);
  };

  const handleCancel = () => navigate('/');

  const handleProfileUploadClick = () => fileInputRef.current?.click();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        </div>
        {successMessage && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200">
            <CheckCircle size={16} />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-600">Update your personal details and profile photo.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleProfileUploadClick}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload size={16} /> Upload Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full p-2 border rounded bg-white"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <div className="mt-1 p-2 border rounded bg-gray-50 text-gray-700">OP-8821-X</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <div className="mt-1 p-2 border rounded bg-gray-50 text-gray-700">Operations Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            <p className="text-sm text-gray-600">Manage your account password.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full p-2 border rounded bg-white"
                />
                {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full p-2 border rounded bg-white"
                  />
                  {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full p-2 border rounded bg-white"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  // Trigger validation-only for password section
                  const pwErrors: Record<string, string> = {};
                  if (newPassword.length < 8) pwErrors.newPassword = 'New password must be at least 8 characters long.';
                  if (newPassword !== confirmPassword) pwErrors.confirmPassword = 'New password and confirmation do not match.';
                  if (!currentPassword) pwErrors.currentPassword = 'Please enter your current password to update.';
                  setErrors({ ...errors, ...pwErrors });
                  if (Object.keys(pwErrors).length === 0) {
                    alert('Password updated (Mock).');
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 hover:bg-black text-white"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            <p className="text-sm text-gray-600">Customize your experience.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Theme</label>
                  <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="mt-1 w-full p-2 border rounded bg-white">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="mt-1 w-full p-2 border rounded bg-white">
                    <option>English</option>
                    <option>Urdu</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white" />
                <p className="mt-1 text-xs text-gray-500">Default: Asia/Karachi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">Choose how we notify you.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email Notifications</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors relative">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Browser Notifications</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={browserNotifications} onChange={(e) => setBrowserNotifications(e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors relative">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Sound Alerts</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={soundAlerts} onChange={(e) => setSoundAlerts(e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors relative">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
            <p className="text-sm text-gray-600">Read-only details.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-gray-500">Last Login</span>
                  <span className="text-sm text-gray-900">Jan 23, 2026 09:42 AM</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Account Created</span>
                  <span className="text-sm text-gray-900">Dec 05, 2024</span>
                </div>
              </div>
              <div>
                <span className="block text-xs text-gray-500">App Version</span>
                <span className="text-sm text-gray-900">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Save Changes</button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;