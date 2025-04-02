
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import type { MonthlyData } from "@/utils/visitorTrackingService";

interface VisitorMonthlyChartProps {
  monthlyData: MonthlyData[];
}

export function VisitorMonthlyChart({ monthlyData }: VisitorMonthlyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitas Mensuales</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          className="h-full"
          config={{
            visits: {
              label: "Visitas",
              color: "hsl(var(--primary))"
            }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground">
                              Mes
                            </span>
                            <span className="font-bold text-foreground">
                              {payload[0].payload.month}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground">
                              Visitas
                            </span>
                            <span className="font-bold text-foreground">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="visits" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
