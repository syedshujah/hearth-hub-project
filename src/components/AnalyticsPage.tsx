import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Building2, DollarSign } from "lucide-react";

const AnalyticsPage = () => {
  const stats = [
    { title: "Total Revenue", value: "$142,530", change: "+12.5%", icon: DollarSign, color: "text-success" },
    { title: "New Users", value: "2,847", change: "+8.2%", icon: Users, color: "text-primary" },
    { title: "Properties Listed", value: "1,429", change: "+5.7%", icon: Building2, color: "text-secondary" },
    { title: "Growth Rate", value: "23.1%", change: "+2.1%", icon: TrendingUp, color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="property-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.color}>{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="property-card">
        <CardHeader>
          <CardTitle>Analytics Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Analytics charts will be integrated here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;