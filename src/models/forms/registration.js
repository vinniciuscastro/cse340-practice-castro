import db from '../db.js';
import bcrypt from 'bcrypt';

/**
 * Hash a plain text password using bcrypt
 * @param {string} plainPassword - The password to hash
 * @returns {Promise<string|null>} The hashed password or null if failed
 */
const hashPassword = async (plainPassword) => {
    try {
        // Use bcrypt.hash() with the password and salt rounds of 10
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // Return the hashed password
        return hashedPassword;

    } catch (error) {
        console.error('Error hashing password:', error);
        return null;
    }
};

/**
 * Check if an email address is already registered
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */
const emailExists = async (email) => {
    try {
        const query = 'SELECT COUNT(*) FROM users WHERE email = $1';
        const result = await db.query(query, [email]);

        // Return true if count > 0, false otherwise
        if (Number(result.rows[0].count) > 0) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error('DB Error in emailExists:', error);
        return false; // Safe fallback - assume email doesn't exist
    }
};

/**
 * Save a new user registration to the database
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's plain text password (will be hashed)
 * @returns {Promise<Object|null>} The saved user (without password) or null if failed
 */
const saveUser = async (name, email, password) => {
    try {
        // Hash the password using hashPassword function
        hashPassword(password);

        const query = `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at, updated_at
        `;

        // Execute the query with the parameters and return the user data
        const values = [name, email, await hashPassword(password)];
        const result = await db.query(query, values);
        return result.rows[0] || null;
        

    } catch (error) {
        console.error('DB Error in saveUser:', error);
        return null;
    }
};

/**
 * Retrieve all registered users (without passwords)
 * @returns {Promise<Array>} Array of user objects without passwords
 */
const getAllUsers = async () => {
    try {
        const query = `
            SELECT id, name, email, created_at, updated_at
            FROM users
            ORDER BY created_at DESC
        `;

        // Execute the query and return the rows
        const result = await db.query(query);
        return result.rows;

    } catch (error) {
        console.error('DB Error in getAllUsers:', error);
        return []; // Safe fallback
    }
};

export { hashPassword, emailExists, saveUser, getAllUsers };