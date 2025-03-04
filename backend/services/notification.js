const WebSocket = require('ws');

class NotificationService {
    constructor() {
        this.connections = new Map();
    }

    notifyUser(userId, notification) {
        if (this.connections.has(userId)) {
            const ws = this.connections.get(userId);
            ws.send(JSON.stringify(notification));
        }
    }
}

module.exports = new NotificationService(); 