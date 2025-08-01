import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Experience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ExperienceCarouselProps {
  experiences?: Experience[];
}

const ExperienceCarousel = ({
  experiences = defaultExperiences,
}: ExperienceCarouselProps) => {
  return (
    <section className="w-full py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
            Experiences at Nirvarra
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Immerse yourself in nature and discover unique activities that will
            make your stay memorable.
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {experiences.map((experience) => (
              <CarouselItem
                key={experience.id}
                className="md:basis-1/2 lg:basis-1/2"
              >
                <div className="p-2">
                  <Card className="overflow-hidden border-none shadow-lg rounded-xl">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={experience.imageUrl}
                          alt={experience.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {experience.title}
                          </h3>
                          <p className="text-white/90 text-sm line-clamp-3">
                            {experience.description}
                          </p>
                          <Button
                            variant="outline"
                            className="mt-4 bg-white/20 text-white border-white/30 hover:bg-white/30 w-fit"
                          >
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
        </Carousel>

        <div className="flex justify-center mt-8 md:hidden">
          <div className="flex space-x-2">
            {experiences.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-stone-300" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const defaultExperiences: Experience[] = [
  {
    id: "1",
    title: "Trekking Adventures",
    description:
      "Explore the scenic trails around Nirvarra with guided treks through lush forests and hills. Perfect for nature enthusiasts and adventure seekers of all experience levels.",
    imageUrl:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
  {
    id: "2",
    title: "Waterfall Bathing",
    description:
      "Cool off in the pristine natural waterfalls near our farmstay. Experience the refreshing embrace of cascading water in a serene forest setting.",
    imageUrl:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",
  },
  {
    id: "3",
    title: "Stargazing Nights",
    description:
      "Away from city lights, Nirvarra offers spectacular night skies. Join our evening stargazing sessions with telescopes and expert guidance on constellations.",
    imageUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
  },
  {
    id: "4",
    title: "Organic Farming",
    description:
      "Get your hands dirty and learn about sustainable farming practices. Pick fresh vegetables and herbs from our organic garden and participate in planting activities.",
    imageUrl:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&q=80",
  },
];

export default ExperienceCarousel;
