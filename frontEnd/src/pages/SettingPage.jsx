import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Camera, Edit3, Save, X, User, Mail, Phone, Upload, Check, AlertCircle, Loader2 } from 'lucide-react'

const SettingPage = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [profileImage, setProfileImage] = useState('/api/placeholder/200/200')
    const [showImageOptions, setShowImageOptions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(null) // 'success' | 'error' | null
    const [errorMessage, setErrorMessage] = useState('')
    
    // Track verification status for each field
    const [verificationStatus, setVerificationStatus] = useState({
        firstName: true,
        lastName: true,
        email: true,
        phone: true
    })
    
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567'
        },
        mode: 'onChange'
    })

    const formData = watch()

    const onSubmit = async (data) => {
        setIsLoading(true)
        setUpdateStatus(null)
        setErrorMessage('')

        try {
            // ============================================
            // BACKEND INTEGRATION - Replace this section
            // ============================================
            
            // Example API call to update profile
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add your auth token
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            const result = await response.json()
            
            // ============================================
            // END BACKEND INTEGRATION
            // ============================================

            // Simulate API response for demo
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Update verification status based on backend response
            setVerificationStatus({
                firstName: true,
                lastName: true,
                email: true,
                phone: true
            })

            setUpdateStatus('success')
            setIsEditing(false)
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                setUpdateStatus(null)
            }, 3000)

        } catch (error) {
            console.error('Error updating profile:', error)
            setUpdateStatus('error')
            setErrorMessage(error.message || 'Something went wrong while updating your profile. Please try again.')
            
            // Reset verification status on error
            setVerificationStatus({
                firstName: false,
                lastName: false,
                email: false,
                phone: false
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        reset()
        setIsEditing(false)
        setUpdateStatus(null)
        setErrorMessage('')
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                setProfileImage(e.target.result)
                
                // ============================================
                // BACKEND INTEGRATION - Image Upload
                // ============================================
                
                try {
                    const formData = new FormData()
                    formData.append('profileImage', file)
                    
                    const response = await fetch('/api/admin/profile/image', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        },
                        body: formData
                    })

                    if (!response.ok) {
                        throw new Error('Failed to upload image')
                    }

                    const result = await response.json()
                    console.log('Image uploaded successfully:', result)
                    
                } catch (error) {
                    console.error('Error uploading image:', error)
                    setErrorMessage('Failed to upload image. Please try again.')
                }
                
                // ============================================
                // END BACKEND INTEGRATION
                // ============================================
            }
            reader.readAsDataURL(file)
        }
        setShowImageOptions(false)
    }

    const removeImage = async () => {
        setProfileImage('/api/placeholder/200/200')
        setShowImageOptions(false)
        
        // ============================================
        // BACKEND INTEGRATION - Remove Image
        // ============================================
        
        try {
            const response = await fetch('/api/admin/profile/image', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to remove image')
            }

            console.log('Image removed successfully')
            
        } catch (error) {
            console.error('Error removing image:', error)
            setErrorMessage('Failed to remove image. Please try again.')
        }
        
        // ============================================
        // END BACKEND INTEGRATION
        // ============================================
    }

    const getFieldStatus = (fieldName) => {
        if (updateStatus === 'success' && verificationStatus[fieldName]) {
            return 'success'
        } else if (updateStatus === 'error' || !verificationStatus[fieldName]) {
            return 'error'
        }
        return 'default'
    }

    const renderFieldIcon = (fieldName) => {
        const status = getFieldStatus(fieldName)
        
        if (status === 'success') {
            return (
                <span className='inline-flex items-center ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'>
                    <Check size={12} className='mr-1' />
                    Verified
                </span>
            )
        } else if (status === 'error') {
            return (
                <span className='inline-flex items-center ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full'>
                    <AlertCircle size={12} className='mr-1' />
                    Error
                </span>
            )
        }
        
        return (
            <span className='inline-flex items-center ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'>
                <Check size={12} className='mr-1' />
                Verified
            </span>
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
                                        <div className='w-48 h-48 rounded-full overflow-hidden bg-white shadow-lg ring-4 ring-indigo-100 mx-auto'>
                                            <img 
                                                src={profileImage} 
                                                alt="Profile" 
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setShowImageOptions(!showImageOptions)}
                                            className='absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors'
                                        >
                                            <Camera size={20} />
                                        </button>
                                        
                                        {showImageOptions && (
                                            <div className='absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-indigo-200 py-2 z-10 min-w-[160px]'>
                                                <label className='flex items-center px-4 py-3 hover:bg-indigo-50 cursor-pointer text-sm transition-colors'>
                                                    <Upload size={16} className='mr-3 text-indigo-500' />
                                                    Upload Photo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className='hidden'
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className='flex items-center px-4 py-3 hover:bg-red-50 w-full text-left text-sm transition-colors'
                                                >
                                                    <X size={16} className='mr-3 text-red-500' />
                                                    Remove Photo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className='space-y-2'>
                                        <h4 className='text-lg font-semibold text-indigo-900'>
                                            {formData.firstName} {formData.lastName}
                                        </h4>
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
                                        onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                                        disabled={isLoading}
                                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            isEditing 
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
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

                                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                                    {/* Name Row */}
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div>
                                            <label className='block text-sm font-medium text-indigo-900 mb-2'>
                                                First Name
                                                {renderFieldIcon('firstName')}
                                            </label>
                                            <Controller
                                                name="firstName"
                                                control={control}
                                                rules={{ 
                                                    required: 'First name is required',
                                                    minLength: {
                                                        value: 2,
                                                        message: 'First name must be at least 2 characters'
                                                    }
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
                                            {errors.firstName && (
                                                <p className='text-red-500 text-sm mt-1'>{errors.firstName.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-indigo-900 mb-2'>
                                                Last Name
                                                {renderFieldIcon('lastName')}
                                            </label>
                                            <Controller
                                                name="lastName"
                                                control={control}
                                                rules={{ 
                                                    required: 'Last name is required',
                                                    minLength: {
                                                        value: 2,
                                                        message: 'Last name must be at least 2 characters'
                                                    }
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
                                            {errors.lastName && (
                                                <p className='text-red-500 text-sm mt-1'>{errors.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className='block text-sm font-medium text-indigo-900 mb-2'>
                                            Email Address
                                            {renderFieldIcon('email')}
                                        </label>
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{ 
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Please enter a valid email address'
                                                }
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
                                        {errors.email && (
                                            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className='block text-sm font-medium text-indigo-900 mb-2'>
                                            Phone Number
                                            {renderFieldIcon('phone')}
                                        </label>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            rules={{ 
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^[\+]?[1-9][\d]{0,15}$/,
                                                    message: 'Please enter a valid phone number'
                                                }
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
                                        {errors.phone && (
                                            <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>
                                        )}
                                    </div>

                                    {/* Save Button */}
                                    {isEditing && (
                                        <div className='flex justify-end pt-4'>
                                            <button
                                                type="submit"
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
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingPage