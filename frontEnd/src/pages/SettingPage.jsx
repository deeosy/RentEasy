import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Edit3, Save, X, User, Mail, Phone, Upload, Check, AlertCircle, Loader2, Lock, Plus, X as CloseIcon } from 'lucide-react';
import defaultUser from '../icons/defaultUser.svg';
import { storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import usePropertyStore from '../store/usePropertyStore';
import { toast } from 'react-toastify';
import axios from 'axios';

const SettingPage = () => {
  const { user, checkAuth } = usePropertyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  // Fetch JWT token from the backend on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('https://renteasy-m3ux.onrender.com/api/users', { withCredentials: true });
        if (response.status === 200) {
          const { firebaseToken, token } = response.data;
          setAuthToken(token); // Set the token from response.data.token
          await checkAuth();
        }
      } catch (err) {
        console.error('Failed to fetch auth token: ', err);
      } finally {
        setIsTokenLoading(false); // Set loading to false regardless of success/failure
      }
    };
    fetchToken();
  }, [checkAuth]);

  // Initialize useForm unconditionally
  const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      firstName: user?.firstName || 'Forrest',
      lastName: user?.lastName || 'Snowden',
      username: user?.username || 'forrestSnow',
      email: user?.email || 'forrest.snow@example.com',
      phone: user?.phone || '+1 (555) 123-4567',
      password: '********',
    },
    mode: 'onChange',
  });

  const formData = watch();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setUpdateStatus(null);
    setErrorMessage('');

    try {
      // Upload image to Firebase Storage if a new file is selected
      let newProfileImage = profileImage;
      if (document.querySelector('input[type="file"]').files[0]) {
        const file = document.querySelector('input[type="file"]').files[0];
        const userId = auth.currentUser?.uid || user.id;
        const storageRef = ref(storage, `profileImages/${userId}/${file.name}`);
        await uploadBytes(storageRef, file);
        newProfileImage = await getDownloadURL(storageRef);
        setProfileImage(newProfileImage); // Update local state with new image URL
      }

      // Update profile including the new or existing profile image
      const response = await fetch('https://renteasy-m3ux.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || 'demo-token'}`,
        },
        body: JSON.stringify({ ...data, profileImage: newProfileImage }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await checkAuth();
      setUpdateStatus('success');
      setIsEditing(false);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateStatus('error');
      setErrorMessage(error.message || 'Something went wrong while updating your profile. Please try again.');
    } finally {
      setIsLoading(false);
      // Reset file input after submission
      document.querySelector('input[type="file"]').value = '';
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setUpdateStatus(null);
    setErrorMessage('');
    setProfileImage(user?.profileImage || defaultUser); // Reset to stored or default image
    document.querySelector('input[type="file"]').value = ''; // Clear file input on cancel
  };

	// function to remove profile image
	const removeImage = () => {
		setProfileImage(defaultUser) // reset to default image
	}

  // Render logic based on isTokenLoading
  if (isTokenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className='animate-spin rounded-full h-14 w-14 border-t-2 border-b-2  border-indigo-600  mx-auto'></div>
          <p className="mt-4">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-indigo-900 mb-2'>Account Profile</h1>
          <p className='text-indigo-600'>Manage your profile information and settings</p>
        </div>

        {/* Status Messages */}
        {updateStatus === 'success' && (
          <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
            <div className='flex items-center'>
              <Check className='text-green-600 mr-2' size={20} />
              <span className='text-green-800 font-medium'>Profile updated successfully!</span>
            </div>
          </div>
        )}

        {updateStatus === 'error' && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <div className='flex items-center'>
              <AlertCircle className='text-red-600 mr-2' size={20} />
              <span className='text-red-800 font-medium'>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className='bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden'>
          {/* Profile Content */}
          <div className='p-8'>
            <div className='flex flex-col lg:flex-row gap-8'>
              {/* Profile Image Section - Left Side */}
              <div className='lg:w-1/3'>
                <div className='bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 text-center'>
                  <h3 className='text-xl font-semibold text-indigo-900 mb-6'>Profile Picture</h3>
                  <div className='relative inline-block mb-6'>
                    <div className='w-48 h-48 rounded-full overflow-hidden bg-white shadow-lg mx-auto'>
                      <img src={profileImage} alt="Profile" className='w-full h-full object-cover object-center' />
                    </div>
										{/* Show close icon if editing and image is not the default */}
										{isEditing && profileImage !== defaultUser && (
                      <button
                        type="button"
                        onClick={removeImage} // Trigger remove image
                        className='absolute -top-1 right-3 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors cursor-pointer'
                      >
                        <CloseIcon size={20} />
                      </button>											
										)}
                    {/* Show plus icon only when editing */}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => document.querySelector('input[type="file"]').click()} // Trigger file input click
                        className='absolute -bottom-2 right-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer'
                      >
                        <Plus size={20} />
                      </button>
                    )}
                    {isEditing && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) setProfileImage(URL.createObjectURL(e.target.files[0])); // Preview image
                        }}
                        disabled={isLoading}
                        className='hidden'
                      />
                    )}
                  </div>
                  <div className='space-y-2'>
                    <h4 className='text-lg font-semibold text-indigo-900'>
                      {formData.firstName} {formData.lastName}
                    </h4>
                    <p className='text-indigo-500 text-sm font-medium'>@{formData.username}</p>
                    <p className='text-indigo-600 text-sm'>{formData.email}</p>
                    <p className='text-indigo-600 text-sm'>{formData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Form Section - Right Side */}
              <div className='lg:w-2/3'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-xl font-semibold text-indigo-900'>Personal Information</h3>
                  <button
                    type="button"
                    onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                    disabled={isLoading}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                      isEditing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isEditing ? (
                      <>
                        <X size={16} className='mr-2' />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 size={16} className='mr-2' />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>

                <div className='space-y-6'>
                  {/* Name Row */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-indigo-900 mb-2'>First Name</label>
                      <Controller
                        name="firstName"
                        control={control}
                        rules={{
                          required: 'First name is required',
                          minLength: { value: 2, message: 'First name must be at least 2 characters' },
                        }}
                        render={({ field }) => (
                          <div className='relative'>
                            <User size={18} className='absolute left-3 top-3 text-indigo-400' />
                            <input
                              {...field}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                !isEditing ? 'bg-indigo-50 cursor-not-allowed' : 'bg-white'
                              } ${errors.firstName ? 'border-red-500' : 'border-indigo-300'}`}
                            />
                          </div>
                        )}
                      />
                      {errors.firstName && <p className='text-red-500 text-sm mt-1'>{errors.firstName.message}</p>}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-indigo-900 mb-2'>Last Name</label>
                      <Controller
                        name="lastName"
                        control={control}
                        rules={{
                          required: 'Last name is required',
                          minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                        }}
                        render={({ field }) => (
                          <div className='relative'>
                            <User size={18} className='absolute left-3 top-3 text-indigo-400' />
                            <input
                              {...field}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                !isEditing ? 'bg-indigo-50 cursor-not-allowed' : 'bg-white'
                              } ${errors.lastName ? 'border-red-500' : 'border-indigo-300'}`}
                            />
                          </div>
                        )}
                      />
                      {errors.lastName && <p className='text-red-500 text-sm mt-1'>{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-indigo-900 mb-2'>Username</label>
                      <Controller
                        name="username"
                        control={control}
                        rules={{
                          required: 'Username is required',
                          minLength: { value: 3, message: 'Username must be at least 3 characters' },
                          maxLength: { value: 20, message: 'Username must not exceed 20 characters' },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Username can only contain letters, numbers, and underscores',
                          },
                        }}
                        render={({ field }) => (
                          <div className='relative'>
                            <User size={18} className='absolute left-3 top-3 text-indigo-400' />
                            <input
                              {...field}
                              placeholder="Enter username"
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                !isEditing ? 'bg-indigo-50 cursor-not-allowed' : 'bg-white'
                              } ${errors.username ? 'border-red-500' : 'border-indigo-300'}`}
                            />
                          </div>
                        )}
                      />
                      {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-indigo-900 mb-2'>Email Address</label>
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address',
                          },
                        }}
                        render={({ field }) => (
                          <div className='relative'>
                            <Mail size={18} className='absolute left-3 top-3 text-indigo-400' />
                            <input
                              {...field}
                              type="email"
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                !isEditing ? 'bg-indigo-50 cursor-not-allowed' : 'bg-white'
                              } ${errors.email ? 'border-red-500' : 'border-indigo-300'}`}
                            />
                          </div>
                        )}
                      />
                      {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-indigo-900 mb-2'>Phone Number</label>
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[\+]?[1-9][\d]{0,15}$/,
                            message: 'Please enter a valid phone number',
                          },
                        }}
                        render={({ field }) => (
                          <div className='relative'>
                            <Phone size={18} className='absolute left-3 top-3 text-indigo-400' />
                            <input
                              {...field}
                              type="tel"
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                !isEditing ? 'bg-indigo-50 cursor-not-allowed' : 'bg-white'
                              } ${errors.phone ? 'border-red-500' : 'border-indigo-300'}`}
                            />
                          </div>
                        )}
                      />
                      {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-indigo-900 mb-2'>Password</label>
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        }}
                        render={({ field }) => (
                          <div className='relative'>
                            <Lock size={18} className='absolute left-3 top-3 text-indigo-400' />
                            <input
                              {...field}
                              type="password"
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                !isEditing ? 'bg-indigo-50 cursor-not-allowed' : 'bg-white'
                              } ${errors.password ? 'border-red-500' : 'border-indigo-300'}`}
                            />
                          </div>
                        )}
                      />
                      {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className='flex justify-end'>
                      <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className={`flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={18} className='mr-2 animate-spin' />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} className='mr-2' />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;