import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [organizations, setOrganizations] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    console.log('Dashboard component mounted');
    console.log('Current user:', user);

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      const config = {
        headers: { 'x-auth-token': token }
      };

      try {
        console.log('Fetching organizations...');
        const orgRes = await axios.get('http://localhost:5000/api/organizations', config);
        console.log('Organizations fetched:', orgRes.data);
        setOrganizations(orgRes.data);

        console.log('Fetching projects...');
        const projRes = await axios.get('http://localhost:5000/api/projects', config);
        console.log('Projects fetched:', projRes.data);
        setProjects(projRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();

    return () => console.log('Dashboard component unmounted');
  }, [user]);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username || 'User'}!</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Organizations</h3>
          {organizations.length > 0 ? (
            <ul>
              {organizations.map(org => (
                <li key={org._id} className="mb-2">{org.name}</li>
              ))}
            </ul>
          ) : (
            <p>You don't have any organizations yet.</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Projects</h3>
          {projects.length > 0 ? (
            <ul>
              {projects.map(project => (
                <li key={project._id} className="mb-2">{project.name}</li>
              ))}
            </ul>
          ) : (
            <p>You don't have any projects yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;