// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:4001/api",
//     headers: {"Content-Type": "application/json"},
//     withCredentials: true, // ensures cookie are sent with requests to the backend
// })

// export const SignUpUser = async (username, email, phone, password) => {
//     try {        
//         const response = await api.post('/signup', {username, email, phone, password})
//         return response.data;
//     } catch (err) {
//         console.error("Sign up error: ", err);
//         console.error("Error response: ", err.response);
//         throw new Error(err.response?.data?.message || "Sign Up failed")
//     }
// }

// export const LoginUser = async (email, password) => {
//     try {
//         const response = await api.post("/signin", {email, password})
//         return response.data
//     } catch (err) {
//         console.error("Login error: ", err);
//         console.error("Error response: ", err.response);
//         throw new Error(err.response?.data?.message || "Login failed") 
//     }
// }

// export const SignOutUser = async () => {
//     try {
//         const response = await api.post('/signout')
//         return response.data
//     } catch (err) {
//         console.error("Sign Out error: ", err)
//         console.error("Error response: ", err.response)
//         throw new Error(err.response?.data?.message || "Log Out failed")
//     }
// }

import axios from 'axios';

export const LoginUser = async (email, password) => {
  try {
    const response = await axios.post(
      'http://localhost:4001/api/users/signin',
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('API Login error:', err);
    throw err;
  }
};

export const SignUpUser = async (username, email, phone, password) => {
  try {
    const response = await axios.post(
      'http://localhost:4001/api/users/signup',
      { username, email, phone, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('API SignUp error:', err);
    throw err;
  }
};

export const SignOutUser = async () => {
  try {
    const response = await axios.post(
      'http://localhost:4001/api/users/signout',
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error('API SignOut error:', err);
    throw err;
  }
};