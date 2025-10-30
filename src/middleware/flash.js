/**
 * Flash Message Middleware
 * 
 * Provides temporary message storage that survives redirects but is consumed on render.
 * Messages are stored in the session and organized by type (success, error, warning, info).
 * 
 * Usage in controllers:
 *   req.flash('success', 'Message text')  // Store a message
 *   req.flash('error')                    // Get all error messages
 *   req.flash()                           // Get all messages (all types)
 */

/**
 * Initialize flash message storage and provide access methods
 */
const flashMiddleware = (req, res, next) => {
    /**
     * The flash function handles both setting and getting messages
     * - Called with 2 args (type, message): stores a new message
     * - Called with 1 arg (type): retrieves and clears messages of that type
     * - Called with 0 args: retrieves and clears all messages
     */
    req.flash = function(type, message) {
        // Initialize flash storage if it doesn't exist
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // SETTING: Two arguments means we're storing a new message
        if (type && message) {
            // Ensure this message type's array exists
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            // Add the message to the appropriate type array
            req.session.flash[type].push(message);
            return;
        }

        // GETTING ONE TYPE: One argument means retrieve messages of that type
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            // Clear this type's messages after retrieving
            req.session.flash[type] = [];
            return messages;
        }

        // GETTING ALL: No arguments means retrieve all message types
        const allMessages = req.session.flash || {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        // Clear all flash messages after retrieving
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };

    next();
}

/**
 * Make flash function available to all templates via res.locals
 * This middleware must run AFTER flashMiddleware
 */
const flashLocals = (req, res, next) => {
    // Attach the flash function to res.locals so templates can access it
    // The function is NOT called here, just made available
    // Messages are only consumed when a template calls flash()
    res.locals.flash = req.flash;
    next();
}

/**
 * Combined flash middleware that runs both functions in the correct order
 * Import and use this as a single middleware function in your application
 */
const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;