require('dotenv').config();

// ... existing code

jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  // ... existing code
});

// ... existing code