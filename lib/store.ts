import { useState, useEffect } from 'react';
import { Student, Intervention, NotificationItem, Role, ParentAlertLog, ModelWeights, UserAccount, StudentDocument, FacultyMember, Department, SubjectScore } from '@/types';
import { mockStudents } from '@/data/mockStudents';
import { initialInterventions } from '@/data/mockInterventions';
import { initialNotifications } from '@/data/mockNotifications';
import { DEFAULT_WEIGHTS, calculatePrediction } from '@/lib/predictionEngine';
import { updateStudentWithExtractedMetrics } from '@/lib/documentExtractor';

export const initialFaculty: FacultyMember[] = [
  { id: 'FAC-001', facultyId: 'FAC-001', name: 'Dr. S. Ramanathan', email: 'ramanathan@edu.in', password: 'faculty@123', department: 'AI & DS', role: 'Head of Department', phone: '+91 98401 23456', studentsAssigned: 22 },
  { id: 'FAC-002', facultyId: 'FAC-002', name: 'Prof. K. Venkatesh', email: 'venkatesh@edu.in', password: 'faculty@123', department: 'CSE', role: 'Class Advisor', phone: '+91 98402 34567', studentsAssigned: 15 },
  { id: 'FAC-003', facultyId: 'FAC-003', name: 'Dr. M. Lakshmi', email: 'lakshmi@edu.in', password: 'faculty@123', department: 'ECE', role: 'Senior Professor', phone: '+91 98403 45678', studentsAssigned: 12 },
  { id: 'FAC-004', facultyId: 'FAC-004', name: 'Prof. P. Anand', email: 'anand@edu.in', password: 'faculty@123', department: 'MECH', role: 'Class Advisor', phone: '+91 98404 56789', studentsAssigned: 10 },
  { id: 'FAC-005', facultyId: 'FAC-005', name: 'Prof. S. Geetha', email: 'geetha@edu.in', password: 'faculty@123', department: 'IT', role: 'Mentor', phone: '+91 98405 67890', studentsAssigned: 14 },
  { id: 'FAC-006', facultyId: 'FAC-006', name: 'Dr. R. Balaji', email: 'balaji@edu.in', password: 'faculty@123', department: 'AI & ML', role: 'Class Advisor', phone: '+91 98406 78901', studentsAssigned: 18 },
  { id: 'FAC-007', facultyId: 'FAC-007', name: 'Prof. N. Sivakumar', email: 'sivakumar@edu.in', password: 'faculty@123', department: 'CIVIL', role: 'Class Advisor', phone: '+91 98407 89012', studentsAssigned: 16 },
];

export const initialAdmins: UserAccount[] = [
  { id: 'USR-ADM-1', name: 'System Administrator', email: 'admin@kalvikkan.ai', password: 'admin@123', role: 'admin' },
];

const STORAGE_KEYS = {
  ROLE: 'kalvikkan_user_role_v2',
  STUDENTS: 'kalvikkan_students_v2',
  FACULTY: 'kalvikkan_faculty_v2',
  ADMINS: 'kalvikkan_admins_v2',
  INTERVENTIONS: 'kalvikkan_interventions_v2',
  NOTIFICATIONS: 'kalvikkan_notifications_v2',
  THEME: 'kalvikkan_theme',
  WEIGHTS: 'kalvikkan_weights_v2',
  PARENT_ALERTS: 'kalvikkan_parent_alerts_v2',
  LOGGED_STUDENT_ID: 'kalvikkan_logged_student_id_v2',
  CURRENT_USER: 'kalvikkan_current_user_v2',
};

const SESSION_EVENT = 'kalvikkan-session-changed';

function broadcastSession() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SESSION_EVENT));
  }
}

export function getInitialRole(): Role {
  if (typeof window === 'undefined') return 'faculty';
  return (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || 'faculty';
}

export function setStoredRole(role: Role) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }
}

export function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
}

export function setStoredTheme(theme: 'light' | 'dark') {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export function useKalvikkanStore() {
  const [role, setRoleState] = useState<Role>('faculty');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(initialFaculty);
  const [adminList, setAdminList] = useState<UserAccount[]>(initialAdmins);
  const [interventions, setInterventions] = useState<Intervention[]>(initialInterventions);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [weights, setWeights] = useState<ModelWeights>(DEFAULT_WEIGHTS);
  const [parentAlerts, setParentAlerts] = useState<ParentAlertLog[]>([]);
  const [loggedStudentId, setLoggedStudentId] = useState<string>('ENG0001');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE) as Role;
      if (savedRole) setRoleState(savedRole);

      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(mockStudents));
      }

      const savedFaculty = localStorage.getItem(STORAGE_KEYS.FACULTY);
      if (savedFaculty) {
        setFacultyList(JSON.parse(savedFaculty));
      } else {
        localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(initialFaculty));
      }

      const savedAdmins = localStorage.getItem(STORAGE_KEYS.ADMINS);
      if (savedAdmins) {
        setAdminList(JSON.parse(savedAdmins));
      } else {
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(initialAdmins));
      }

      const savedInterventions = localStorage.getItem(STORAGE_KEYS.INTERVENTIONS);
      if (savedInterventions) {
        setInterventions(JSON.parse(savedInterventions));
      } else {
        localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(initialInterventions));
      }

      const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
      }

      const savedTheme = (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
      setThemeState(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const savedWeights = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      if (savedWeights) {
        setWeights(JSON.parse(savedWeights));
      }

      const savedAlerts = localStorage.getItem(STORAGE_KEYS.PARENT_ALERTS);
      if (savedAlerts) {
        setParentAlerts(JSON.parse(savedAlerts));
      }

      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedStudentId = localStorage.getItem(STORAGE_KEYS.LOGGED_STUDENT_ID);
      if (savedStudentId) {
        setLoggedStudentId(savedStudentId);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Every component calls this hook and gets its own state copy, so session changes
  // (login, signup, role switch, logout) must be broadcast to the other copies.
  useEffect(() => {
    const syncSession = () => {
      try {
        const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE) as Role | null;
        setRoleState(savedRole || 'faculty');
        const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
        const savedStudentId = localStorage.getItem(STORAGE_KEYS.LOGGED_STUDENT_ID);
        if (savedStudentId) setLoggedStudentId(savedStudentId);
        const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        if (savedStudents) setStudents(JSON.parse(savedStudents));
      } catch (e) {
        console.error('Failed to sync session:', e);
      }
    };
    window.addEventListener(SESSION_EVENT, syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener(SESSION_EVENT, syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const switchRole = (newRole: Role) => {
    setRoleState(newRole);
    setStoredRole(newRole);

    if (currentUser && currentUser.role === newRole) {
      broadcastSession();
      return;
    }

    let newUser: UserAccount;
    if (newRole === 'student') {
      const targetSt = students.find((s) => s.id === loggedStudentId) || students[0];
      newUser = {
        id: targetSt.id,
        name: targetSt.name,
        email: targetSt.email,
        role: 'student',
        studentId: targetSt.id,
        department: targetSt.department,
      };
    } else if (newRole === 'admin') {
      newUser = {
        id: 'USR-ADM-1',
        name: 'System Administrator',
        email: 'admin@kalvikkan.ai',
        role: 'admin',
      };
    } else {
      newUser = {
        id: 'USR-FAC-1',
        name: 'Dr. S. Ramanathan',
        email: 'ramanathan@edu.in',
        role: 'faculty',
        department: 'AI & DS',
      };
    }

    setCurrentUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    }
    broadcastSession();
  };

  const loginWithCredentials = (email: string, pass: string, selectedRole: Role): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) return false;

    if (selectedRole === 'student') {
      // Find matching student by email or EMIS ID
      const matched = students.find(
        (s) => s.email.toLowerCase() === cleanEmail || s.emis.toLowerCase() === cleanEmail
      );

      if (matched) {
        const correctPass = matched.password || 'student@123';
        if (cleanPass !== correctPass && cleanPass !== 'student@123') {
          return false;
        }
        const user: UserAccount = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: 'student',
          studentId: matched.id,
          department: matched.department,
        };
        setCurrentUser(user);
        setRoleState('student');
        setLoggedStudentId(matched.id);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
          localStorage.setItem(STORAGE_KEYS.ROLE, 'student');
          localStorage.setItem(STORAGE_KEYS.LOGGED_STUDENT_ID, matched.id);
        }
        broadcastSession();
        return true;
      }
      return false;
    } else if (selectedRole === 'faculty') {
      const matchedFac = facultyList.find(
        (f) => f.email.toLowerCase() === cleanEmail || f.facultyId?.toLowerCase() === cleanEmail
      );

      if (matchedFac) {
        const correctPass = matchedFac.password || 'faculty@123';
        if (cleanPass !== correctPass && cleanPass !== 'faculty@123') {
          return false;
        }
        const user: UserAccount = {
          id: matchedFac.id,
          name: matchedFac.name,
          email: matchedFac.email,
          role: 'faculty',
          department: matchedFac.department,
          facultyId: matchedFac.facultyId,
        };
        setCurrentUser(user);
        setRoleState('faculty');
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
          localStorage.setItem(STORAGE_KEYS.ROLE, 'faculty');
        }
        broadcastSession();
        return true;
      }
      return false;
    } else if (selectedRole === 'admin') {
      const matchedAdmin = adminList.find(
        (a) => a.email.toLowerCase() === cleanEmail
      );

      if (matchedAdmin) {
        const correctPass = matchedAdmin.password || 'admin@123';
        if (cleanPass !== correctPass && cleanPass !== 'admin@123') {
          return false;
        }
        const user: UserAccount = {
          id: matchedAdmin.id,
          name: matchedAdmin.name,
          email: matchedAdmin.email,
          role: 'admin',
          department: matchedAdmin.department,
        };
        setCurrentUser(user);
        setRoleState('admin');
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
          localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
        }
        broadcastSession();
        return true;
      }
      return false;
    }

    return false;
  };

  const getDefaultSubjectsForDepartment = (dept: Department, baseScore: number): SubjectScore[] => {
    const rounded = Math.min(100, Math.max(35, Math.round(baseScore)));
    const getGrade = (s: number) =>
      s >= 90 ? 'O' : s >= 80 ? 'A+' : s >= 70 ? 'A' : s >= 60 ? 'B+' : s >= 50 ? 'B' : 'RA';

    const subMaps: Record<Department, { code: string; name: string }[]> = {
      'AI & DS': [
        { code: 'AD3401', name: 'Machine Learning' },
        { code: 'AD3402', name: 'Data Science Principles' },
        { code: 'MA3354', name: 'Discrete Mathematics' },
        { code: 'CS3391', name: 'Object Oriented Programming' },
      ],
      'AI & ML': [
        { code: 'AL3401', name: 'Artificial Intelligence' },
        { code: 'AL3402', name: 'Deep Learning' },
        { code: 'MA3354', name: 'Discrete Mathematics' },
        { code: 'CS3391', name: 'Neural Networks' },
      ],
      CSE: [
        { code: 'CS3401', name: 'Algorithms' },
        { code: 'CS3402', name: 'Operating Systems' },
        { code: 'MA3354', name: 'Discrete Mathematics' },
        { code: 'CS3391', name: 'Database Management Systems' },
      ],
      ECE: [
        { code: 'EC3401', name: 'Signals and Systems' },
        { code: 'EC3402', name: 'Digital Electronics' },
        { code: 'MA3355', name: 'Probability and Linear Algebra' },
        { code: 'EC3391', name: 'Electronic Circuits' },
      ],
      IT: [
        { code: 'IT3401', name: 'Web Technology' },
        { code: 'IT3402', name: 'Software Engineering' },
        { code: 'MA3354', name: 'Discrete Mathematics' },
        { code: 'CS3391', name: 'Computer Networks' },
      ],
      MECH: [
        { code: 'ME3401', name: 'Thermodynamics' },
        { code: 'ME3402', name: 'Fluid Mechanics' },
        { code: 'MA3351', name: 'Transforms & PDE' },
        { code: 'ME3391', name: 'Kinematics of Machinery' },
      ],
      EEE: [
        { code: 'EE3401', name: 'Electrical Machines' },
        { code: 'EE3402', name: 'Control Systems' },
        { code: 'MA3351', name: 'Transforms & PDE' },
        { code: 'EE3391', name: 'Power Electronics' },
      ],
      CIVIL: [
        { code: 'CE3401', name: 'Structural Analysis' },
        { code: 'CE3402', name: 'Surveying & Leveling' },
        { code: 'MA3351', name: 'Transforms & PDE' },
        { code: 'CE3391', name: 'Strength of Materials' },
      ],
    };

    const list = subMaps[dept] || subMaps['AI & DS'];
    return list.map((item, idx) => {
      const jitter = ((idx % 3) - 1) * 3;
      const score = Math.min(100, Math.max(38, rounded + jitter));
      return {
        code: item.code,
        name: item.name,
        score,
        attendance: Math.min(100, Math.max(60, rounded + 4)),
        grade: getGrade(score),
      };
    });
  };

  const addStudent = (studentData: {
    name: string;
    department: Department;
    year?: number;
    section?: string;
    email: string;
    phone: string;
    emis: string;
    aadhar?: string;
    password?: string;
    attendance?: number;
    assignmentCompletion?: number;
    previousScore?: number;
    assessmentScore?: number;
    quizScore?: number;
    guardianPhone?: string;
    mentorName?: string;
  }): Student => {
    const attendance = Number(studentData.attendance ?? 82);
    const previousScore = Number(studentData.previousScore ?? 75);
    const assignmentCompletion = Number(studentData.assignmentCompletion ?? 80);
    const assessmentScore = Number(studentData.assessmentScore ?? 72);
    const quizScore = Number(studentData.quizScore ?? 70);

    const subjects = getDefaultSubjectsForDepartment(studentData.department, assessmentScore);

    const pred = calculatePrediction(
      {
        attendance,
        previousScore,
        assignmentCompletion,
        quizScore,
        assessmentScore,
        subjects,
      },
      weights
    );

    const id = `STU-${Date.now().toString().slice(-4)}`;
    const newStudent: Student = {
      id,
      name: studentData.name.trim(),
      department: studentData.department,
      year: Number(studentData.year || 2),
      section: (studentData.section || 'A').toUpperCase(),
      email: studentData.email.trim().toLowerCase(),
      phone: studentData.phone || '+91 98400 11223',
      emis: studentData.emis.trim() || `33020100${Math.floor(1000 + Math.random() * 9000)}`,
      aadhar:
        studentData.aadhar ||
        `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      password: studentData.password || 'student@123',
      attendance,
      assignmentCompletion,
      previousScore,
      assessmentScore,
      quizScore,
      predictedScore: pred.predictedScore,
      riskLevel: pred.riskLevel,
      trend: pred.predictedScore >= 75 ? 'UP' : pred.predictedScore >= 55 ? 'STABLE' : 'DOWN',
      subjects,
      riskFactors: pred.riskFactors,
      guardianPhone: studentData.guardianPhone || '+91 98400 00000',
      mentorName: studentData.mentorName || 'Dr. S. Ramanathan',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    const updatedStudents = [newStudent, ...students];
    setStudents(updatedStudents);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    }

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Student Added',
      message: `${newStudent.name} (${newStudent.department}, EMIS: ${newStudent.emis}) added with predicted score ${newStudent.predictedScore}%.`,
      time: 'Just now',
      type: newStudent.riskLevel === 'HIGH' ? 'critical' : 'success',
      read: false,
      targetPath: `/student/${newStudent.id}`,
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
    }

    return newStudent;
  };

  const addFaculty = (facultyData: {
    name: string;
    email: string;
    department: Department;
    role: string;
    phone?: string;
    facultyId?: string;
    studentsAssigned?: number;
    password?: string;
  }): FacultyMember => {
    const id = `FAC-${Date.now().toString().slice(-4)}`;
    const newFac: FacultyMember = {
      id,
      facultyId: facultyData.facultyId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
      name: facultyData.name.trim(),
      email: facultyData.email.trim().toLowerCase(),
      department: facultyData.department,
      role: facultyData.role || 'Class Advisor',
      phone: facultyData.phone || '+91 98401 00000',
      studentsAssigned: Number(facultyData.studentsAssigned ?? 20),
      password: facultyData.password || 'faculty@123',
    };

    const updatedFaculty = [newFac, ...facultyList];
    setFacultyList(updatedFaculty);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(updatedFaculty));
    }

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Faculty Registered',
      message: `${newFac.name} joined ${newFac.department} as ${newFac.role}.`,
      time: 'Just now',
      type: 'info',
      read: false,
      targetPath: '/admin',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
    }

    return newFac;
  };

  const registerUser = (details: {
    role: Role;
    name: string;
    email: string;
    password?: string;
    department?: Department;
    phone?: string;
    emis?: string;
    aadhar?: string;
    year?: number;
    section?: string;
    guardianPhone?: string;
    attendance?: number;
    previousScore?: number;
    facultyRole?: string;
    facultyId?: string;
  }): { success: boolean; user: UserAccount; error?: string } => {
    const cleanEmail = details.email.trim().toLowerCase();
    const cleanName = details.name.trim();

    if (!cleanName || !cleanEmail) {
      return { success: false, user: null as any, error: 'Name and email are required.' };
    }

    if (details.role === 'student') {
      const student = addStudent({
        name: cleanName,
        department: details.department || 'AI & DS',
        year: details.year || 1,
        section: details.section || 'A',
        email: cleanEmail,
        phone: details.phone || '+91 98400 11223',
        emis: details.emis || `33020100${Math.floor(1000 + Math.random() * 9000)}`,
        aadhar: details.aadhar || '',
        password: details.password || 'student@123',
        attendance: details.attendance ?? 85,
        previousScore: details.previousScore ?? 78,
        guardianPhone: details.guardianPhone || '',
      });

      const user: UserAccount = {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student',
        studentId: student.id,
        department: student.department,
      };

      setCurrentUser(user);
      setRoleState('student');
      setLoggedStudentId(student.id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ROLE, 'student');
        localStorage.setItem(STORAGE_KEYS.LOGGED_STUDENT_ID, student.id);
      }
      broadcastSession();
      return { success: true, user };
    } else if (details.role === 'faculty') {
      const fac = addFaculty({
        name: cleanName,
        email: cleanEmail,
        department: details.department || 'AI & DS',
        role: details.facultyRole || 'Class Advisor',
        facultyId: details.facultyId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
        phone: details.phone || '',
        password: details.password || 'faculty@123',
      });

      const user: UserAccount = {
        id: fac.id,
        name: fac.name,
        email: fac.email,
        role: 'faculty',
        department: fac.department,
        facultyId: fac.facultyId,
      };

      setCurrentUser(user);
      setRoleState('faculty');
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ROLE, 'faculty');
      }
      broadcastSession();
      return { success: true, user };
    } else {
      const user: UserAccount = {
        id: `ADM-${Date.now().toString().slice(-4)}`,
        name: cleanName,
        email: cleanEmail,
        password: details.password || 'admin@123',
        role: 'admin',
        department: details.department,
      };

      const updatedAdmins = [user, ...adminList];
      setAdminList(updatedAdmins);
      setCurrentUser(user);
      setRoleState('admin');
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updatedAdmins));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
      }
      broadcastSession();
      return { success: true, user };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRoleState('faculty');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.setItem(STORAGE_KEYS.ROLE, 'faculty');
    }
    broadcastSession();
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    setStoredTheme(nextTheme);
  };

  const uploadStudentDocument = (studentId: string, doc: StudentDocument) => {
    const updated = students.map((st) => {
      if (st.id === studentId) {
        return updateStudentWithExtractedMetrics(st, doc);
      }
      return st;
    });
    setStudents(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
    }
  };

  const batchUpdateStudents = (parsedRows: Partial<Student>[]) => {
    if (!parsedRows.length) return;
    const updated = [...students];

    parsedRows.forEach((row, idx) => {
      const targetIdx = updated.findIndex(
        (s) => (row.emis && s.emis === row.emis) || (row.name && s.name.toLowerCase().includes(row.name.toLowerCase()))
      );

      if (targetIdx !== -1) {
        updated[targetIdx] = {
          ...updated[targetIdx],
          attendance: row.attendance !== undefined ? row.attendance : updated[targetIdx].attendance,
          assessmentScore: row.assessmentScore !== undefined ? row.assessmentScore : updated[targetIdx].assessmentScore,
          quizScore: row.quizScore !== undefined ? row.quizScore : updated[targetIdx].quizScore,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
    });

    setStudents(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
    }
  };

  const addIntervention = (newIntervention: Omit<Intervention, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: Intervention = {
      ...newIntervention,
      id: `INT-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [item, ...interventions];
    setInterventions(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(updated));
    }

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Intervention Created',
      message: `Intervention '${newIntervention.recommendedIntervention}' initiated for ${newIntervention.studentName}.`,
      time: 'Just now',
      type: 'info',
      read: false,
      targetPath: '/interventions',
    };
    const updatedNotifs = [notif, ...notifications];
    setNotifications(updatedNotifs);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
    }
  };

  const updateInterventionStatus = (id: string, status: 'Pending' | 'In Progress' | 'Completed') => {
    const updated = interventions.map((item) =>
      item.id === id ? { ...item, status, updatedAt: new Date().toISOString().split('T')[0] } : item
    );
    setInterventions(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(updated));
    }
  };

  const dispatchParentAlert = (alert: Omit<ParentAlertLog, 'id' | 'sentAt' | 'status'>) => {
    const newLog: ParentAlertLog = {
      ...alert,
      id: `ALT-${Date.now().toString().slice(-4)}`,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Sent',
    };
    const updated = [newLog, ...parentAlerts];
    setParentAlerts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PARENT_ALERTS, JSON.stringify(updated));
    }
  };

  const updateWeights = (newWeights: ModelWeights) => {
    setWeights(newWeights);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(newWeights));
    }
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      setStudents(mockStudents);
      setFacultyList(initialFaculty);
      setAdminList(initialAdmins);
      setLoggedStudentId('ENG0001');
      setInterventions(initialInterventions);
      setNotifications(initialNotifications);
      setThemeState('light');
      setWeights(DEFAULT_WEIGHTS);
      setParentAlerts([]);
      setRoleState('faculty');
      setCurrentUser({
        id: 'USR-FAC-1',
        name: 'Dr. S. Ramanathan',
        email: 'ramanathan@edu.in',
        role: 'faculty',
        department: 'AI & DS',
      });
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    role,
    switchRole,
    currentUser,
    loginWithCredentials,
    logout,
    students,
    facultyList,
    adminList,
    addStudent,
    addFaculty,
    registerUser,
    uploadStudentDocument,
    batchUpdateStudents,
    interventions,
    notifications,
    theme,
    toggleTheme,
    weights,
    updateWeights,
    parentAlerts,
    dispatchParentAlert,
    addIntervention,
    updateInterventionStatus,
    loggedStudentId,
    setLoggedStudentId,
    resetAllData,
    isHydrated,
  };
}
