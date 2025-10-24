import { body, validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';

/**
 * Validation rules for login form
 */
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password is required')
];

/**
 * Display the login form
 */
const showLoginForm = (req, res) => {
    // TODO: Add login-specific styles using res.addStyle()
    // TODO: Render the login form view (forms/login/form)
    // TODO: Pass appropriate title
};

/**
 * Process login form submission
 */
const processLogin = async (req, res) => {
    // TODO: Check for validation errors using validationResult(req)
    // TODO: If errors exist, redirect back to login form

    // TODO: Extract email and password from req.body

    // TODO: Find user by email using findUserByEmail()
    // TODO: If user not found, log "User not found" and redirect back

    // TODO: Verify password using verifyPassword()
    // TODO: If password incorrect, log "Invalid password" and redirect back

    // SECURITY: Remove the password from the user object first!
    user.password = null;
    delete user.password;
    // TODO: Store user information in session: req.session.user = user object (without password)

    // TODO: Redirect to protected dashboard (/dashboard)
};

/**
 * Handle user logout
 * 
 * NOTE: connect.sid is the default session name since we did not name the session
 * when created it in our server.js file.
 */
const processLogout = (req, res) => {
    // First, check if there is a session object on the request
    if (!req.session) {
        // If no session exists, there's nothing to destroy,
        // so we just redirect the user back to the home page
        return res.redirect('/');
    }

    // Call destroy() to remove this session from the store (Postgres in our case)
    req.session.destroy((err) => {
        if (err) {
            // If something goes wrong while removing the session from the DB:
            console.error('Error destroying session:', err);

            /**
            * Clear the session cookie from the browser anyway, so the client
            * doesn't keep sending an invalid session ID.
            */
            res.clearCookie('connect.sid');

            /** 
            * Normally we would respond with a 500 error since logout didn't fully succeed with code
            * similar to: return res.status(500).send('Error logging out');
            * 
            * Since this is a practice site we will redirect to the home page anyways.
            */
            return res.redirect('/');
        }

        // If session destruction succeeded, clear the session cookie from the browser
        res.clearCookie('connect.sid');

        // Redirect the user to the home page
        res.redirect('/');
    });
};

/**
 * Display protected dashboard (requires login)
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    // TODO: Security check! Ensure user and sessionData does not contain the password field

    // TODO: Add login-specific styles
    // TODO: Render the dashboard view (forms/login/dashboard)
    // TODO: Pass title, user, and sessionData to template
};

export { 
    showLoginForm, 
    processLogin, 
    processLogout, 
    showDashboard, 
    loginValidation 
};