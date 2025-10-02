// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';


// Course data - place this after imports, before routes
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};

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

// Course catalog list page
app.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
});
// Course detail page with route parameter
app.get('/catalog/:courseId', (req, res) => {
    // Extract the course ID from the URL
    const courseId = req.params.courseId;

    // Look up the course in our data
    const course = courses[courseId];

    // Handle course not found
    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Log the parameter for debugging
    console.log('Viewing course:', courseId);

    // Render the course detail template
    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: course
    });
});

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});



// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
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