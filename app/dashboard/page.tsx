"use client";

import { Users, AlertTriangle, Database } from "lucide-react";
import { toast } from "sonner";
import { useUserApi } from "@/api/auth";
import { useShareApi } from "@/api/share";
import { useEffect, useState } from "react";
import { UserDashboard } from "@/types/user";
import Loading from "@/components/ui/loading";
import { MetricCard } from "@/components/dashboard/metric-card";
import { FailedApplicationsTable } from "@/components/dashboard/failed-application-table";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const { getDashboard } = useUserApi();
  const { markAllRead } = useShareApi();

  useEffect(() => {
    setIsMounted(true);

    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        if (response.status === "success") {
          setDashboardData(response.dashboard);
        } else {
          toast.error("Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [getDashboard]);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success("All marked as read successfully");
      setDashboardData((prev) =>
        prev ? { ...prev, failed_applications: [] } : prev
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as read");
    }
  };

  if (!isMounted) return null;
  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Hi, {dashboardData?.user?.first_name} {dashboardData?.user?.last_name}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8 p-4 border rounded-md shadow">
        <MetricCard
          title="Total Accounts"
          description="All accounts linked"
          value={dashboardData!.total_accounts}
          label="Accounts"
          color="var(--chart-3)"
          footerContent={
            <div className="flex items-center gap-2 leading-none font-medium">
              <Users className="h-4 w-4" />{" "}
              {dashboardData?.accounts_with_issue} with issues
            </div>
          }
        />

        <MetricCard
          title="Shares Applied"
          description="Total applied shares"
          value={dashboardData!.total_shares}
          label="Shares"
          color="var(--chart-2)"
          footerContent={
            <div className="flex items-center gap-2 leading-none font-medium">
              <Database className="h-4 w-4" /> Applied successfully
            </div>
          }
        />

        <MetricCard
          title="Failed Shares"
          description="Applications with errors"
          value={dashboardData!.failed_shares}
          label="Failed"
          color="var(--chart-1)"
          footerContent={
            <div className="flex items-center gap-2 leading-none font-medium text-red-500">
              <AlertTriangle className="h-4 w-4" /> Needs review
            </div>
          }
        />
      </div>

      <FailedApplicationsTable
        failedApplications={dashboardData!.failed_applications}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
}
