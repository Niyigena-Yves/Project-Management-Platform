import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { 'x-auth-token': token }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', {
        name: newProjectName,
        description: newProjectDescription
      }, {
        headers: { 'x-auth-token': token }
      });
      setNewProjectName('');
      setNewProjectDescription('');
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/projects/${editingProject._id}`, {
        name: editingProject.name,
        description: editingProject.description
      }, {
        headers: { 'x-auth-token': token }
      });
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    console.log('Deleting project with ID:', projectId); 
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { 'x-auth-token': token }
      });
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
      <form onSubmit={handleCreateProject} className="mb-4">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name"
          className="px-3 py-2 border rounded mr-2"
          required
        />
        <input
          type="text"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="Project description"
          className="px-3 py-2 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Project</button>
      </form>
      {projects.length > 0 ? (
        <ul>
          {projects.map(project => (
            <li key={project._id} className="mb-4 p-4 border rounded shadow">
              {editingProject && editingProject._id === project._id ? (
                <form onSubmit={handleUpdateProject} className="mb-2">
                  <input
                    type="text"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                    className="px-3 py-2 border rounded mr-2"
                    required
                  />
                  <input
                    type="text"
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                    className="px-3 py-2 border rounded mr-2"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                  <button onClick={() => setEditingProject(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </form>
              ) : (
                <>
                  <h3 className="font-semibold text-xl">{project.name}</h3>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                  <p className="mt-2">Members: {project.members.length}</p>
                  <div className="mt-3">
                    <button onClick={() => setEditingProject(project)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDeleteProject(project._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any projects yet.</p>
      )}
    </div>
  );
};

export default ProjectList;