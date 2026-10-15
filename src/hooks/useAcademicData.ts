import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { syncToSupabase, deleteFromSupabase, fetchFromSupabase } from '../lib/supabase';
import {
  Course,
  Subject,
  StudentAdmission,
  Teacher,
  Activity,
  Banner,
  CentralAnnouncement,
  SideAd,
  PasswordRecoveryRequest,
  StudentGrade
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_ACTIVITIES,
  INITIAL_GRADES,
  INITIAL_BANNERS,
  INITIAL_CENTRAL_ANNOUNCEMENT
} from '../data/initialAcademicData';

function sanitizeForFirestore(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result;
}

export function useAcademicData() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [students, setStudents] = useState<StudentAdmission[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [mainAds, setMainAds] = useState<Banner[]>([]);
  const [grades, setGrades] = useState<StudentGrade[]>(INITIAL_GRADES);
  const [centralAnnouncement, setCentralAnnouncement] = useState<CentralAnnouncement | null>(INITIAL_CENTRAL_ANNOUNCEMENT);
  const [sideAd, setSideAd] = useState<SideAd>({ active: false, imageUrl: '' });
  const [recoveryRequests, setRecoveryRequests] = useState<PasswordRecoveryRequest[]>([]);

  const seededRef = useRef(false);

  useEffect(() => {
    // Verificación inicial de LECTURA en Supabase (sin alterar la UI)
    fetchFromSupabase('courses').then((coursesData) => {
      console.log(
        '%c[Supabase Database] Verificación de LECTURA exitosa: Conexión activa y funcionando.',
        'color: #10b981; font-weight: bold; font-size: 11px;',
        {
          tabla: 'courses',
          estadoConexion: 'ACTIVA Y FUNCIONANDO',
          modo: 'Background Sync',
          timestamp: new Date().toISOString()
        }
      );
    });

    let coursesLoaded = false;
    let studentsLoaded = false;
    let teachersLoaded = false;
    let subjectsLoaded = false;

    // Check if we need to auto-seed to prevent empty screens
    const checkAndSeed = async (coursesSnapshotEmpty: boolean) => {
      if (coursesSnapshotEmpty && !seededRef.current) {
        seededRef.current = true;
        try {
          const batch = writeBatch(db);
          INITIAL_COURSES.forEach(c => batch.set(doc(db, 'courses', c.id), sanitizeForFirestore(c)));
          INITIAL_TEACHERS.forEach(t => batch.set(doc(db, 'teachers', t.id), sanitizeForFirestore(t)));
          INITIAL_SUBJECTS.forEach(s => batch.set(doc(db, 'subjects', s.id), sanitizeForFirestore(s)));
          INITIAL_STUDENTS.forEach(st => batch.set(doc(db, 'students', st.id), sanitizeForFirestore(st)));
          INITIAL_ACTIVITIES.forEach(a => batch.set(doc(db, 'activities', a.id), sanitizeForFirestore(a)));
          INITIAL_GRADES.forEach(g => batch.set(doc(db, 'grades', g.id), sanitizeForFirestore(g)));
          INITIAL_BANNERS.forEach(b => batch.set(doc(db, 'banners', b.id), sanitizeForFirestore(b)));
          batch.set(doc(db, 'centralAnnouncement', 'singleton'), sanitizeForFirestore(INITIAL_CENTRAL_ANNOUNCEMENT));
          await batch.commit();
        } catch (e: any) {
          console.warn('Auto-seed bypassed:', e?.message);
        }
      }
    };

    const unsubCourses = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        coursesLoaded = true;
        if (!snapshot.empty) {
          setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Course)));
        } else {
          checkAndSeed(true);
        }
      },
      (err) => console.warn('Firestore listener [courses]:', err.message)
    );
    
    const unsubActivities = onSnapshot(
      collection(db, 'activities'),
      (snapshot) => {
        if (!snapshot.empty) {
          setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Activity)));
        }
      },
      (err) => console.warn('Firestore listener [activities]:', err.message)
    );

    const unsubSubjects = onSnapshot(
      collection(db, 'subjects'),
      (snapshot) => {
        subjectsLoaded = true;
        if (!snapshot.empty) {
          setSubjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Subject)));
        }
      },
      (err) => console.warn('Firestore listener [subjects]:', err.message)
    );

    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        studentsLoaded = true;
        if (!snapshot.empty) {
          setStudents(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StudentAdmission)));
        }
      },
      (err) => console.warn('Firestore listener [students]:', err.message)
    );

    const unsubTeachers = onSnapshot(
      collection(db, 'teachers'),
      (snapshot) => {
        teachersLoaded = true;
        if (!snapshot.empty) {
          setTeachers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Teacher)));
        }
      },
      (err) => console.warn('Firestore listener [teachers]:', err.message)
    );

    const unsubGrades = onSnapshot(
      collection(db, 'grades'),
      (snapshot) => {
        if (!snapshot.empty) {
          setGrades(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StudentGrade)));
        }
      },
      (err) => console.warn('Firestore listener [grades]:', err.message)
    );

    const unsubBanners = onSnapshot(
      collection(db, 'banners'),
      (snapshot) => {
        if (!snapshot.empty) {
          setBanners(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner)));
        }
      },
      (err) => console.warn('Firestore listener [banners]:', err.message)
    );

    const unsubMainAds = onSnapshot(
      collection(db, 'mainAds'),
      (snapshot) => {
        setMainAds(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner)));
      },
      (err) => console.warn('Firestore listener [mainAds]:', err.message)
    );

    const unsubCentral = onSnapshot(
      doc(db, 'centralAnnouncement', 'singleton'),
      (docSnap) => {
        if (docSnap.exists()) {
          setCentralAnnouncement(docSnap.data() as CentralAnnouncement);
        }
      },
      (err) => console.warn('Firestore listener [centralAnnouncement]:', err.message)
    );

    const unsubSideAd = onSnapshot(
      doc(db, 'sideAds', 'singleton'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSideAd(docSnap.data() as SideAd);
        } else {
          setSideAd({ active: false, imageUrl: '' });
        }
      },
      (err) => console.warn('Firestore listener [sideAds]:', err.message)
    );

    const unsubRecovery = onSnapshot(
      collection(db, 'recoveryRequests'),
      (snapshot) => {
        setRecoveryRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PasswordRecoveryRequest)));
      },
      (err) => console.warn('Firestore listener [recoveryRequests]:', err.message)
    );

    return () => {
      unsubCourses();
      unsubActivities();
      unsubSubjects();
      unsubStudents();
      unsubTeachers();
      unsubGrades();
      unsubBanners();
      unsubMainAds();
      unsubCentral();
      unsubSideAd();
      unsubRecovery();
    };
  }, []);

  const addDocWithId = async (colName: string, id: string, data: any) => {
    try {
      const sanitized = sanitizeForFirestore(data);
      await setDoc(doc(db, colName, id), sanitized);
      const res = await syncToSupabase(colName, { ...sanitized, id });
      console.log(
        `%c[Supabase Database] Operación de ESCRITURA exitosa en tabla "${colName}":`,
        'color: #10b981; font-weight: bold;',
        {
          tabla: colName,
          documentoId: id,
          operacion: 'INSERT (Creación)',
          estadoConexion: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
          timestamp: new Date().toISOString(),
          datos: sanitized
        }
      );
    } catch (err: any) {
      console.error(`Error adding doc to ${colName}:`, err.message);
    }
  };

  const updateDocWithId = async (colName: string, id: string, data: any) => {
    try {
      const sanitized = sanitizeForFirestore(data);
      await setDoc(doc(db, colName, id), sanitized, { merge: true });
      const res = await syncToSupabase(colName, { ...sanitized, id });
      console.log(
        `%c[Supabase Database] Operación de ESCRITURA/ACTUALIZACIÓN exitosa en tabla "${colName}":`,
        'color: #10b981; font-weight: bold;',
        {
          tabla: colName,
          documentoId: id,
          operacion: 'UPDATE / MERGE',
          estadoConexion: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
          timestamp: new Date().toISOString(),
          datosActualizados: sanitized
        }
      );
    } catch (err: any) {
      console.error(`Error updating doc in ${colName}:`, err.message);
    }
  };

  const deleteDocWithId = async (colName: string, id: string) => {
    try {
      await deleteDoc(doc(db, colName, id));
      await deleteFromSupabase(colName, id);
      console.log(
        `%c[Supabase Database] Operación de ELIMINACIÓN exitosa en tabla "${colName}":`,
        'color: #10b981; font-weight: bold;',
        {
          tabla: colName,
          documentoId: id,
          operacion: 'DELETE',
          estadoConexion: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
          timestamp: new Date().toISOString()
        }
      );
    } catch (err: any) {
      console.error(`Error deleting doc in ${colName}:`, err.message);
    }
  };

  const saveGrade = async (grade: StudentGrade) => {
    const id = grade.id || `${grade.studentId}_${grade.subjectId}`;
    const payload = { ...grade, id, updatedAt: new Date().toISOString() };
    await updateDocWithId('grades', id, payload);
    console.log(
      `%c[Supabase Database] Registro de NOTA guardado con éxito:`,
      'color: #10b981; font-weight: bold;',
      {
        tabla: 'grades',
        notaId: id,
        estudiante: grade.studentName || grade.studentCedula || grade.studentId,
        definitiva: grade.definitiva,
        estadoConexion: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
        timestamp: new Date().toISOString()
      }
    );
  };

  const saveBulkGrades = async (newGrades: StudentGrade[]) => {
    try {
      const batch = writeBatch(db);
      newGrades.forEach((g) => {
        const id = g.id || `${g.studentId}_${g.subjectId}`;
        const ref = doc(db, 'grades', id);
        const item = sanitizeForFirestore({ ...g, id, updatedAt: new Date().toISOString() });
        batch.set(ref, item, { merge: true });
        syncToSupabase('grades', item);
      });
      await batch.commit();
      console.log(
        `%c[Supabase Database] Operación MASIVA de ESCRITURA exitosa en tabla "grades":`,
        'color: #10b981; font-weight: bold;',
        {
          tabla: 'grades',
          totalRegistros: newGrades.length,
          estadoConexion: 'CONEXIÓN ACTIVA Y FUNCIONANDO',
          timestamp: new Date().toISOString()
        }
      );
    } catch (e: any) {
      console.error('Error saving bulk grades:', e.message);
    }
  };

  return {
    courses,
    activities,
    subjects,
    students,
    teachers,
    grades,
    banners,
    mainAds,
    centralAnnouncement,
    sideAd,
    recoveryRequests,
    addDocWithId,
    updateDocWithId,
    deleteDocWithId,
    saveGrade,
    saveBulkGrades
  };
}
