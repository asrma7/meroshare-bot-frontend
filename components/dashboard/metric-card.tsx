"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
    RadialBarChart,
    PolarGrid,
    RadialBar,
    PolarRadiusAxis,
    Label,
} from "recharts";
import { ReactNode } from "react";

interface MetricCardProps {
    title: string;
    description: string;
    value: number;
    label: string;
    color: string;
    footerContent?: ReactNode;
}

const chartConfig = {
    value: { label: "Value" },
} satisfies ChartConfig;

export function MetricCard({
    title,
    description,
    value,
    label,
    color,
    footerContent,
}: MetricCardProps) {
    const chartData = [{ label, value, fill: color }];

    return (
        <Card className="flex flex-col flex-1">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[220px] sm:max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
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
                                                    {value}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {label}
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
            {footerContent && (
                <CardFooter className="flex-col gap-2 text-sm">{footerContent}</CardFooter>
            )}
        </Card>
    );
}
