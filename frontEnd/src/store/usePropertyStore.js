// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import { LoginUser, SignOutUser, SignUpUser } from '../../APIs/api'
// import axios from 'axios';

// const usePropertyStore = create(
//     persist(
//         (set) => ({
//             user: null,
//             properties: [],
//             isAuth: false,
//             checkAuth: async () => {
//                 try {
//                     const response = await axios.get('https://renteasy-m3ux.onrender.com/api', { withCredentials: true } );
//                     if (response.status === 200) {
//                         const { user } = response.data;
//                         set({ user, isAuth: true });
//                     } else {
//                         set({ user: null, isAuth: false })
//                     }
//                 } catch (error) {
//                     set({ user: null, isAuth: false })
//                 }
//             },
//             signUp: async (username, email, phone, password) => {
//                 try {
//                     const response = await SignUpUser(username, email, phone, password);
//                     set({ user: response.user, isAuth: true });
//                     return response;
//                 } catch (err) {
//                     throw err;
//                 }
//             },

//             login: async (email, password) => {
//                 try {
//                     const response = await LoginUser(email, password);
//                     set({ user: response.user, isAuth: true });
//                     return response;
//                 } catch (err) {
//                     throw err;
//                 }
//             },

//             signOut: async () => {
//                 try {
//                     await SignOutUser();
//                     set({ user: null, isAuth: false, properties: [] })
//                 } catch (err) {
//                     throw err;
//                 }
//             },

//             setProperties: (properties) => set({ properties }),

//             // update with user phone number later
//             addProperty: async (propertyData, files) => {
//                 try {
//                     const formData = new FormData();
//                     formData.append('title', propertyData.title);
//                     formData.append('description', propertyData.description);
//                     formData.append('price', propertyData.price)
//                     formData.append('location', JSON.stringify(propertyData.location));
//                     formData.append('type', propertyData.type);
//                     files.forEach((file) => formData.append('images', file));

//                     const response = await axios.post('https://renteasy-m3ux.onrender.com/api/properties', formData, {
//                         headers: { 'Content-Type': 'multipart/form-data' },
//                         withCredentials: true,
//                     } );
//                     return response.data;
//                 } catch (err) {
//                     throw new Error(err.response?.data?.message || 'Failed to create property');
//                 }
//             }
//         }),
//         {
//             name: 'room-rental-storage',
//         }
//     )
// );
// export default usePropertyStore;




import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginUser, SignOutUser, SignUpUser } from '../../APIs/api';
import axios from 'axios';
import { signInWithFirebaseToken, auth } from '../firebase'

// Zustand store for managing user and property state
const usePropertyStore = create(
  persist(
    (set) => ({
      user: null,
      properties: [],
      isAuth: false,
      // Check if user is authenticated
      checkAuth: async () => {
        try {
          const response = await axios.get('https://renteasy-m3ux.onrender.com/api/users', { withCredentials: true });
          if (response.status === 200) {
            const { user, firebaseToken } = response.data;
            await signInWithFirebaseToken(firebaseToken) // sign in to firebase with custom token
            set({ user, isAuth: true });
            return { success: true, user };
          } else {
            set({ user: null, isAuth: false });
            return { success: false, message: 'Authentication check failed' };
          }
        } catch (error) {
          console.error('Check auth error:', error);
          set({ user: null, isAuth: false });
          return { success: false, message: error.response?.data?.message || 'Failed to check authentication' };
        }
      },
      // Sign up a new user
      signUp: async (username, email, phone, password, firstName, lastName) => {
        try {
          const response = await SignUpUser(username, email, phone, password, firstName, lastName);
          await signInWithFirebaseToken(response.firebaseToken) // sign in to firebase with custom token
          set({ user: response.user, isAuth: true });
          return { success: true, message: 'Sign up successful', user: response.user };
        } catch (err) {
          console.error('Sign up error:', err);
          return { success: false, message: err.response?.data?.message || 'Failed to sign up' };
        }
      },
      // Log in a user
      login: async (email, password) => {
        try {
          const response = await LoginUser(email, password);
          await signInWithFirebaseToken(response.firebaseToken) // sign in to firebase with custom token
          set({ user: response.user, isAuth: true });
          return { success: true, message: 'Login successful', user: response.user };
        } catch (err) {
          console.error('Login error:', err);
          return { success: false, message: err.response?.data?.message || 'Failed to log in' };
        }
      },
      // Sign out a user
      signOut: async () => {
        try {
          await SignOutUser(); // sign out with the signout function from the backend
          await auth.signOut(); // sign out from firebase using the sign out function from auth in firebase config
          set({ user: null, isAuth: false, properties: [] });
          return { success: true, message: 'Sign out successful' };
        } catch (err) {
          console.error('Sign out error:', err);
          return { success: false, message: err.response?.data?.message || 'Failed to sign out' };
        }
      },
      // Update properties in state
      setProperties: (properties) => set({ properties }),
      // Add a new property
      addProperty: async (propertyData, files) => {
        try {
          const formData = new FormData();
          formData.append('title', propertyData.title);
          formData.append('description', propertyData.description);
          formData.append('price', propertyData.price);
          formData.append('location[gps][latitude]', propertyData.location.gps.latitude || '');
          formData.append('location[gps][longitude]', propertyData.location.gps.longitude || '');
          formData.append('location[ghanaPostAddress]', propertyData.location.ghanaPostAddress || '');
          formData.append('type', propertyData.type);
          formData.append('beds', propertyData.beds || 0);
          formData.append('baths', propertyData.baths || 0);
          files.forEach((file) => formData.append('images', file));

          // // Log FormData for debugging
          // const formDataLog = {
          //   title: propertyData.title,
          //   description: propertyData.description,
          //   price: propertyData.price,
          //   'location[gps][latitude]': propertyData.location.gps.latitude || '',
          //   'location[gps][longitude]': propertyData.location.gps.longitude || '',
          //   'location[ghanaPostAddress]': propertyData.location.ghanaPostAddress || '',
          //   type: propertyData.type,
          //   beds: propertyData.beds || 0,
          //   baths: propertyData.baths || 0,
          //   images: files.length,
          // };
          // console.log('FormData sent:', formDataLog);

          const response = await axios.post('https://renteasy-m3ux.onrender.com/api/properties', formData, {
            withCredentials: true,
          });
          return response.data;
        } catch (err) {
          console.error('Add property error:', err.response?.data || err.message);
          return { success: false, message: err.response?.data?.message || 'Failed to create property' };
        }
      },
    }),
    {
      name: 'room-rental-storage',
    }
  )
);

export default usePropertyStore;