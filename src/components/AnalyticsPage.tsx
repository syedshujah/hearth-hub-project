import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Building2, DollarSign, Eye, Calendar, Download } from "lucide-react";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [chartType, setChartType] = useState("revenue");

  const stats = [
    { 
      title: "Total Revenue", 
      value: "$142,530", 
      change: "+12.5%", 
      changeType: "increase",
      icon: DollarSign, 
      color: "text-success",
      description: "vs last month"
    },
    { 
      title: "New Users", 
      value: "2,847", 
      change: "+8.2%", 
      changeType: "increase",
      icon: Users, 
      color: "text-primary",
      description: "vs last month"
    },
    { 
      title: "Properties Listed", 
      value: "1,429", 
      change: "+5.7%", 
      changeType: "increase",
      icon: Building2, 
      color: "text-secondary",
      description: "vs last month"
    },
    { 
      title: "Page Views", 
      value: "89,234", 
      change: "-2.1%", 
      changeType: "decrease",
      icon: Eye, 
      color: "text-warning",
      description: "vs last month"
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000, users: 1200, properties: 340 },
    { month: "Feb", revenue: 52000, users: 1350, properties: 380 },
    { month: "Mar", revenue: 48000, users: 1280, properties: 360 },
    { month: "Apr", revenue: 61000, users: 1450, properties: 420 },
    { month: "May", revenue: 55000, users: 1380, properties: 390 },
    { month: "Jun", revenue: 67000, users: 1520, properties: 450 },
  ];

  const topProperties = [
    { id: 1, title: "Luxury Beach Villa", views: 2340, inquiries: 45, revenue: 12000 },
    { id: 2, title: "Downtown Apartment", views: 1890, inquiries: 38, revenue: 8500 },
    { id: 3, title: "Suburban House", views: 1650, inquiries: 32, revenue: 7200 },
    { id: 4, title: "Modern Condo", views: 1420, inquiries: 28, revenue: 6800 },
    { id: 5, title: "Family Home", views: 1230, inquiries: 25, revenue: 5900 },
  ];

  const userActivity = [
    { activity: "Property Views", count: 15420, percentage: 45 },
    { activity: "Search Queries", count: 8930, percentage: 26 },
    { activity: "Contact Forms", count: 4560, percentage: 13 },
    { activity: "Saved Properties", count: 3210, percentage: 9 },
    { activity: "Profile Updates", count: 2340, percentage: 7 },
  ];

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key]));
  };

  const renderChart = () => {
    const maxRevenue = getMaxValue(revenueData, 'revenue');
    const maxUsers = getMaxValue(revenueData, 'users');
    const maxProperties = getMaxValue(revenueData, 'properties');

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {chartType === "revenue" && "Revenue Trends"}
            {chartType === "users" && "User Growth"}
            {chartType === "properties" && "Property Listings"}
          </h3>
          <div className="flex items-center space-x-2">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="properties">Properties</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="h-64 bg-muted/30 rounded-lg p-4">
          <div className="flex items-end justify-between h-full space-x-2">
            {revenueData.map((data, index) => {
              let value, maxValue, color;
              
              if (chartType === "revenue") {
                value = data.revenue;
                maxValue = maxRevenue;
                color = "bg-primary";
              } else if (chartType === "users") {
                value = data.users;
                maxValue = maxUsers;
                color = "bg-secondary";
              } else {
                value = data.properties;
                maxValue = maxProperties;
                color = "bg-success";
              }
              
              const height = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                    <div 
                      className={`${color} rounded-t-sm w-8 transition-all duration-300 hover:opacity-80`}
                      style={{ height: `${height}%` }}
                      title={`${data.month}: ${value.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
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
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {stat.changeType === "increase" ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={stat.changeType === "increase" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <Card className="property-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Properties */}
        <Card className="property-card">
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{property.views} views</span>
                        <span>{property.inquiries} inquiries</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">${property.revenue.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card className="property-card">
          <CardHeader>
            <CardTitle>User Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userActivity.map((activity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{activity.activity}</span>
                    <span className="text-sm text-muted-foreground">{activity.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${activity.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {activity.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="property-card">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "2 minutes ago", action: "New property listing approved", user: "Jane Smith", type: "success" },
              { time: "15 minutes ago", action: "User registration", user: "John Doe", type: "info" },
              { time: "1 hour ago", action: "Property inquiry submitted", user: "Alice Johnson", type: "info" },
              { time: "2 hours ago", action: "Property listing rejected", user: "Bob Wilson", type: "warning" },
              { time: "3 hours ago", action: "Payment processed", user: "Mike Brown", type: "success" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "success" ? "bg-success" :
                    activity.type === "warning" ? "bg-warning" : "bg-primary"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">by {activity.user}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
