import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "./ui/use-toast";

const STAY_TYPES = [
  { value: "Luxury Tent", price: 2500 },
  { value: "Eco Cottage", price: 3500 },
  { value: "Farmhouse Room", price: 2000 },
  { value: "Camping Spot", price: 800 },
];

const ACTIVITIES = [
  "Farm Tour",
  "Cooking Class",
  "Yoga Session",
  "Hiking",
  "Bird Watching",
  "Fishing",
  "Bonfire",
  "Stargazing",
];

export default function BookingForm() {
  const { user, isSignedIn } = useUser();
  const createBooking = useMutation(api.bookings.createBooking);
  
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    check_in_date: "",
    check_out_date: "",
    guests: 1,
    stay_type: "",
    activities_selected: [] as string[],
    is_pet_bringer: false,
    special_requests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalNights = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalAmount = () => {
    const selectedStayType = STAY_TYPES.find(type => type.value === formData.stay_type);
    if (!selectedStayType) return 0;
    const nights = calculateTotalNights();
    const basePrice = selectedStayType.price * nights;
    const activityPrice = formData.activities_selected.length * 500; // 500 per activity
    return basePrice + activityPrice;
  };

  const handleActivityToggle = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities_selected: prev.activities_selected.includes(activity)
        ? prev.activities_selected.filter(a => a !== activity)
        : [...prev.activities_selected, activity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a booking.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.stay_type) {
      toast({
        title: "Stay Type Required",
        description: "Please select a stay type.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createBooking({
        ...formData,
        clerk_user_id: user?.id,
        total_amount: calculateTotalAmount(),
      });

      toast({
        title: "Booking Created!",
        description: "Your booking has been successfully created. We'll contact you soon.",
      });

      // Reset form
      setFormData({
        name: user?.fullName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        phone: "",
        check_in_date: "",
        check_out_date: "",
        guests: 1,
        stay_type: "",
        activities_selected: [],
        is_pet_bringer: false,
        special_requests: "",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Book Your Stay</CardTitle>
          <CardDescription>
            Please sign in to make a booking at Nirvarra Farmstay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" disabled>
            Sign In to Book
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book Your Stay at Nirvarra</CardTitle>
        <CardDescription>
          Welcome back, {user?.firstName}! Fill in the details below to book your farmstay experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="check_in">Check-in Date</Label>
              <Input
                id="check_in"
                type="date"
                value={formData.check_in_date}
                onChange={(e) => setFormData(prev => ({ ...prev, check_in_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="check_out">Check-out Date</Label>
              <Input
                id="check_out"
                type="date"
                value={formData.check_out_date}
                onChange={(e) => setFormData(prev => ({ ...prev, check_out_date: e.target.value }))}
                min={formData.check_in_date || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Stay Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                value={formData.guests}
                onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="stay_type">Stay Type</Label>
              <Select value={formData.stay_type} onValueChange={(value) => setFormData(prev => ({ ...prev, stay_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stay type" />
                </SelectTrigger>
                <SelectContent>
                  {STAY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.value} - ₹{type.price}/night
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Activities */}
          <div>
            <Label>Activities (₹500 each)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {ACTIVITIES.map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity}
                    checked={formData.activities_selected.includes(activity)}
                    onCheckedChange={() => handleActivityToggle(activity)}
                  />
                  <Label htmlFor={activity} className="text-sm">{activity}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Pet Policy */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pet"
              checked={formData.is_pet_bringer}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_pet_bringer: checked as boolean }))}
            />
            <Label htmlFor="pet">I will be bringing a pet</Label>
          </div>

          {/* Special Requests */}
          <div>
            <Label htmlFor="special_requests">Special Requests</Label>
            <Textarea
              id="special_requests"
              value={formData.special_requests}
              onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
              placeholder="Any special requirements or requests..."
            />
          </div>

          {/* Price Summary */}
          {formData.stay_type && (
            <Card className="bg-stone-50">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Price Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Stay Type:</span>
                    <span>{formData.stay_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>{calculateTotalNights()} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities:</span>
                    <span>{formData.activities_selected.length} selected</span>
                  </div>
                  <div className="border-t pt-1 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{calculateTotalAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Booking..." : "Create Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 