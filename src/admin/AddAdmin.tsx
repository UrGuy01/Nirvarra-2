import { useState } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function AddAdmin() {
  const { isSignedIn, user } = useUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addAdminUser = useMutation(api.admin.addAdminUser);
  const adminUsers = useQuery(api.admin.listAdminUsers);

  const handleAddAdmin = async () => {
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
      await addAdminUser({ email, name, role: "admin" });
      toast({
        title: "Admin Added",
        description: "Admin user has been added successfully.",
      });
      setEmail("");
      setName("");
    } catch (error: any) {
      toast({
        title: "Failed to Add Admin",
        description: error.message || "Failed to add admin user.",
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
          <h1 className="text-2xl font-bold mb-4">Admin Management</h1>
          <p className="mb-6 text-gray-600">
            Please sign in to manage admin users.
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Admin Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
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
                onClick={handleAddAdmin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Adding..." : "Add Admin"}
              </Button>
            </CardContent>
          </Card>

          {/* Current Admin Users */}
          <Card>
            <CardHeader>
              <CardTitle>Current Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              {adminUsers ? (
                <div className="space-y-2">
                  {adminUsers.map((admin) => (
                    <div key={admin._id} className="p-3 border rounded">
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-gray-600">{admin.email}</div>
                      <div className="text-xs text-gray-500">Role: {admin.role}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Loading admin users...</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Current user: {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
} 