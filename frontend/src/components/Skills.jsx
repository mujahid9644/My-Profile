import { useEffect, useRef, useState } from 'react';
import AnimatedSection from './ui/AnimatedSection.jsx';
import {
  FaCode,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaPython,
  FaGitAlt,
  FaGithub,
} from 'react-icons/fa';
import { 
  SiTailwindcss, 
  SiDjango, 
  SiPostgresql, 
  SiOpenai, 
  SiVercel, 
  SiRender, 
  SiPostman 
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { TbMessageChatbot, TbRobot } from 'react-icons/tb';
import { LuBrainCircuit } from 'react-icons/lu';

const skillsData = [
  { name: 'HTML', icon: FaHtml5 },
  { name: 'CSS', icon: FaCss3Alt },
  { name: 'JavaScript', icon: FaJs },
  { name: 'React', icon: FaReact },
  { name: 'Tailwind', icon: SiTailwindcss },
  { name: 'Python', icon: FaPython },
  { name: 'Django', icon: SiDjango },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'Git', icon: FaGitAlt },
  { name: 'GitHub', icon: FaGithub },
  { name: 'API', icon: VscCode },
  { name: 'AI Chatbot', icon: TbMessageChatbot },
  { name: 'OpenAI', icon: SiOpenai },
  { name: 'Gemini', icon: LuBrainCircuit },
  { name: 'Groq', icon: TbRobot },
  { name: 'Vercel', icon: SiVercel },
  { name: 'Render', icon: SiRender },
  { name: 'Postman', icon: SiPostman },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const [marqueeActive, setMarqueeActive] = useState(false);
  const colors = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--text-muted)', 'rgb(77, 220, 255)'];

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMarqueeActive(entry.isIntersecting);
      },
      { rootMargin: '160px 0px' },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const SkillCard = ({ skill, index }) => {
    const Icon = skill.icon;
    const iconColor = colors[index % colors.length];

    return (
      <div className="skill-card">
        <div className="skill-icon">
          <Icon
            className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ color: iconColor }}
          />
        </div>
        <h3 className="skill-name">{skill.name}</h3>
        <div className="skill-shine" />
      </div>
    );
  };

  // Split skills into 2 rows
  const midpoint = Math.ceil(skillsData.length / 2);
  const row1 = skillsData.slice(0, midpoint);
  const row2 = skillsData.slice(midpoint);

  return (
    <AnimatedSection id="skills" ref={sectionRef} className="w-full pt-16 pb-10 sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1.5 backdrop-blur-sm">
            <FaCode className="h-4 w-4 text-[var(--accent-primary)]" />
            <p className="text-base font-bold uppercase tracking-[.24em] text-[var(--accent-primary)]">
              Skills & Technologies
            </p>
          </div>
          <h2 className="mt-3 text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
            Tools & Technologies I Use
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">
            A curated collection of technologies I'm proficient with for building production-grade applications.
          </p>
        </div>

        <div className={`space-y-6 ${marqueeActive ? 'marquee-active' : ''}`}>
          {/* Row 1: Left to Right */}
          <div className="marquee-container">
            <div className="marquee-row animate-right">
              {/* First set */}
              {row1.map((skill, idx) => (
                <SkillCard key={`row1-${idx}`} skill={skill} index={idx} />
              ))}
              {/* Duplicate for seamless loop */}
              {row1.map((skill, idx) => (
                <SkillCard key={`row1-dup-${idx}`} skill={skill} index={idx} />
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left */}
          <div className="marquee-container">
            <div className="marquee-row animate-left">
              {/* First set */}
              {row2.map((skill, idx) => (
                <SkillCard key={`row2-${idx}`} skill={skill} index={midpoint + idx} />
              ))}
              {/* Duplicate for seamless loop */}
              {row2.map((skill, idx) => (
                <SkillCard key={`row2-dup-${idx}`} skill={skill} index={midpoint + idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
