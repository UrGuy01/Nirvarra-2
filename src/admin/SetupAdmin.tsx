import { useState } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function SetupAdmin() {
  const { isSignedIn, user } = useUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setupFirstAdmin = useMutation(api.setup.setupFirstAdmin);

  const handleSetup = async () => {
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await setupFirstAdmin({ email, name });
      toast({
        title: "Admin Setup Complete",
        description: "First admin user has been created successfully. You can now access the admin panel.",
      });
      setEmail("");
      setName("");
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup admin user.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
          <p className="mb-6 text-gray-600">
            Please sign in to setup the first admin user.
          </p>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Setup First Admin User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Admin Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter admin name"
              />
            </div>
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
              />
            </div>
            <Button 
              onClick={handleSetup} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Setting up..." : "Setup Admin"}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              This will create the first super admin user. Only run this once.
            </p>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
} 