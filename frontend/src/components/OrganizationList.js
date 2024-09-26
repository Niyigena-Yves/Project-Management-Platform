import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/organizations', {
        headers: { 'x-auth-token': token }
      });
      setOrganizations(res.data);
    } catch (err) {
      console.error('Error fetching organizations:', err);
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/organizations', { name: newOrgName }, {
        headers: { 'x-auth-token': token }
      });
      setNewOrgName('');
      fetchOrganizations();
    } catch (err) {
      console.error('Error creating organization:', err);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Organizations</h2>
      <form onSubmit={handleCreateOrg} className="mb-4">
        <input
          type="text"
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
          placeholder="New organization name"
          className="px-3 py-2 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Organization</button>
      </form>
      {organizations.length > 0 ? (
        <ul>
          {organizations.map(org => (
            <li key={org._id} className="mb-2 p-2 border rounded">
              <h3 className="font-semibold">{org.name}</h3>
              <p>Members: {org.members.length}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any organizations yet.</p>
      )}
    </div>
  );
};

export default OrganizationList;