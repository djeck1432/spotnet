import { createFileRoute } from '@tanstack/react-router';
import AdminDashboard from '../../ui/admin/dashboard/dashboardMain.js';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
});
