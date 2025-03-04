const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// الحصول على جميع المهام
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المهام' });
  }
});

// إنشاء مهمة جديدة
router.post('/', auth, async (req, res) => {
  const { title, description, projectId } = req.body;
  try {
    const newTask = new Task({ title, description, project: projectId, user: req.user._id });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء المهمة' });
  }
});

// تحديث مهمة
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        )
        .populate('assignees', 'name email avatar')
        .populate('createdBy', 'name email avatar');
        
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'خطأ في تحديث المهمة' });
    }
});

// إضافة تعليق
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.comments.push({
            user: req.user._id,
            content: req.body.content
        });
        await task.save();
        await task.populate('comments.user', 'name email avatar');
        
        res.json(task.comments);
    } catch (error) {
        res.status(400).json({ message: 'خطأ في إضافة التعليق' });
    }
});

// تحديث موقع المهمة (السحب والإفلات)
router.patch('/:id/position', auth, async (req, res) => {
    try {
        const { status, position } = req.body;
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'المهمة غير موجودة' });
        }

        // تحديث الموقع والحالة
        task.status = status;
        task.position = position;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// حذف مهمة
router.delete('/:id', auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف المهمة' });
  }
});

module.exports = router; 