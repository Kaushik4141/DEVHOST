"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  title: string;
  image: string;
  id?: number;
  source?: string;
}

export default function CourseCard({ title, image, id, source }: CourseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.05,
      rotateY: 3,
      boxShadow: "0 8px 24px rgba(72, 214, 76, 0.2)",
      borderColor: "rgba(72, 214, 76, 0.4)",
      duration: 0.3,
      ease: "power1.out",
    });

    gsap.to(imageRef.current, {
      y: -5,
      opacity: 0.95,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      rotateY: 0,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      borderColor: "transparent",
      duration: 0.3,
      ease: "power1.out",
    });

    gsap.to(imageRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  // Create the link URL based on the course title
  const getHref = () => {
    // If the title is "Motia", redirect to documentation page with specific API request
    if (title === "Motia") {
      return "/documentation?page=1&limit=200&_id=68eba78a0230358d109af052";
    }
    // If the title is "Polar", redirect to the Polar documentation
    if (title === "Polar") {
      return "/documentation?source=polar";
    }
    // If the title is "Nodemailer", redirect to the Nodemailer documentation
    if (title === "Nodemailer") {
      return "/documentation?source=nodemailer";
    }
    // For other courses, just return the courses page
    return "/courses";
  };

  return (
    <Link href={getHref()}>
      <div
        ref={cardRef}
        className="course-card bg-[#1a1a1a] rounded-xl overflow-hidden border border-transparent transition-shadow cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          ref={imageRef}
          src={image}
          alt={title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
    </Link>
  );
}