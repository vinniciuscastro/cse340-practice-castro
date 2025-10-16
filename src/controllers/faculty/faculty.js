import { getFacultyById,getSortedFaculty } from '../../models/faculty/faculty.js';

// Function that renders the faculty list page
const facultyListPage = async (req, res) => {
    const sortBy = req.query.sort || 'name';
    const faculty = await getSortedFaculty(sortBy);
    res.render('faculty/list', {
        title: 'Faculty Directory',
        facultyList: faculty,
        currentSort: sortBy
    });
}

// Function that uses route parameters to look up individual faculty
const facultyDetailPage = async (req, res, next) => {
    const facultyId = req.params.facultyId;
    const facultyMember = await getFacultyById(facultyId);

    // Proper error handling for invalid faculty IDs
    if (!facultyMember || !facultyMember.id) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }
    res.render('faculty/detail', {
        title: facultyMember.name,
        facultyMember: facultyMember
    });
}   

export { facultyListPage, facultyDetailPage };