import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ChevronDown } from "lucide-react";


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
<div className="flex flex-col h-full rounded-xl border-1 border-white/20 bg-black/40 shadow-sm transition-colors">     
      
       <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-6 text-left"
      >
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <ChevronDown
      className={`transition-transform duration-200 text-white ${
        isExpanded ? "rotate-180" : ""
      }`}
      />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 flex flex-col flex-1 ${
          isExpanded ? "max-h-64 px-4 pb-4" : "max-h-0 px-4"
        }`}
      >
        <p className="text-md text-white/70">{description}</p>
        <div className="flex justify-end mt-auto pt-3">
          <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full hover:shadow-lg transition-all">
            <ArrowRight className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;