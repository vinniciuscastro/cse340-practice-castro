import { body, validationResult } from 'express-validator';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

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
 * Display the registration form
 */
const showRegistrationForm = (req, res) => {
    // TODO: Add registration-specific styles using res.addStyle()
    // TODO: Render the registration form view (forms/registration/form)
};

/**
 * Process user registration submission
 */
const processRegistration = async (req, res) => {
    // TODO: Check for validation errors using validationResult(req)
    // TODO: If errors exist, redirect back to registration form
    // TODO: Extract name, email, password from req.body
    // TODO: Check if email already exists using emailExists()
    // TODO: If email exists, log message and redirect back
    // TODO: Save the user using saveUser()
    // TODO: If save fails, log error and redirect back
    // TODO: If successful, log success and redirect (maybe to users list?)
};

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {
    // TODO: Get all users using getAllUsers()
    // TODO: Add registration-specific styles
    // TODO: Render the users list view (forms/registration/list) with the user data
};

export { showRegistrationForm, processRegistration, showAllUsers, registrationValidation };