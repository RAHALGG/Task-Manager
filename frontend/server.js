const cors = require('cors');

// ... existing code ...

app.use(cors({
    origin: 'http://localhost:3000', // عنوان تطبيق الواجهة الأمامية
    credentials: true
}));

// ... existing code ... 
fetch('http://api.example.com/data', {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
});