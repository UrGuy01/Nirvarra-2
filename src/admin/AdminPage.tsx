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
import { Trash2 } from "lucide-react";
import { DateRange } from "react-day-picker";

const STAY_TYPES = [
  "Luxury Tent",
  "Eco Cottage",
  "Farmhouse Room",
  "Camping Spot",
];

export default function AdminPage() {
  const { isSignedIn, user } = useUser();
  const [filterType, setFilterType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const allBookings = useQuery(api.bookings.getAllBookings);
  const deleteBooking = useMutation(api.bookings.deleteBooking);

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
    if (dateRange?.from && dateRange?.to && filteredBookingsByDate) {
      return filteredBookingsByDate;
    }
    if (filterType !== "all" && filteredBookingsByStayType) {
      return filteredBookingsByStayType;
    }
    return allBookings || [];
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await deleteBooking({ id: bookingId as any });
    }
  };

  const clearFilters = () => {
    setFilterType("all");
    setDateRange(undefined);
  };

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

  const displayedBookings = getDisplayedBookings();

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

        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Stay Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
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
              <label className="text-sm font-medium">Check-in Date Range</label>
              <DatePickerWithRange
                className="w-auto"
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
                  <TableHead>Guests</TableHead>
                  <TableHead>Stay Type</TableHead>
                  <TableHead>Activities</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Special Requests</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">
                      {booking.name}
                    </TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.phone}</TableCell>
                    <TableCell>{booking.check_in_date}</TableCell>
                    <TableCell>{booking.check_out_date}</TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell>{booking.stay_type}</TableCell>
                    <TableCell>
                      <div
                        className="max-w-32 truncate"
                        title={booking.activities_selected.join(", ")}
                      >
                        {booking.activities_selected.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.is_pet_bringer ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-32 truncate"
                        title={booking.special_requests || "None"}
                      >
                        {booking.special_requests || "None"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(booking.created_at),
                        "MMM dd, yyyy HH:mm",
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
    </div>
  );
}
