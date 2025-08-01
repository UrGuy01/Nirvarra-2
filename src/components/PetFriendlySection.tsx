import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";

interface PetFriendlySectionProps {
  title?: string;
  description?: string;
  features?: Array<{
    title: string;
    description: string;
  }>;
  imageSrc?: string;
}

const PetFriendlySection = ({
  title = "Pet-Friendly Paradise",
  description = "At Nirvarra, we believe your furry friends deserve a vacation too. Our farmstay is designed to be a haven for pets, with plenty of space to run, play, and explore.",
  features = [
    {
      title: "Open Fields",
      description:
        "Spacious open fields where your pets can run freely and enjoy the fresh air.",
    },
    {
      title: "River Access",
      description:
        "A nearby river where pets can splash and cool off during hot days.",
    },
    {
      title: "Pet Amenities",
      description:
        "We provide pet toys, food bowls, and comfortable sleeping areas for your furry companions.",
    },
    {
      title: "Safe Environment",
      description:
        "Our property is securely fenced to ensure your pets can explore safely.",
    },
  ],
  imageSrc = "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&q=80",
}: PetFriendlySectionProps) => {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-amber-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <p className="text-lg text-amber-800 mb-8">{description}</p>

            <Card className="bg-white border-amber-200 shadow-md">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-4 bg-amber-100" />}
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg text-amber-900">
                            {feature.title}
                          </h3>
                          <p className="text-amber-700">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-xl">
              <img
                src={imageSrc}
                alt="Happy dog enjoying nature at Nirvarra farmstay"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900/70 to-transparent p-6">
                <p className="text-white text-lg font-medium">
                  Your pets will love it here!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetFriendlySection;
