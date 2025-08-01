import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wifi,
  Coffee,
  Utensils,
  Bath,
  Fan,
  Tv,
  Mountain,
  Users,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Accommodation {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  capacity: number;
  amenities: string[];
  details: string;
}

interface AccommodationSectionProps {
  accommodations?: Accommodation[];
}

const defaultAccommodations: Accommodation[] = [
  {
    id: "1",
    title: "Luxury Cottage",
    description: "Spacious cottage with panoramic views of the hills",
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    ],
    price: 5000,
    capacity: 4,
    amenities: ["wifi", "breakfast", "attached-bathroom", "fan", "tv"],
    details:
      "Our luxury cottage offers a perfect blend of comfort and nature. Featuring a spacious bedroom with a king-sized bed, a cozy living area, and a private balcony overlooking the hills. The cottage is equipped with modern amenities while maintaining a rustic charm. Wake up to the sounds of birds and enjoy your morning coffee with breathtaking views.",
  },
  {
    id: "2",
    title: "Riverside Tent",
    description: "Glamping experience next to the flowing river",
    images: [
      "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800&q=80",
      "https://images.unsplash.com/photo-1520824071669-892f70d8a23d?w=800&q=80",
    ],
    price: 3000,
    capacity: 2,
    amenities: ["breakfast", "shared-bathroom", "mountain-view"],
    details:
      "Experience luxury camping in our riverside tents. These waterproof canvas tents are set on wooden platforms and furnished with comfortable beds, rugs, and solar-powered lights. Fall asleep to the gentle sounds of the river and wake up surrounded by nature. Shared bathroom facilities are just a short walk away.",
  },
  {
    id: "3",
    title: "Family Villa",
    description: "Two-bedroom villa perfect for families or groups",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80",
    ],
    price: 8000,
    capacity: 6,
    amenities: [
      "wifi",
      "breakfast",
      "attached-bathroom",
      "fan",
      "tv",
      "kitchen",
    ],
    details:
      "Our spacious family villa is ideal for larger groups or families. With two bedrooms, a fully equipped kitchen, dining area, and a large veranda, you'll have all the space you need. The villa offers privacy while still being close to all farmstay activities. Enjoy meals together on the veranda while taking in views of the surrounding landscape.",
  },
];

const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case "wifi":
      return <Wifi className="h-4 w-4 mr-1" />;
    case "breakfast":
      return <Coffee className="h-4 w-4 mr-1" />;
    case "kitchen":
      return <Utensils className="h-4 w-4 mr-1" />;
    case "attached-bathroom":
    case "shared-bathroom":
      return <Bath className="h-4 w-4 mr-1" />;
    case "fan":
      return <Fan className="h-4 w-4 mr-1" />;
    case "tv":
      return <Tv className="h-4 w-4 mr-1" />;
    case "mountain-view":
      return <Mountain className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

const getAmenityLabel = (amenity: string) => {
  switch (amenity) {
    case "wifi":
      return "Wi-Fi";
    case "breakfast":
      return "Breakfast Included";
    case "kitchen":
      return "Kitchen";
    case "attached-bathroom":
      return "Attached Bathroom";
    case "shared-bathroom":
      return "Shared Bathroom";
    case "fan":
      return "Fan";
    case "tv":
      return "TV";
    case "mountain-view":
      return "Mountain View";
    default:
      return amenity.charAt(0).toUpperCase() + amenity.slice(1);
  }
};

const AccommodationSection: React.FC<AccommodationSectionProps> = ({
  accommodations = defaultAccommodations,
}) => {
  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-2 text-stone-800">
          Our Accommodations
        </h2>
        <p className="text-center mb-12 text-stone-600 max-w-2xl mx-auto">
          Experience comfort amidst nature with our thoughtfully designed stay
          options
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodations.map((accommodation) => (
            <Card
              key={accommodation.id}
              className="overflow-hidden border-stone-200 bg-white"
            >
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={accommodation.images[0]}
                    alt={accommodation.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-sm font-medium">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>
                      {accommodation.capacity}{" "}
                      {accommodation.capacity === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-stone-800">
                  {accommodation.title}
                </CardTitle>
                <CardDescription className="text-stone-600">
                  {accommodation.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 text-stone-700">
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {accommodation.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center text-xs bg-stone-100 px-2 py-1 rounded-full text-stone-700"
                      >
                        {getAmenityIcon(amenity)}
                        {getAmenityLabel(amenity)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-lg font-semibold text-stone-800">
                  ₹{accommodation.price}
                  <span className="text-sm font-normal text-stone-600">
                    {" "}
                    / night
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-green-700 text-green-700 hover:bg-green-50"
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-stone-800">
                        {accommodation.title}
                      </DialogTitle>
                      <DialogDescription className="text-stone-600">
                        {accommodation.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {accommodation.images.map((image, index) => (
                        <AspectRatio key={index} ratio={4 / 3}>
                          <img
                            src={image}
                            alt={`${accommodation.title} - Image ${index + 1}`}
                            className="object-cover w-full h-full rounded-md"
                          />
                        </AspectRatio>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="text-lg font-medium mb-2 text-stone-800">
                        Details
                      </h4>
                      <p className="text-stone-600">{accommodation.details}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-stone-700">
                          Amenities
                        </h4>
                        <div className="flex flex-col gap-2">
                          {accommodation.amenities.map((amenity) => (
                            <div
                              key={amenity}
                              className="flex items-center text-stone-600"
                            >
                              {getAmenityIcon(amenity)}
                              {getAmenityLabel(amenity)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 text-stone-700">
                          Details
                        </h4>
                        <div className="flex items-center text-stone-600 mb-2">
                          <Users className="h-4 w-4 mr-2" />
                          <span>
                            Capacity: {accommodation.capacity}{" "}
                            {accommodation.capacity === 1 ? "Guest" : "Guests"}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-stone-800">
                          ₹{accommodation.price}
                          <span className="text-sm font-normal text-stone-600">
                            {" "}
                            / night
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                        Book Now
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccommodationSection;
