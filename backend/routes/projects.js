const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Organization = require('../models/Organization');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, organizationId } = req.body;
    const newProject = new Project({
      name,
      description,
      owner: req.user.id,
      organization: organizationId,
      members: [{ user: req.user.id, role: 'admin' }],
      activities: [{ user: req.user.id, action: 'created', userRole: 'admin' }]
    });
    const project = await newProject.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { projects: project._id } });
    if (organizationId) {
      await Organization.findByIdAndUpdate(organizationId, { $push: { projects: project._id } });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user.id });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update project
router.put('/:projectId', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    if (!project.members.some(member => member.user.toString() === req.user.id && ['admin', 'editor'].includes(member.role))) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    project.name = name || project.name;
    project.description = description || project.description;
    project.activities.push({
      user: req.user.id,
      action: 'updated',
      userRole: project.members.find(member => member.user.toString() === req.user.id).role
    });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete project
router.delete('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await project.remove();
    await User.updateMany(
      { projects: req.params.projectId },
      { $pull: { projects: req.params.projectId } }
    );
    if (project.organization) {
      await Organization.findByIdAndUpdate(
        project.organization,
        { $pull: { projects: req.params.projectId } }
      );
    }
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add member to project
router.post('/:projectId/members', auth, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    project.members.push({ user: userId, role });
    project.activities.push({
      user: req.user.id,
      action: 'added member',
      userRole: 'admin'
    });
    await project.save();
    await User.findByIdAndUpdate(userId, { $push: { projects: project._id } });
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Change member role in project
router.put('/:projectId/members/:userId', auth, async (req, res) => {
  try {
    const { role } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const memberIndex = project.members.findIndex(member => member.user.toString() === req.params.userId);
    if (memberIndex === -1) {
      return res.status(404).json({ msg: 'User not found in project' });
    }
    project.members[memberIndex].role = role;
    project.activities.push({
      user: req.user.id,
      action: 'changed member role',
      userRole: 'admin'
    });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;