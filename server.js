const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.txt');

// Ensure users.txt exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '');
}

// Helper function to read users from file
function readUsers() {
    try {
        const content = fs.readFileSync(USERS_FILE, 'utf8');
        return content ? content.split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line)) : [];
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

// Helper function to write user to file
function writeUser(user) {
    try {
        fs.appendFileSync(USERS_FILE, JSON.stringify(user) + '\n');
        return true;
    } catch (error) {
        console.error('Error writing to users file:', error);
        return false;
    }
}

// Register endpoint
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    if (writeUser(newUser)) {
        const { password, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } else {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});