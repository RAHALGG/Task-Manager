const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// إنشاء فريق جديد
router.post('/', auth, async (req, res) => {
  try {
    const team = new Team({
      ...req.body,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'OWNER' }]
    });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: 'خطأ في إنشاء الفريق' });
  }
});

// الحصول على فرق المستخدم
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find({
      'members.user': req.user._id
    })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// إضافة عضو للفريق
router.post('/:teamId/members', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ message: 'الفريق غير موجود' });
    }

    // التحقق من الصلاحيات
    const member = team.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    team.members.push({
      user: req.body.userId,
      role: req.body.role || 'MEMBER'
    });

    await team.save();
    res.json(team);
  } catch (error) {
    res.status(400).json({ message: 'خطأ في إضافة العضو' });
  }
});

module.exports = router; 