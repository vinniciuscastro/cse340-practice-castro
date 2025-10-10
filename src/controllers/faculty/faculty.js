import { getFacultyById,getSortedFaculty } from '../../models/faculty/faculty.js';

// Function that renders the faculty list page
const facultyListPage = (req, res) => {
    const sortBy = req.query.sort || 'name';
    const faculty = getSortedFaculty(sortBy);
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: faculty,
        currentSort: sortBy
    });
}

// Function that uses route parameters to look up individual faculty
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const facultyMember = getFacultyById(facultyId);

    // Proper error handling for invalid faculty IDs
    if (!facultyMember) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }   
    res.render('faculty-detail', {
        title: facultyMember.name,
        faculty: facultyMember
    });
}   

export { facultyListPage, facultyDetailPage };