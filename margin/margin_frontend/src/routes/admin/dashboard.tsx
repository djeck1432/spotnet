import { createFileRoute } from '@tanstack/react-router';
import AdminDashboard from '../../ui/admin/dashboard/dashboardMain';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
});
