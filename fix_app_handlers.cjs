const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleRequestRecovery = [\s\S]*?const handleSubmit = \(e: React\.FormEvent\) => \{/m;

const newHandlers = `const handleRequestRecovery = (identifier: string) => {
    const existing = recoveryRequests.find(req => req.identifier === identifier && req.status !== 'completed');
    if (existing) return;
    const id = \`rec-\${Date.now()}\`;
    addDocWithId('recoveryRequests', id, { id, identifier, status: 'pending', requestDate: new Date().toISOString() });
  };
  const handleApproveRecovery = (id: string) => updateDocWithId('recoveryRequests', id, { status: 'approved' });
  
  const handleAddCourse = (c: Omit<Course, 'id'>) => { const id = \`crs-\${Date.now()}\`; addDocWithId('courses', id, { ...c, id }); };
  const handleDeleteCourse = (id: string) => deleteDocWithId('courses', id);
  const handleUpdateCourse = (c: Course) => updateDocWithId('courses', c.id, c);
  
  const handleAddSubject = (s: Omit<Subject, 'id'>) => { const id = \`sbj-\${Date.now()}\`; addDocWithId('subjects', id, { ...s, id }); };
  const handleDeleteSubject = (id: string) => deleteDocWithId('subjects', id);
  const handleUpdateSubject = (s: Subject) => updateDocWithId('subjects', s.id, s);
  
  const handleAddActivity = (a: Omit<Activity, 'id'>) => { const id = \`act-\${Date.now()}\`; addDocWithId('activities', id, { ...a, id }); };
  const handleUpdateActivity = (a: Activity) => updateDocWithId('activities', a.id, a);
  const handleDeleteActivity = (id: string) => deleteDocWithId('activities', id);
  const handleSubmitActivity = (id: string, notes: string) => updateDocWithId('activities', id, { status: 'Entregada', submissionNotes: notes, submittedAt: new Date().toISOString() });
  
  const handleAddStudent = (s: Omit<StudentAdmission, 'id'>) => { const id = \`std-\${Date.now()}\`; addDocWithId('students', id, { ...s, id }); };
  const handleUpdateStudent = (s: StudentAdmission) => updateDocWithId('students', s.id, s);
  const handleDeleteStudent = (id: string) => deleteDocWithId('students', id);

  const handleAddBanner = (b: Omit<Banner, 'id'>) => { const id = \`banner-\${Date.now()}\`; addDocWithId('banners', id, { ...b, id }); };
  const handleUpdateBanner = (b: Banner) => updateDocWithId('banners', b.id, b);
  const handleDeleteBanner = (id: string) => deleteDocWithId('banners', id);

  const handleAddMainAd = (b: Omit<Banner, 'id'>) => { const id = \`mainad-\${Date.now()}\`; addDocWithId('mainAds', id, { ...b, id }); };
  const handleUpdateMainAd = (b: Banner) => updateDocWithId('mainAds', b.id, b);
  const handleDeleteMainAd = (id: string) => deleteDocWithId('mainAds', id);

  const handleCentralAnnouncementChange = (announcement: CentralAnnouncement) => {
    addDocWithId('centralAnnouncement', 'singleton', announcement);
  };
  const handleSideAdChange = (sa: SideAd) => {
    addDocWithId('sideAds', 'singleton', sa);
  };

  const handleSubmit = (e: React.FormEvent) => {`;

code = code.replace(regex, newHandlers);
fs.writeFileSync('src/App.tsx', code);
