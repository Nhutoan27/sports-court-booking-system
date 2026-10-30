import { LayoutGrid, Calendar, Volleyball, Users2, Settings, BookOpen } from 'lucide-react';

export const STAFF_NAV = [
  { label: 'Đặt sân trong ngày', icon: LayoutGrid, to: '/staff', end: true },
  { label: 'Trạng thái sân', icon: Volleyball, to: '/staff/court-status' },
];

export const ADMIN_NAV = [
  { label: 'Tổng quan', icon: LayoutGrid, to: '/admin', end: true },
  { label: 'Quản lý booking', icon: Calendar, to: '/admin/bookings' },
  { label: 'Sân & giá', icon: Volleyball, to: '/admin/courts' },
  { label: 'Tài khoản', icon: Users2, to: '/admin/accounts' },
  { label: 'Kho tri thức', icon: BookOpen, to: '/admin/knowledge-base' },
  { label: 'Cấu hình hệ thống', icon: Settings, to: '/admin/system-config' },
];

