const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

// مسار تسجيل الدخول
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // التحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // إنشاء توكن
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // إرجاع بيانات المستخدم والتوكن
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'حدث خطأ في تسجيل الدخول' });
    }
});

// مسار إنشاء المشرف
router.get('/setup-admin', async (req, res) => {
    try {
        await User.deleteMany({ role: 'admin' });
        
        const admin = new User({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        await admin.save();
        
        res.status(201).json({
            message: 'تم إنشاء المشرف بنجاح',
            credentials: {
                email: 'admin@example.com',
                password: 'admin123'
            }
        });
    } catch (error) {
        console.error('Setup admin error:', error);
        res.status(500).json({ error: error.message });
    }
});

// في بداية الملف، أضف تعريف الأدوار
const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member'
};

// تحديث مسار إنشاء المستخدم
router.post('/', authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        
        // التحقق من الصلاحيات
        if (!currentUser || (currentUser.role !== ROLES.OWNER && currentUser.role !== ROLES.ADMIN)) {
            return res.status(403).json({ message: 'غير مصرح لك بإنشاء مستخدمين' });
        }

        // فقط OWNER يمكنه إنشاء ADMIN
        if (req.body.role === ROLES.ADMIN && currentUser.role !== ROLES.OWNER) {
            return res.status(403).json({ message: 'فقط المالك يمكنه إنشاء مشرفين' });
        }

        // لا يمكن إنشاء OWNER جديد
        if (req.body.role === ROLES.OWNER) {
            return res.status(403).json({ message: 'لا يمكن إنشاء حساب مالك جديد' });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || ROLES.MEMBER
        });

        await user.save();
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'خطأ في إنشاء المستخدم' });
    }
});

// الحصول على جميع المستخدمين
router.get('/', authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'غير مصرح لك بعرض المستخدمين' });
        }

        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'خطأ في جلب المستخدمين' });
    }
});

// إضافة مسار GET للتحقق من المستخدمين
router.get('/check-users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        console.log('Found users:', users); // للتحقق في وحدة التحكم
        res.json(users);
    } catch (error) {
        console.error('Error checking users:', error);
        res.status(500).json({ error: error.message });
    }
});

// مسار جلب المستخدم الحالي
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// حذف مستخدم
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'غير مصرح لك بحذف المستخدمين' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        res.json({ message: 'تم حذف المستخدم بنجاح' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'خطأ في حذف المستخدم' });
    }
});

module.exports = router; 