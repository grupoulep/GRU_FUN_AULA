const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStateStr = `  // Shared courses state across all portals
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  // Shared activities state editable by teachers and viewable/submittable by students
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);

  // Shared subjects state editable by teachers/admins and viewable across portals
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  // Shared students state to track admissions and assigned courses
  const [students, setStudents] = useState<StudentAdmission[]>(INITIAL_STUDENTS);

  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [mainAds, setMainAds] = useState<Banner[]>([]);
  const [centralAnnouncement, setCentralAnnouncement] = useState<CentralAnnouncement>(INITIAL_CENTRAL_ANNOUNCEMENT);
  
  // Side Ad state
  const [sideAd, setSideAd] = useState<SideAd>({ active: false, imageUrl: '' });
  
  // Password Recovery state
  const [recoveryRequests, setRecoveryRequests] = useState<PasswordRecoveryRequest[]>([]);`;

const newStateStr = `  const {
    courses, activities, subjects, students, banners, mainAds, centralAnnouncement, sideAd, recoveryRequests,
    addDocWithId, updateDocWithId, deleteDocWithId
  } = useAcademicData();`;

code = code.replace(oldStateStr, newStateStr);
fs.writeFileSync('src/App.tsx', code);
