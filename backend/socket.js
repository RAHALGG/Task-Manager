const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('غير مصرح'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('غير مصرح'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('غير مصرح'));
    }
  });

  io.on('connection', (socket) => {
    console.log('مستخدم جديد متصل:', socket.user.name);

    // الانضمام إلى غرفة خاصة بالمستخدم
    socket.join(socket.user._id.toString());

    // الانضمام إلى غرف الفرق
    socket.user.teams.forEach(team => {
      socket.join(`team:${team.teamId}`);
    });

    socket.on('disconnect', () => {
      console.log('مستخدم غادر:', socket.user.name);
    });
  });

  return io;
};

module.exports = initializeSocket; 