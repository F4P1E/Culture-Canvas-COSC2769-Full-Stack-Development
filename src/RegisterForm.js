import React, { useState } from 'react';
import './RegisterForm.css';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        //Handle form submission logic
    };

    return (
        <div className="register-container">
            <div className="logo-section">
                <img src="D:\Culture Canvas Register Form\culture-canvas-register-form\src\Culture Canvas.png" alt="Culture Canvas Logo" />
                <h1>CULTURE CANVAS</h1>
                <p>Travel Blog</p>
            </div>
            <div className="form-section">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                    <label>Password</label>
                    <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <button type='submit'>Create Account</button>
                </form>
                <button className='google-signin'>Continue with Google</button>
                <p>
                    Already Have An Account? <a href='/login'>Log In</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;