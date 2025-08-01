import { useState } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import { format } from "date-fns";
import { Trash2, Eye, CheckCircle, XCircle, DollarSign, MessageSquare, Phone, Calendar, AlertTriangle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STAY_TYPES = [
  "Luxury Tent",
  "Eco Cottage",
  "Farmhouse Room",
  "Camping Spot",
];

export default function AdminPage() {
  const { isSignedIn, user } = useUser();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  // Check admin access
  const adminAccess = useQuery(
    api.admin.checkAdminAccess,
    user?.emailAddresses?.[0]?.emailAddress ? { email: user.emailAddresses[0].emailAddress } : "skip"
  );

  const allBookings = useQuery(api.bookings.getAllBookings);
  const dateConflicts = useQuery(api.bookings.getAllDateConflicts);
  const deleteBooking = useMutation(api.bookings.deleteBooking);
  const updatePaymentStatus = useMutation(api.bookings.updatePaymentStatus);
  const updateBookingStatus = useMutation(api.bookings.updateBookingStatus);
  const updateAdminNotes = useMutation(api.bookings.updateAdminNotes);

  const filteredBookingsByStayType = useQuery(
    api.bookings.getBookingsByStayType,
    filterType !== "all" ? { stayType: filterType } : "skip",
  );

  const filteredBookingsByDate = useQuery(
    api.bookings.getBookingsByDateRange,
    dateRange?.from && dateRange?.to
      ? {
          startDate: format(dateRange.from, "yyyy-MM-dd"),
          endDate: format(dateRange.to, "yyyy-MM-dd"),
        }
      : "skip",
  );

  const getDisplayedBookings = () => {
    let bookings = allBookings || [];
    
    // Apply date filter
    if (dateRange?.from && dateRange?.to && filteredBookingsByDate) {
      bookings = filteredBookingsByDate;
    }
    
    // Apply stay type filter
    if (filterType !== "all" && filteredBookingsByStayType) {
      bookings = filteredBookingsByStayType;
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      bookings = bookings.filter(booking => booking.booking_status === filterStatus);
    }
    
    // Apply payment filter
    if (filterPayment !== "all") {
      bookings = bookings.filter(booking => booking.payment_status === filterPayment);
    }
    
    return bookings;
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await deleteBooking({ id: bookingId as any });
    }
  };

  const handleUpdatePaymentStatus = async (bookingId: string, status: "pending" | "paid" | "cancelled") => {
    try {
      await updatePaymentStatus({ 
        bookingId: bookingId as any, 
        paymentStatus: status,
        paymentMethod: status === "paid" ? "Admin Update" : undefined
      });
      
      toast({
        title: "Payment Status Updated",
        description: `Payment status has been updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: "confirmed" | "pending" | "cancelled") => {
    try {
      await updateBookingStatus({
        bookingId: bookingId as any,
        bookingStatus: status,
        adminNotes: adminNotes,
        followUpDate: followUpDate ? new Date(followUpDate).getTime() : undefined,
      });
      
      toast({
        title: "Booking Status Updated",
        description: `Booking status has been updated to ${status}.`,
      });
      
      setSelectedBooking(null);
      setAdminNotes("");
      setFollowUpDate("");
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNotes = async (bookingId: string) => {
    try {
      await updateAdminNotes({
        bookingId: bookingId as any,
        adminNotes: adminNotes,
        whatsappNumber: whatsappNumber,
      });
      
      toast({
        title: "Notes Updated",
        description: "Admin notes have been updated successfully.",
      });
      
      setSelectedBooking(null);
      setAdminNotes("");
      setWhatsappNumber("");
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openWhatsAppChat = (phoneNumber: string, customerName: string) => {
    const message = `Hi ${customerName}, I'm from Nirvarra Farmstay. I noticed your booking request and would like to discuss the details. Could you please share your preferred dates and any specific requirements?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openPhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_blank');
  };

  const hasDateConflict = (bookingId: string) => {
    if (!dateConflicts) return false;
    return dateConflicts.some(conflict => 
      conflict.booking1.id === bookingId || conflict.booking2.id === bookingId
    );
  };

  const getConflictingBookings = (bookingId: string) => {
    if (!dateConflicts) return [];
    return dateConflicts.filter(conflict => 
      conflict.booking1.id === bookingId || conflict.booking2.id === bookingId
    );
  };

  const clearFilters = () => {
    setFilterType("all");
    setFilterStatus("all");
    setFilterPayment("all");
    setDateRange(undefined);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Show loading while checking admin access
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="mb-6 text-gray-600">
            Please sign in to access the admin panel.
          </p>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // Check if user has admin access
  if (adminAccess === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Checking Access...</h1>
          <p className="text-gray-600">Verifying admin permissions...</p>
        </div>
      </div>
    );
  }

  if (!adminAccess.isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6 text-gray-600">
            You don't have admin access to this panel. Please contact the administrator.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <span className="text-sm text-gray-500">
              Logged in as: {user?.emailAddresses?.[0]?.emailAddress}
            </span>
            <UserButton />
          </div>
        </div>
      </div>
    );
  }

  const displayedBookings = getDisplayedBookings();
  const totalBookings = allBookings?.length || 0;
  const totalRevenue = allBookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
  const pendingPayments = allBookings?.filter(booking => booking.payment_status === "pending").length || 0;
  const confirmedBookings = allBookings?.filter(booking => booking.booking_status === "confirmed").length || 0;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Nirvarra Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.firstName}
            </span>
            <UserButton />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date Conflicts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dateConflicts?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Date Conflicts Alert */}
        {dateConflicts && dateConflicts.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Date Conflicts Detected ({dateConflicts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dateConflicts.map((conflict, index) => (
                  <div key={index} className="p-3 border border-orange-200 rounded-lg bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-orange-800">Conflict #{index + 1}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <div className="text-sm font-medium">{conflict.booking1.name}</div>
                            <div className="text-xs text-gray-600">{conflict.booking1.email}</div>
                            <div className="text-xs text-gray-600">{conflict.booking1.stayType}</div>
                            <div className="text-xs text-gray-600">
                              {conflict.booking1.checkIn} - {conflict.booking1.checkOut}
                            </div>
                            <Badge className="mt-1" variant={conflict.booking1.status === "confirmed" ? "default" : "secondary"}>
                              {conflict.booking1.status}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{conflict.booking2.name}</div>
                            <div className="text-xs text-gray-600">{conflict.booking2.email}</div>
                            <div className="text-xs text-gray-600">{conflict.booking2.stayType}</div>
                            <div className="text-xs text-gray-600">
                              {conflict.booking2.checkIn} - {conflict.booking2.checkOut}
                            </div>
                            <Badge className="mt-1" variant={conflict.booking2.status === "confirmed" ? "default" : "secondary"}>
                              {conflict.booking2.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-orange-600">
                          {Math.ceil(conflict.overlapDays / (1000 * 60 * 60 * 24))} days overlap
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Stay Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by stay type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stay Types</SelectItem>
                  {STAY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Booking Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Payment Status</label>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Check-in Date Range</label>
              <DatePickerWithRange
                className="w-full"
                date={dateRange}
                setDate={setDateRange}
              />
            </div>

            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="bg-white border rounded-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Bookings ({displayedBookings.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Nights</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Stay Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                                     <TableHead>Payment</TableHead>
                   <TableHead>Activities</TableHead>
                   <TableHead>Pet</TableHead>
                   <TableHead>Notes</TableHead>
                   <TableHead>Created</TableHead>
                   <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedBookings.map((booking) => (
                  <TableRow 
                    key={booking._id}
                    className={hasDateConflict(booking._id) ? "bg-orange-50 border-orange-200" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {booking.name}
                        {hasDateConflict(booking._id) && (
                          <AlertTriangle className="h-4 w-4 text-orange-600" title="Date conflict detected" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.phone}</TableCell>
                    <TableCell>{booking.check_in_date}</TableCell>
                    <TableCell>{booking.check_out_date}</TableCell>
                    <TableCell>{booking.total_nights || 0}</TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell>{booking.stay_type}</TableCell>
                    <TableCell className="font-medium">
                      ₹{(booking.total_amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.booking_status || "pending")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getPaymentBadge(booking.payment_status || "pending")}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleUpdatePaymentStatus(booking._id, "paid")}
                            disabled={booking.payment_status === "paid"}
                          >
                            Mark Paid
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleUpdatePaymentStatus(booking._id, "cancelled")}
                            disabled={booking.payment_status === "cancelled"}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-32 truncate"
                        title={booking.activities_selected?.join(", ") || "None"}
                      >
                        {booking.activities_selected?.join(", ") || "None"}
                      </div>
                    </TableCell>
                                         <TableCell>
                       {booking.is_pet_bringer ? "Yes" : "No"}
                     </TableCell>
                     <TableCell>
                       <div className="max-w-32 truncate" title={booking.admin_notes || "No notes"}>
                         {booking.admin_notes || "No notes"}
                       </div>
                     </TableCell>
                     <TableCell>
                       {format(
                         new Date(booking.created_at),
                         "MMM dd, yyyy HH:mm",
                       )}
                     </TableCell>
                     <TableCell>
                       <div className="flex gap-1 flex-wrap">
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => openWhatsAppChat(booking.phone, booking.name)}
                           title="Open WhatsApp Chat"
                         >
                           <MessageSquare className="h-3 w-3" />
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => openPhoneCall(booking.phone)}
                           title="Call Customer"
                         >
                           <Phone className="h-3 w-3" />
                         </Button>
                         <Dialog>
                           <DialogTrigger asChild>
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={() => {
                                 setSelectedBooking(booking);
                                 setAdminNotes(booking.admin_notes || "");
                                 setWhatsappNumber(booking.whatsapp_number || "");
                                 setFollowUpDate(booking.follow_up_date ? format(new Date(booking.follow_up_date), "yyyy-MM-dd") : "");
                               }}
                               title="Manage Booking"
                             >
                               <Calendar className="h-3 w-3" />
                             </Button>
                           </DialogTrigger>
                           <DialogContent className="sm:max-w-[600px]">
                             <DialogHeader>
                               <DialogTitle>Manage Booking - {booking.name}</DialogTitle>
                               <DialogDescription>
                                 Update booking status, add notes, and manage follow-ups.
                               </DialogDescription>
                             </DialogHeader>
                             <div className="grid gap-4 py-4">
                               <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <Label htmlFor="status">Booking Status</Label>
                                   <Select 
                                     value={booking.booking_status || "pending"} 
                                     onValueChange={(value) => handleUpdateBookingStatus(booking._id, value as any)}
                                   >
                                     <SelectTrigger>
                                       <SelectValue />
                                     </SelectTrigger>
                                     <SelectContent>
                                       <SelectItem value="pending">Pending</SelectItem>
                                       <SelectItem value="confirmed">Confirmed</SelectItem>
                                       <SelectItem value="cancelled">Cancelled</SelectItem>
                                     </SelectContent>
                                   </Select>
                                 </div>
                                 <div>
                                   <Label htmlFor="followUp">Follow-up Date</Label>
                                   <Input
                                     type="date"
                                     value={followUpDate}
                                     onChange={(e) => setFollowUpDate(e.target.value)}
                                   />
                                 </div>
                               </div>
                               <div>
                                 <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                 <Input
                                   value={whatsappNumber}
                                   onChange={(e) => setWhatsappNumber(e.target.value)}
                                   placeholder="+91 98765 43210"
                                 />
                               </div>
                               <div>
                                 <Label htmlFor="notes">Admin Notes</Label>
                                 <Textarea
                                   value={adminNotes}
                                   onChange={(e) => setAdminNotes(e.target.value)}
                                   placeholder="Add notes about customer communication, requirements, etc."
                                   rows={4}
                                 />
                               </div>
                             </div>
                             <DialogFooter>
                               <Button onClick={() => handleUpdateNotes(booking._id)}>
                                 Update Notes
                               </Button>
                             </DialogFooter>
                           </DialogContent>
                         </Dialog>
                         <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => handleDeleteBooking(booking._id)}
                           title="Delete Booking"
                         >
                           <Trash2 className="h-3 w-3" />
                         </Button>
                       </div>
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {displayedBookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bookings found.
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
