const Notification = require('../models/Notification');

class NotificationService {
  static async create(data) {
    try {
      const notification = new Notification(data);
      await notification.save();

      // إرسال إشعار مباشر عبر Socket.IO
      if (data.io) {
        data.io.to(data.user.toString()).emit('notification', notification);
      }

      return notification;
    } catch (error) {
      console.error('خطأ في إنشاء الإشعار:', error);
      throw error;
    }
  }

  static async createTaskNotification(task, action, io) {
    const notifications = [];

    for (const assignee of task.assignees) {
      if (assignee.toString() !== task.createdBy.toString()) {
        const notification = await this.create({
          user: assignee,
          title: 'تحديث في المهمة',
          message: `تم ${action} المهمة "${task.title}"`,
          type: 'TASK',
          reference: task._id,
          referenceModel: 'Task',
          io
        });
        notifications.push(notification);
      }
    }

    return notifications;
  }
}

module.exports = NotificationService; 