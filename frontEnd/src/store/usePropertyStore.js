import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LoginUser, SignOutUser, SignUpUser } from '../../APIs/api'
import axios from 'axios';

const usePropertyStore = create(
    persist(
        (set) => ({
            user: null,
            properties: [],
            isAuth: false,
            checkAuth: async () => {
                try {
                    const response = await axios.get('http://localhost:4001/api', { withCredentials: true } );
                    if (response.status === 200) {
                        const { user } = response.data;
                        set({ user, isAuth: true });
                    } else {
                        set({ user: null, isAuth: false })
                    }
                } catch (error) {
                    set({ user: null, isAuth: false })
                }
            },
            signUp: async (username, email, password) => {
                try {
                    const response = await SignUpUser(username, email, password);
                    set({ user: response.user, isAuth: true });
                    return response;
                } catch (err) {
                    throw err;
                }
            },

            login: async (email, password) => {
                try {
                    const response = await LoginUser(email, password);
                    set({ user: response.user, isAuth: true });
                    return response;
                } catch (err) {
                    throw err;
                }
            },

            signOut: async () => {
                try {
                    await SignOutUser();
                    set({ user: null, isAuth: false, properties: [] })
                } catch (err) {
                    throw err;
                }
            },

            setProperties: (properties) => set({ properties }),

            // update with user phone number later
            addProperty: async (propertyData, files) => {
                try {
                    const formData = new FormData();
                    formData.append('title', propertyData.title);
                    formData.append('description', propertyData.description);
                    formData.append('price', propertyData.price)
                    formData.append('location', JSON.stringify(propertyData.location));
                    formData.append('type', propertyData.type);
                    files.forEach((file) => formData.append('images', file));

                    const response = await axios.post('http://localhost:4001/api/properties', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        withCredentials: true,
                    } );
                    return response.data;
                } catch (err) {
                    throw new Error(err.response?.data?.message || 'Failed to create property');
                }
            }
        }),
        {
            name: 'room-rental-storage',
        }
    )
);

export default usePropertyStore;

