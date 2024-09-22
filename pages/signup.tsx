// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';

// const Signup: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/auth', { action: 'signup', email, password });
//       localStorage.setItem('token', response.data.token);
//       router.push('/');
//     } catch (error: any) {
//       setError(error.response?.data?.message || 'An error occurred');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Sign Up</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         required
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//         required
//       />
//       <button type="submit">Sign Up</button>
//     </form>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth", {
        action: "signup",
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray1">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-destructive1 mb-4">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 border border-gray3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary1"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 border border-gray3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-primary1"
        />
        <button
          type="submit"
          className="w-full bg-primary1 text-white p-3 rounded hover:bg-primary2 transition duration-300"
        >
          Sign Up
        </button>
        <p className="mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary1 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
