const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// الحصول على جميع المشاريع
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المشاريع' });
  }
});

// إنشاء مشروع جديد
router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newProject = new Project({ name, description, user: req.user._id });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء المشروع' });
  }
});

// حذف مشروع
router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف المشروع' });
  }
});

module.exports = router; 