"use client";

import React, { useState, useEffect } from "react";
import { useUserApi } from "@/api/auth";
import { UserDashboard } from "@/types/user";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, Users, AlertTriangle, Database } from "lucide-react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { RadialBarChart, PolarRadiusAxis, PolarGrid, RadialBar, Label } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useShareApi } from "@/api/share";

interface DashboardResponse {
  dashboard: UserDashboard;
  status: string;
}

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
        const response: DashboardResponse = await getDashboard();
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

  if (!isMounted) return null;
  if (loading) return <Loading />;

  const chartConfig = {
    value: { label: "Value" },
  } satisfies ChartConfig;

  const buildChartData = (label: string, value: number, color: string) => [
    { label, value, fill: color },
  ];

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success("All marked as read successfully");

      // update local state
      setDashboardData((prev) =>
        prev ? { ...prev, failed_applications: [] } : prev
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as read");
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Hi, {dashboardData?.user?.first_name} {dashboardData?.user?.last_name}
      </p>

      {/* Metrics Row */}
      <div className="flex justify-between text-center items-center mb-8 p-4 border rounded-md shadow my-8 gap-6">
        {/* Total Accounts */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="items-center pb-0">
            <CardTitle>Total Accounts</CardTitle>
            <CardDescription>All accounts linked</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={buildChartData("Accounts", dashboardData!.total_accounts, "var(--chart-3)")}
                startAngle={0}
                endAngle={250}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="value" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {dashboardData?.total_accounts}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Accounts
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              <Users className="h-4 w-4" /> {dashboardData?.accounts_with_issue} with issues
            </div>
          </CardFooter>
        </Card>

        {/* Shares Applied */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="items-center pb-0">
            <CardTitle>Shares Applied</CardTitle>
            <CardDescription>Total applied shares</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={buildChartData("Shares", dashboardData!.total_shares, "var(--chart-2)")}
                startAngle={0}
                endAngle={250}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="value" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {dashboardData?.total_shares}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Shares
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              <Database className="h-4 w-4" /> Applied successfully
            </div>
          </CardFooter>
        </Card>

        {/* Failed Shares */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="items-center pb-0">
            <CardTitle>Failed Shares</CardTitle>
            <CardDescription>Applications with errors</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadialBarChart
                data={buildChartData("Failed", dashboardData!.failed_shares, "var(--chart-1)")}
                startAngle={0}
                endAngle={250}
                innerRadius={80}
                outerRadius={110}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar dataKey="value" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {dashboardData?.failed_shares}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Failed
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium text-red-500">
              <AlertTriangle className="h-4 w-4" /> Needs review
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Failed Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Failed Applications</CardTitle>
          <CardDescription>Unseen or recent errors</CardDescription>
          <CardAction>
            <Button
              variant="outline"
              onClick={() => handleMarkAllRead()}
            >
              Mark All Read
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Share</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData?.failed_applications?.length ? (
                dashboardData.failed_applications.map((app) => (
                  <TableRow key={app.share_id}>
                    <TableCell>
                      <Link href={`/dashboard/accounts/${app.account_id}`}>
                        {app.account_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/shares/${app.share_id}`}>
                        {app.scrip}
                      </Link>
                    </TableCell>
                    <TableCell className="text-red-600">
                      {app.error_message}
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No failed applications 🎉
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
