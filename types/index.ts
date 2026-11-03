export type Role = 'faculty' | 'student' | 'admin';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Trend = 'UP' | 'STABLE' | 'DOWN';

export type Department = 'AI & DS' | 'AI & ML' | 'CSE' | 'ECE' | 'MECH' | 'EEE' | 'IT' | 'CIVIL';

export interface SubjectScore {
  code: string;
  name: string;
  score: number;
  attendance: number;
  grade: string;
}

export interface RiskFactor {
  factor: string;
  impact: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
  description: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  title: string;
  category: 'Certificate' | 'Marksheet' | 'Attendance Record' | 'Transcript' | 'Achievement';
  fileType: 'image' | 'csv' | 'text';
  uploadDate: string;
  extractedMetrics: {
    attendance?: number;
    score?: number;
    quizScore?: number;
    assessmentScore?: number;
    certificateBonus?: number;
  };
  status: 'Verified' | 'Pending Review';
  fileName: string;
}

export interface Student {
  id: string;
  name: string;
  department: Department;
  year: number;
  section: string;
  email: string;
  phone: string;
  emis: string;
  aadhar: string;
  password?: string;
  attendance: number; // percentage
  assignmentCompletion: number; // percentage
  previousScore: number; // percentage
  assessmentScore: number; // percentage
  quizScore: number; // percentage
  predictedScore: number; // calculated
  riskLevel: RiskLevel; // calculated
  trend: Trend;
  subjects: SubjectScore[];
  riskFactors: RiskFactor[];
  documents?: StudentDocument[];
  guardianPhone?: string;
  mentorName?: string;
  lastUpdated?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  department?: Department;
  studentId?: string;
  facultyId?: string;
}

export interface FacultyMember {
  id: string;
  facultyId: string;
  name: string;
  email: string;
  password?: string;
  department: Department;
  role: string;
  phone?: string;
  studentsAssigned?: number;
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  department: Department;
  riskLevel: RiskLevel;
  primaryProblem: string;
  recommendedIntervention: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  assignedFaculty: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  targetPath?: string;
}

export interface ParentAlertLog {
  id: string;
  studentId: string;
  studentName: string;
  parentContact: string; // phone or email
  type: 'Email' | 'SMS';
  message: string;
  sentAt: string;
  status: 'Sent' | 'Delivered' | 'Failed';
}

export interface ModelWeights {
  previousScoreWeight: number; // default 0.40
  attendanceWeight: number; // default 0.20
  assignmentWeight: number; // default 0.15
  assessmentWeight: number; // default 0.15
  quizWeight: number; // default 0.10
  highRiskThreshold: number; // default 55
  mediumRiskThreshold: number; // default 75
}

export interface RemedialPlan {
  id: string;
  studentId: string;
  studentName: string;
  targetSubject: string;
  weakTopics: string[];
  dailySchedule: { time: string; activity: string }[];
  practiceQuizRecommended: string;
  assignedPeerMentor: string;
}
