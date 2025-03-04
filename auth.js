class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
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

    register(event) {
        event.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return false;
        }

        if (this.users.some(user => user.email === email)) {
            alert('Email already registered!');
            return false;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password: this.hashPassword(password)
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        alert('Registration successful! Please login.');
        this.toggleForms();
        return false;
    }

    login(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = this.users.find(u => 
            u.email === email && 
            u.password === this.hashPassword(password)
        );

        if (user) {
            const { password, ...userWithoutPassword } = user;
            this.currentUser = userWithoutPassword;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password!');
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