// components/ProjectCard.js

import Image from 'next/image';

export default function ProjectCard({ title, imageUrl, description, techStack, websiteUrl, githubUrl }) {
    return (
      <div className="card rounded-lg overflow-hidden">
        <Image className="w-full h-64 object-cover object-center" src={imageUrl} alt={title} width={100} height={80}/>
        <div className="p-6">
          <h2 className="title-font text-lg font-medium mb-3">{title}</h2>
          <p className="leading-relaxed mb-3">{description}</p>
          <div className="flex flex-wrap mt-3">
            {techStack.map((tech, index) => (
              <span key={index} className="m-1 bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700">{tech}</span>
            ))}
          </div>
          <div className="flex items-center flex-wrap mt-3">
            <a href={websiteUrl} target='#' className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Visit Website
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
            <a href={githubUrl} target='#' className="text-gray-500 inline-flex items-center ml-4">View Code
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M12 18l6-6-6-6"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }
  