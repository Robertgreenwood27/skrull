// pages/index.js or wherever you want to list your projects
import ProjectCard from '../components/ProjectCard';

const projects = [
  {
    title: 'My Project 1',
    imageUrl: '/project1.png',
    description: 'A brief description of my project goes here.',
    techStack: ['Next.js', 'Tailwind CSS', 'Node.js'],
    websiteUrl: 'https://project1.com',
    githubUrl: 'https://github.com/myprofile/project1',
  },
  {
    title: 'My Project 1',
    imageUrl: '/project1.png',
    description: 'A brief description of my project goes here.',
    techStack: ['Next.js', 'Tailwind CSS', 'Node.js'],
    websiteUrl: 'https://project1.com',
    githubUrl: 'https://github.com/myprofile/project1',
  },
  {
    title: 'My Project 1',
    imageUrl: '/project1.png',
    description: 'A brief description of my project goes here.',
    techStack: ['Next.js', 'Tailwind CSS', 'Node.js'],
    websiteUrl: 'https://project1.com',
    githubUrl: 'https://github.com/myprofile/project1',
  },
  {
    title: 'My Project 1',
    imageUrl: '/project1.png',
    description: 'A brief description of my project goes here.',
    techStack: ['Next.js', 'Tailwind CSS', 'Node.js'],
    websiteUrl: 'https://project1.com',
    githubUrl: 'https://github.com/myprofile/project1',
  },
  // ... other projects
];

export default function Projects() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap -m-4">
        {projects.map((project, index) => (
          <div key={index} className="p-4 md:w-1/2">
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </div>
  );
}
