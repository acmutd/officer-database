import React, { useState } from "react";

interface CardDataProps {
  title: string;
  description: string;
  link: string;
}

const DashboardCard: React.FC<CardDataProps> = ({
  title,
  description,
  link,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className={`transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-64 px-4 pb-4" : "max-h-0 px-4"
        }`}
      >
        <p className="mb-3 text-sm text-gray-600">{description}</p>

          <a href={link}>Go</a>
      </div>
    </div>
  );
};

export default DashboardCard;