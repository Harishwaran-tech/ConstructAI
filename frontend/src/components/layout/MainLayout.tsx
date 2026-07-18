import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { NotificationDrawer } from './NotificationDrawer';
import type { NotificationItem } from './NotificationDrawer';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'price',
    title: 'Steel Price Spike Alert',
    message: 'TMT 500D steel prices increased by +2.4% across regional suppliers.',
    timestamp: '10m ago',
    read: false,
  },
  {
    id: '2',
    type: 'completed',
    title: 'Project Milestone Achieved',
    message: 'Oakridge Villa Foundation & Slab concrete work marked completed.',
    timestamp: '1h ago',
    read: false,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Budget Threshold Reached',
    message: 'Skyline Plaza project reached 84% of total planned allocation.',
    timestamp: '3h ago',
    read: false,
  },
  {
    id: '4',
    type: 'pdf',
    title: 'BOQ PDF Generated',
    message: 'Bill of Quantities takeoff report for Metro Station Project generated.',
    timestamp: '1d ago',
    read: true,
  },
];

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleOpenNewProject = () => {
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex font-sans">
      {/* Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar
          setMobileOpen={setMobileOpen}
          toggleNotifications={() => setNotifDrawerOpen(true)}
          unreadCount={unreadCount}
          onOpenNewProject={handleOpenNewProject}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Notification Slide-Over */}
      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
};
