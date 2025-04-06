
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  
  const handleTestToast = () => {
    toast({
      title: "Toast Test",
      description: "This is a test notification!",
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">PDF Generator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Applications</h2>
          <p className="text-gray-600 mb-4">Welcome to your PDF Generator app. Click the button below to test toast notifications.</p>
          
          <Button onClick={handleTestToast}>Test Toast Notification</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
