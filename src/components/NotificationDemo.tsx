import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/notificationSlice";
import { Bell, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

const NotificationDemo = () => {
  const dispatch = useAppDispatch();

  const createTestNotification = (type: 'success' | 'info' | 'warning' | 'error') => {
    const notifications = {
      success: {
        title: "Success Notification",
        message: "This is a test success notification to demonstrate the system.",
        icon: CheckCircle
      },
      info: {
        title: "Info Notification", 
        message: "This is a test info notification with some useful information.",
        icon: Info
      },
      warning: {
        title: "Warning Notification",
        message: "This is a test warning notification to alert you about something.",
        icon: AlertCircle
      },
      error: {
        title: "Error Notification",
        message: "This is a test error notification showing something went wrong.",
        icon: XCircle
      }
    };

    const notification = notifications[type];
    
    dispatch(addNotification({
      title: notification.title,
      message: notification.message,
      type,
      actionType: 'system'
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notification System Demo</span>
        </CardTitle>
        <CardDescription>
          Test the notification system with different types of notifications. 
          Check the bell icon in the dashboard header to see them!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => createTestNotification('success')} 
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Create Success Notification
        </Button>
        
        <Button 
          onClick={() => createTestNotification('info')} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Info className="w-4 h-4 mr-2" />
          Create Info Notification
        </Button>
        
        <Button 
          onClick={() => createTestNotification('warning')} 
          className="w-full bg-yellow-600 hover:bg-yellow-700"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Create Warning Notification
        </Button>
        
        <Button 
          onClick={() => createTestNotification('error')} 
          className="w-full bg-red-600 hover:bg-red-700"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Create Error Notification
        </Button>

        <div className="text-xs text-muted-foreground text-center mt-4 p-2 bg-muted rounded">
          💡 All notifications persist after page refresh thanks to Redux + localStorage!
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationDemo;
