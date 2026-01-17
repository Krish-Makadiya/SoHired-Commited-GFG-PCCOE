import { cn } from "@/lib/utils";
import {
  Bot,
  TrendingUp,
  FileText,
  Mic,
  Activity,
  LayoutDashboard,
  Globe,
  Percent
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Automated Applications",
      description: "Let our AI agent handle the tedious application process while you focus on prep.",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      title: "Skill Gap Analysis",
      description: "Identify exactly what skills you're missing for your dream role and how to bridge them.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Smart Resume Tailoring",
      description: "Automatically tailor your resume for every single job description to increase acceptance rates.",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "Interview Intelligence",
      description: "Practice with AI-driven mock interviews that give you real-time feedback on your answers.",
      icon: <Mic className="w-6 h-6" />,
    },
    {
      title: "Market Pulse",
      description: "Stay ahead with real-time insights on salary trends and hiring demands for your role.",
      icon: <Activity className="w-6 h-6" />,
    },
    {
      title: "Unified Tracker",
      description: "Visualize your entire job hunt pipeline in one intuitive, automated dashboard.",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      title: "Sponsorship Filter",
      description: "Instantly filter and identify jobs that explicitly support visa sponsorship.",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      title: "Smart Match Score",
      description: "Know your probability of getting hired before you even apply with our AI scoring.",
      icon: <Percent className="w-6 h-6" />,
    },
  ];

  return (
    <div className="py-20 lg:py-32 max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-light-primary-text dark:text-dark-primary-text mb-4">
          Everything you need to <span className="text-light-primary dark:text-dark-primary">get hired</span>
        </h2>
        <p className="text-lg text-light-secondary-text dark:text-dark-secondary-text max-w-2xl mx-auto">
          From application to offer letter, SoHired provides an end-to-end toolkit to supercharge your career journey.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-black/5 dark:border-white/5",
        (index === 0 || index === 4) && "lg:border-l border-black/5 dark:border-white/5",
        index < 4 && "lg:border-b border-black/5 dark:border-white/5"
      )}>
      {index < 4 && (
        <div
          className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-light-primary/5 dark:from-dark-primary/5 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div
          className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-light-primary/5 dark:from-dark-primary/5 to-transparent pointer-events-none" />
      )}
      <div
        className="mb-4 relative z-10 px-10 text-light-secondary dark:text-dark-secondary group-hover/feature:text-light-primary dark:group-hover/feature:text-dark-primary transition-colors duration-200">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div
          className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-black/10 dark:bg-white/10 group-hover/feature:bg-light-primary dark:group-hover/feature:bg-dark-primary transition-all duration-200 origin-center" />
        <span
          className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-light-primary-text dark:text-dark-primary-text">
          {title}
        </span>
      </div>
      <p
        className="text-sm text-light-secondary-text dark:text-dark-secondary-text max-w-xs relative z-10 px-10 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
