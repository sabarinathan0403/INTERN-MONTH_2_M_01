import { NotificationItem } from '@/types';

export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'Critical Risk Alert',
    message: '13 students currently show HIGH academic risk. Attendance and Mathematics scores are primary contributors.',
    time: '10 mins ago',
    type: 'critical',
    read: false,
    targetPath: '/interventions',
  },
  {
    id: 'NOTIF-2',
    title: 'Mathematics Decline Detected',
    message: 'Mathematics performance has declined across 14 students in AI & DS and CSE departments.',
    time: '1 hour ago',
    type: 'warning',
    read: false,
    targetPath: '/students?risk=HIGH',
  },
  {
    id: 'NOTIF-3',
    title: 'Intervention Status Updated',
    message: 'Intervention for ABRA RAHMED N marked as COMPLETED by Prof. S. Geetha.',
    time: '3 hours ago',
    type: 'success',
    read: true,
    targetPath: '/interventions',
  },
  {
    id: 'NOTIF-4',
    title: 'Parent Alert Dispatched',
    message: 'Automated attendance email dispatch sent to parent of ENG0002.',
    time: 'Yesterday',
    type: 'info',
    read: true,
    targetPath: '/student/ENG0002',
  },
];
