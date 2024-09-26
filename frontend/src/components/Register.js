import React, { useState, useContext, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';  
import { AuthContext } from '../context/AuthContext'; 
 
const Register = () => { 
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const { register, user, loading } = useContext(AuthContext); 
  const navigate = useNavigate();  
 
  useEffect(() => {
    console.log('Register component mounted');
    return () => console.log('Register component unmounted');
  }, []);

  useEffect(() => {
    console.log('User state changed:', user);
    if (user && !loading) {
      console.log('User is logged in, navigating to dashboard');
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try {
      console.log('Attempting registration...');
      const success = await register(username, email, password); 
      console.log('Register success:', success); 
      if (success) { 
        console.log('Registration successful. User state should update soon.');
        setTimeout(() => {
          if (user) {
            navigate('/dashboard');
          } else {
            console.log('User state not updated, manual navigation');
            navigate('/dashboard');
          }
        }, 1000);
      } else { 
        console.log('Registration failed.');
        alert('Registration failed. Please try again.'); 
      } 
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration. Please try again.');
    }
  }; 

  return (
    <div className="container-2 mx-auto mt-8 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
