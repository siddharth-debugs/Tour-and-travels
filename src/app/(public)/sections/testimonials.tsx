import { Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { TestimonialCarousel } from "@/components/shared/testimonial-carousel";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string | null;
  rating: number;
  review: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <SectionHeading
            title="What Our Travelers Say"
            subtitle="Real experiences shared by real people who explored India with WanderQuest"
            align="center"
          />
        </div>

        {testimonials.length > 0 ? (
          <TestimonialCarousel
            testimonials={testimonials.map((t) => ({
              ...t,
              avatar: t.avatar ?? undefined,
            }))}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="flex items-center justify-center size-24 rounded-3xl bg-primary/10 mb-6">
              <Star className="size-12 text-primary/60" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Reviews Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
              Our travelers are out exploring! Be the first to share your WanderQuest experience.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
