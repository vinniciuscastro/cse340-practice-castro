// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
const app = express();

const name = process.env.NAME;
/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// // Define a route handler for the root URL ('/')
// app.get('/', (req, res) => {
//     res.send(`Hello, ${name}, you are the best!`);
// });

// Define the port number the server will listen on

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Global template variables middleware
 * 
 * Makes common variables available to all EJS templates without having to pass
 * them individually from each route handler
 */
app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    // Continue to the next middleware or route handler
    next();
});
// Global error handler - note the four parameters
app.use((err, req, res, next) => {
    // Log error details for developers
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    // Determine response based on error type
    const status = err.status || 500;
    const message = status === 404 
        ? 'The page you requested could not be found.' 
        : 'An unexpected error occurred. Please try again later.';

    // Send appropriate response to user
    res.status(status).send(message);
});



/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});

app.get('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', { title });
});

app.get('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', { title });
});


// Practice learning 
app.get('/student', (req, res) => {
    const title = "Student Information";
    const name = "Vinnie";
    const id = "858345317";
    const email = "cas21003@byui.edu";
    const address = "Rexburg, ID";
    res.render('student', { title, name, id, email, address });
});

// Future professional approach (preview)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    // Render appropriate error template
    res.status(status).render(`errors/${status}`, {
        title: 'Error',
        message: err.message,
        // Additional template data...
    });
});
// Global error handler processes both 404s and 500s
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = status === 404
        ? 'The page you requested does not exist.'
        : 'An unexpected server error occurred.';
    res.status(status).send(message);
});
// Catch-all middleware for unmatched routes
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err); // Forward to global error handler
});
// stuff done in class just to understand error handling
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// app.get('/demo/:color/:food', (req, res) => {
//     const title = 'Params Demo';
//     const { color, food } = req.params;
//     res.render('demo', { title, color, food });
// });

// Global error handling middleware
app.use((err,req, res, next) => {
    if (err.status === 404) {
        res.status(404);
        const title = '404 - Page Not Found';
        res.render('404', { title });
    }
    res.status(err.status || 500);
});


// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');
    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });
        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });
        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});