import { useState, useEffect } from "react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader, Edit2, X, Check, Mail, User, Phone, MapPin } from "lucide-react";
import { useProfile } from "@/Context/ProfileContext";
import { useTranslation } from "react-i18next";

export default function UserProfile() {
  const { t } = useTranslation('settings');
  const { profile, setProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    transactionPassword: "",
  });

  // Initialize form data when profile is available
  useEffect(() => {
    if (profile?.user) {
      setFormData({
        email: profile.user.email || "",
        name: profile.user.name || "",
        phone: profile.user.phone || "",
        address: profile.user.address || "",
        transactionPassword: profile.user.transaction_password || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await FireApi("/update", "PUT", {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      
      // Update the context with new data
      setProfile({
        ...profile,
        user: {
          ...profile.user,
          ...formData
        }
      });
      
      toast.success(response.message || t('profile.profileUpdated'));
      setEditMode(false);
    } catch (error) {
      toast.error(error.message || t('profile.profileUpdateFailed'));
    } finally {
      setIsUpdating(false);
    }
  };

  if (!profile?.user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          {t('profile.loading')}
        </span>
      </div>
    );
  }

  // Custom Input Component
  const CustomInput = ({ type = "text", name, value, onChange, label, required = false, icon: Icon }) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-3 py-2 text-sm border border-gray-300 dark:bg-none dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white ${
            Icon ? 'pl-10' : ''
          }`}
        />
      </div>
    </div>
  );

  // Custom Button Component
  const CustomButton = ({ onClick, children, variant = "primary", disabled = false, type = "button", icon: Icon }) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2";
    
    const variants = {
      primary: "bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white hover:opacity-90 disabled:opacity-50",
      outline: "border border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </button>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="dark:bg-[#2A2B2E] bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="border-b dark:border-gray-700 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold dark:text-white">{t('profile.title')}</h1>
            {!editMode && (
              <CustomButton
                onClick={() => setEditMode(true)}
                variant="outline"
                icon={Edit2}
              >
                {t('profile.editProfile')}
              </CustomButton>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {editMode ? (
            /* Edit Mode Form */
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <CustomInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                label={t('profile.email')}
                required
                icon={Mail}
              />

              <CustomInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                label={t('profile.name')}
                icon={User}
              />

              <CustomInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                label={t('profile.phone')}
                icon={Phone}
              />

              <CustomInput
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                label={t('profile.address')}
                icon={MapPin}
              />

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <CustomButton
                  type="submit"
                  variant="primary"
                  disabled={isUpdating}
                  icon={isUpdating ? Loader : Check}
                >
                  {isUpdating ? t('profile.updating') : t('profile.saveChanges')}
                </CustomButton>
                
                <CustomButton
                  onClick={() => setEditMode(false)}
                  variant="outline"
                  icon={X}
                >
                  {t('profile.cancel')}
                </CustomButton>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-[#232428] rounded-lg">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('profile.email')}
                  </h3>
                  <p className="mt-1 text-sm dark:text-white">
                    {profile.user.email || t('profile.notProvided')}
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-[#232428] rounded-lg">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('profile.name')}
                  </h3>
                  <p className="mt-1 text-sm dark:text-white">
                    {profile.user.name || t('profile.notProvided')}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-[#232428] rounded-lg">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('profile.phone')}
                  </h3>
                  <p className="mt-1 text-sm dark:text-white">
                    {profile.user.phone || t('profile.notProvided')}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-[#232428] rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" /> 
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('profile.address')}
                  </h3>
                  <p className="mt-1 text-sm dark:text-white">
                    {profile.user.address || t('profile.notProvided')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}