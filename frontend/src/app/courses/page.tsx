'use client';
import CourseGrid from "@/components/convert/CourseGrid";

const sampleCourses = [
  {
    id: 1,
    title: "Motia",
    description: "Motia is the single backend runtime where API endpoints, background jobs, scheduled tasks, and AI agents written in any language, are all unified in workflows, with full observability, scalability and resiliency. Build, automate, and evolve all on one platform with one command line to quickly deploy to production.",
    image: "/images/motia-removebg-preview.png",
    price: 99.99,
    instructor: "John Doe",
    duration: "10 weeks",
    level: "Intermediate"
  },
  {
    id: 2,
    title: "Polar",
    description: "Complete guide to TypeScript development",
    image: "/images/polar-removebg-preview.png",
    price: 79.99,
    instructor: "Jane Smith",
    duration: "8 weeks",
    level: "Beginner"
  },
  {
    id: 3,
    title: "Nodemailer",
    description: "Master Next.js and Server Side Rendering",
    image: "/images/nodemailer-removebg-preview.png",
    price: 129.99,
    instructor: "Mike Johnson",
    duration: "12 weeks",
    level: "Advanced"
  }
];

export default function CoursesPage() {
  // Navigation is handled inside CourseCard via Link based on title

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Our Courses</h1>
      <CourseGrid 
        courses={sampleCourses}
      />
    </main>
  );
}