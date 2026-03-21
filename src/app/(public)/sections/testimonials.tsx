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
          <div className="text-center py-16 text-muted-foreground">
            <p>No testimonials available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
