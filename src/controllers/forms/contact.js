import { body, validationResult } from 'express-validator';
import { saveContactForm, getAllContactForms } from '../../models/forms/contact.js';

/**
 * Helper function to add styles specific to the contact pages only
 */
const addContactSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
};

/**
 * Validation rules for contact form submission
 */
const contactValidation = [
    body('subject')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Subject must be at least 2 characters long'),

    body('message')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Message must be at least 10 characters long')
];

/**
 * Display the contact form
 */
const showContactForm = (req, res) => {
    addContactSpecificStyles(res);
    res.render('forms/contact/form', {
        title: 'Contact Us'
    });
};

/**
 * Process contact form submission
 */
const processContactForm = async (req, res) => {
    // Validate input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', 'Validation errors: Please check your input.');
        return res.redirect('/contact');
    }

    const { subject, message } = req.body;

    // Save to DB
    const savedForm = await saveContactForm(subject, message);

    if (!savedForm) {
        req.flash('error', 'Failed to save contact form.');
        return res.redirect('/contact');
    }

    req.flash('success', 'Thank you for contacting us! We will respond soon.');
    res.redirect('/contact');
};

/**
 * Display all contact form submissions
 */
const showContactResponses = async (req, res) => {
    addContactSpecificStyles(res);
    const contactForms = await getAllContactForms();

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms: contactForms
    });
};

export { showContactForm, processContactForm, showContactResponses, contactValidation };