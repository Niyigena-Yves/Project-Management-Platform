const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create organization
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const newOrg = new Organization({
      name,
      admin: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }]
    });
    const org = await newOrg.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { organizations: org._id } });
    res.json(org);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's organizations
router.get('/', auth, async (req, res) => {
  try {
    const orgs = await Organization.find({ 'members.user': req.user.id });
    res.json(orgs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add user to organization
router.post('/:orgId/members', auth, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const org = await Organization.findById(req.params.orgId);
    if (!org) {
      return res.status(404).json({ msg: 'Organization not found' });
    }
    if (org.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    org.members.push({ user: userId, role });
    await org.save();
    await User.findByIdAndUpdate(userId, { $push: { organizations: org._id } });
    res.json(org);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Change user role in organization
router.put('/:orgId/members/:userId', auth, async (req, res) => {
  try {
    const { role } = req.body;
    const org = await Organization.findById(req.params.orgId);
    if (!org) {
      return res.status(404).json({ msg: 'Organization not found' });
    }
    if (org.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const memberIndex = org.members.findIndex(member => member.user.toString() === req.params.userId);
    if (memberIndex === -1) {
      return res.status(404).json({ msg: 'User not found in organization' });
    }
    org.members[memberIndex].role = role;
    await org.save();
    res.json(org);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;