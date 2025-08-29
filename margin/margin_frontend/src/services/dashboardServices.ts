import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

interface DashboardStatistics {
  users: number;
  opened_positions: number;
  liquidated_positions: number;
  opened_orders: number;
}

const fetchDashboardStatistics = async (): Promise<DashboardStatistics> => {
  const response = await api.get("dashboard/statistic").json<DashboardStatistics>();
  return response;
};

export const useDashboardStatistics = () => {
  return useQuery({
    queryKey: ["dashboard", "statistics"],
    queryFn: fetchDashboardStatistics,
  });
};
