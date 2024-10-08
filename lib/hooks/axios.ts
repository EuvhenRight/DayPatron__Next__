// import axios from "axios";
// import { getSession } from "next-auth/react";

// // Create a new Axios instance
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/", // Replace with your backend server's base URL
// });

// // Create the interceptor
// axiosInstance.interceptors.request.use(async (request) => {
//   // Get the session
//   const session = await getSession();

//   // Add your desired session value to the request headers
//   if (session) {
//     request.headers = {
//       ...request.headers,
//       Authorization: `Bearer ${session.jwt}`,
//     };
//   }

//   return request;
// });

// export const BackendInstance = axiosInstance;
// TODO: implement the interceptor
