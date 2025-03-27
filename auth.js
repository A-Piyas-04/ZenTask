class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.checkAuth();
    }

    checkAuth() {
        if (!this.currentUser && window.location.pathname !== '/auth.html') {
            window.location.href = 'auth.html';
        } else if (this.currentUser && window.location.pathname === '/auth.html') {
            window.location.href = 'index.html';
        }
    }

    toggleForms() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    }

    async register(event) {
        event.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

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

            if (!response.ok) {
                const data = await response.json();
                alert(data.message || 'Registration failed!');
                return false;
            }

            alert('Registration successful! Please login.');
            this.toggleForms();
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed! Please try again.');
        }
        return false;
    }

    async login(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

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

            if (!response.ok) {
                const data = await response.json();
                alert(data.message || 'Invalid email or password!');
                return false;
            }

            const user = await response.json();
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed! Please try again.');
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
    }

    hashPassword(password) {
        // In a real application, use a proper hashing algorithm
        // This is a simple hash for demonstration purposes only
        return btoa(password);
    }
}

const auth = new Auth();