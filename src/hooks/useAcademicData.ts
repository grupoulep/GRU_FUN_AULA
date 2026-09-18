import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course, Subject, StudentAdmission, Activity, Banner, CentralAnnouncement, SideAd, PasswordRecoveryRequest } from '../types';

export function useAcademicData() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<StudentAdmission[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [mainAds, setMainAds] = useState<Banner[]>([]);
  const [centralAnnouncement, setCentralAnnouncement] = useState<CentralAnnouncement | null>(null);
  const [sideAd, setSideAd] = useState<SideAd>({ active: false, imageUrl: '' });
  const [recoveryRequests, setRecoveryRequests] = useState<PasswordRecoveryRequest[]>([]);

  useEffect(() => {
    const unsubCourses = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Course)));
      },
      (err) => console.warn('Firestore listener [courses]:', err.message)
    );
    
    const unsubActivities = onSnapshot(
      collection(db, 'activities'),
      (snapshot) => {
        setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Activity)));
      },
      (err) => console.warn('Firestore listener [activities]:', err.message)
    );

    const unsubSubjects = onSnapshot(
      collection(db, 'subjects'),
      (snapshot) => {
        setSubjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Subject)));
      },
      (err) => console.warn('Firestore listener [subjects]:', err.message)
    );

    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        setStudents(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StudentAdmission)));
      },
      (err) => console.warn('Firestore listener [students]:', err.message)
    );

    const unsubBanners = onSnapshot(
      collection(db, 'banners'),
      (snapshot) => {
        setBanners(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner)));
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
        } else {
          setCentralAnnouncement({ title: '', content: '', active: false });
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
      unsubBanners();
      unsubMainAds();
      unsubCentral();
      unsubSideAd();
      unsubRecovery();
    };
  }, []);

  const addDocWithId = async (colName: string, id: string, data: any) => {
    try {
      await setDoc(doc(db, colName, id), data);
    } catch (err: any) {
      console.error(`Error adding doc to ${colName}:`, err.message);
    }
  };

  const updateDocWithId = async (colName: string, id: string, data: any) => {
    try {
      await updateDoc(doc(db, colName, id), data);
    } catch (err: any) {
      console.error(`Error updating doc in ${colName}:`, err.message);
    }
  };

  const deleteDocWithId = async (colName: string, id: string) => {
    try {
      await deleteDoc(doc(db, colName, id));
    } catch (err: any) {
      console.error(`Error deleting doc in ${colName}:`, err.message);
    }
  };

  return {
    courses, activities, subjects, students, banners, mainAds, centralAnnouncement, sideAd, recoveryRequests,
    addDocWithId, updateDocWithId, deleteDocWithId
  };
}
