const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful:', data);
        } else {
            console.log('Login failed with status:', response.status);
            console.log('Message:', data);
        }
    } catch (error) {
        console.log('Login failed:', error.message);
    }
};

console.log('Testing valid user (madu)...');
login('madu@gmail.com', '123');

console.log('Testing new user (test)...');
login('test@example.com', '123456');
