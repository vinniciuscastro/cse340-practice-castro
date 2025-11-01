import { body, validationResult } from 'express-validator';
import {
    emailExists,
    saveUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../../models/forms/registration.js';

/**
 * Comprehensive validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 7 })
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('confirmEmail')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid confirmation email')
        .normalizeEmail()
        .custom((value, { req }) => {
            if (value !== req.body.email) {
                throw new Error('Email addresses do not match');
            }
            return true;
        }),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one number and one symbol (!@#$%^&*)'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

/**
 * Validation rules for updating account information
 * Only validates name and email (no password required for account updates)
 */
const updateAccountValidation = [
    body('name')
        .trim()
        .isLength({ min: 7 })
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

/**
 * Display the registration form
 */
const showRegistrationForm = (req, res) => {
    // Add registration-specific styles using res.addStyle()
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');

    // Render the registration form view (forms/registration/form)
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

/**
 * Process user registration submission
 */
const processRegistration = async (req, res) => {
    // Check for validation errors using validationResult(req)
    const errors = validationResult(req);

    // If errors exist, redirect back to registration form
    if (!errors.isEmpty()) {
        req.flash('error', 'Please check your input and try again.');
        return res.redirect('/register');
    }

    // Extract name, email, password from req.body
    const { name, email, password } = req.body;

    // Check if email already exists using emailExists()
    const exists = await emailExists(email);

    // If email exists, log message and redirect back
    if (exists) {
        req.flash('warning', 'An account with this email already exists');
        return res.redirect('/register');
    }

    // Save the user using saveUser()
    const savedUser = await saveUser(name, email, password);

    // If save fails, log error and redirect back
    if (!savedUser) {
        req.flash('error', 'Failed to create account. Please try again.');
        return res.redirect('/register');
    }

    // If successful, log success and redirect to users list
    req.flash('success', 'Registration complete! You can now log in.');
    res.redirect('/register/users');
};

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {
    // Get all users using getAllUsers()
    const users = await getAllUsers();

    // Add registration-specific styles
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');

    // Render the users list view (forms/registration/list) with the user data
    res.render('forms/registration/list', {
        title: 'Registered Users',
        users: users,
        session: req.session
    });
};

/**
 * Display the edit account form
 * Users can edit their own account, admins can edit any account
 */
const showEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // Retrieve the target user from the database using getUserById
    const targetUser = await getUserById(targetUserId);

    // Check if the target user exists
    if (!targetUser) {
        // If not, set flash message and redirect to /register/users
        req.flash('error', 'User not found.');
        return res.redirect('/register/users');
    }

    // Determine if current user can edit this account
    // Users can edit their own (currentUser.id === targetUserId)
    // Admins can edit anyone (currentUser.role_name === 'admin')
    const canEdit = currentUser.id === targetUserId || currentUser.role_name === 'admin';

    // If current user cannot edit, set flash message and redirect
    if (!canEdit) {
        req.flash('error', 'You do not have permission to edit this account.');
        return res.redirect('/');
    }

    // Render the edit form, passing the target user data
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    res.render('forms/registration/edit', {
        title: 'Edit Account',
        user: targetUser
    });
};

/**
 * Process account edit form submission
 */
const processEditAccount = async (req, res) => {
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
        req.session.flash = {
            type: 'error',
            message: 'Please correct the errors in the form.'
        };
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { name, email } = req.body;

    // Retrieve the target user to verify they exist
    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
        req.session.flash = {
            type: 'error',
            message: 'User not found.'
        };
        return res.redirect('/users');
    }

    // Check edit permissions (same as showEditAccountForm)
    const canEdit = currentUser.id === targetUserId || currentUser.role_name === 'admin';
    if (!canEdit) {
        req.session.flash = {
            type: 'error',
            message: 'You do not have permission to edit this account.'
        };
        return res.redirect('/');
    }

    // Check if the new email already exists for a DIFFERENT user
    // It's okay if it matches the target user's current email
    if (email !== targetUser.email) {
        const emailTaken = await emailExists(email);
        if (emailTaken) {
            req.session.flash = {
                type: 'error',
                message: 'This email address is already in use.'
            };
            return res.redirect(`/users/${req.params.id}/edit`);
        }
    }

    // Update the user in the database using updateUser
    const updatedUser = await updateUser(targetUserId, name, email);
    if (!updatedUser) {
        req.session.flash = {
            type: 'error',
            message: 'Failed to update account. Please try again.'
        };
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    // If the current user edited their own account, update their session
    if (currentUser.id === targetUserId) {
        req.session.user.name = name;
        req.session.user.email = email;
    }

    // Success! Set flash message and redirect
    req.session.flash = {
        type: 'success',
        message: 'Account updated successfully.'
    };
    res.redirect('/users');
};

/**
 * Delete a user account (admin only)
 */
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // Verify current user is an admin
    // Only admins should be able to delete accounts
    if (currentUser.role_name !== 'admin') {
        req.session.flash = {
            type: 'error',
            message: 'You do not have permission to delete accounts.'
        };
        return res.redirect('/');
    }

    // Prevent admins from deleting their own account
    if (targetUserId === currentUser.id) {
        req.session.flash = {
            type: 'error',
            message: 'You cannot delete your own account.'
        };
        return res.redirect('/users');
    }

    // Delete the user using deleteUser function
    const deleted = await deleteUser(targetUserId);
    if (!deleted) {
        req.session.flash = {
            type: 'error',
            message: 'Failed to delete account. Please try again.'
        };
        return res.redirect('/users');
    }

    // Success! Set flash message and redirect
    req.session.flash = {
        type: 'success',
        message: 'Account deleted successfully.'
    };
    res.redirect('/users');
};

export { 
    showRegistrationForm, 
    processRegistration, 
    showAllUsers, 
    registrationValidation,
    showEditAccountForm,
    processEditAccount,
    processDeleteAccount,
    updateAccountValidation
};