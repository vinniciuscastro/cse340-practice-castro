import { getAllCourses, getCourseBySlug} from '../../models/catalog/courses.js';
import { getSortedSections } from '../../models/catalog/catalog.js';

/**
 * Helper function to add styles specific to the catalog pages only
 */
const addCatalogSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
};

// Route handler for the course catalog list page
const catalogPage = async (req, res) => {
    const courses = await getAllCourses();

    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
};


// Route handler for individual course detail pages
const courseDetailPage = async (req, res, next) => {
    const courseSlug = req.params.courseId;
    const course = await getCourseBySlug(courseSlug);

    // If course doesn't exist, create 404 error
    if (!course || Object.keys(course).length === 0) {
        const err = new Error(`Course ${courseSlug} not found`);
        err.status = 404;
        return next(err);
    }

    // Handle sorting if requested
    const sortBy = req.query.sort || 'time';
    console.log('Sort parameter:', sortBy);
    const sections = await getSortedSections(courseSlug, sortBy);
    console.log('Number of sections:', sections.length);
    console.log('First section:', sections[0]);

    res.render('course-detail', {
        title: `${course.courseCode} - ${course.name}`,
        course: course,
        sections: sections,
        currentSort: sortBy,
        queryParams: req.query
    });
};

export { catalogPage, courseDetailPage };