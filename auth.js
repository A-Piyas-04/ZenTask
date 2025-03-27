class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.checkAuth();
    }

    checkAuth() {
        const authPages = ['/login.html', '/register.html'];
        const currentPath = window.location.pathname;
        
        if (!this.currentUser && !authPages.includes(currentPath)) {
            window.location.href = 'login.html';
        } else if (this.currentUser && authPages.includes(currentPath)) {
            window.location.href = 'index.html';
        }
    }

    async register(event) {
        event.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Validate form
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return false;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return false;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password: this.hashPassword(password)
                })
            });

            const data = await response.json();

            if (data) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed! Please try again.');
        }
        return false;
    }

    async login(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Validate form
        if (!email || !password) {
            alert('Please fill in all fields');
            return false;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password: this.hashPassword(password)
                })
            });

            const data = await response.json();

            if (data) {
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                this.currentUser = data.user;
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed! Please try again.');
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    hashPassword(password) {
        // In a real application, use a proper hashing algorithm
        // This is a simple hash for demonstration purposes only
        return btoa(password);
    }
}

const auth = new Auth();