"use client";

import { useState } from "react";

// --- MOCK DATA ---
// In a real Next.js app, you might fetch this from an API or CMS.
const courseModules = [
  { id: 1, title: "Module 1: Introduction" },
  { id: 2, title: "Module 2: Core Concepts" },
  { id: 3, title: "Module 3: Thinking DevOps" },
  { id: 4, title: "Module 4: Advanced Topics" },
  { id: 5, title: "Module 5: Git Repository Guidelines" },
  { id: 6, title: "Module 6: Final Project" },
];

const otherLinks = [
  { id: "grades", title: "Grades" },
  { id: "messages", title: "Messages" },
  { id: "forums", title: "Discussion Forums" },
];

export default function CourseSidebar() {
  // Track the currently active module or link
  const [activeItemId, setActiveItemId] = useState<number | string>(3);

  return (
    <aside className="w-80 h-screen bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-2">Introduction to DevOps</h1>
      <h2 className="text-sm text-gray-500 mb-8">Course Material</h2>

      <nav className="flex-grow overflow-y-auto">
        <ul>
          {/* Course Modules */}
          {courseModules.map((module) => (
            <li key={module.id} className="mb-2">
              <button
                onClick={() => setActiveItemId(module.id)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors text-gray-700
                  ${
                    activeItemId === module.id
                      ? "bg-blue-100 text-blue-600 font-bold"
                      : "hover:bg-gray-100"
                  }`}
              >
                {/* Circular radio icon */}
                <div className="w-5 h-5 mr-4 border-2 rounded-full flex items-center justify-center border-gray-300">
                  {activeItemId === module.id && (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <span>{module.title}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        <ul>
          {/* Other Links */}
          {otherLinks.map((link) => (
            <li key={link.id} className="mb-2">
              <button
                onClick={() => setActiveItemId(link.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors text-gray-700
                  ${
                    activeItemId === link.id
                      ? "font-bold text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
              >
                {link.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
