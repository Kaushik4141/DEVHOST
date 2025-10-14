"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CourseCard from "./CourseCard";

interface Course {
  title: string;
  image: string;
  id?: number;
  source?: string;
}

interface CourseGridProps {
  courses: Course[];
}

export default function CourseGrid({ courses }: CourseGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".course-card");
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <div
      ref={gridRef}
      className="course-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    >
      {courses.map((course, index) => (
        <CourseCard 
          key={index} 
          title={course.title} 
          image={course.image} 
          id={course.id} 
          source={course.source} 
        />
      ))}
    </div>
  );
}
