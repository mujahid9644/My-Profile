import { motion } from 'framer-motion';
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaPython,
} from 'react-icons/fa';
import {
  SiDjango,
  SiPostgresql,
} from 'react-icons/si';
import { TbRobot } from 'react-icons/tb';

const techIcons = [
  { Icon: FaHtml5, label: 'HTML', color: '#E34C26' },
  { Icon: FaCss3Alt, label: 'CSS', color: '#1572B6' },
  { Icon: FaJs, label: 'JavaScript', color: '#F7DF1E' },
  { Icon: FaReact, label: 'React', color: '#61DAFB' },
  { Icon: FaPython, label: 'Python', color: '#3776AB' },
  { Icon: SiDjango, label: 'Django', color: '#092E20' },
  { Icon: SiPostgresql, label: 'PostgreSQL', color: '#336791' },
  { Icon: TbRobot, label: 'AI/Bot', color: '#A855F7' },
];

export default function TechOrbitIcons() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Outer orbit circle */}
      <motion.div
        className="absolute border border-white/10 rounded-full"
        style={{ width: '500px', height: '500px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Middle orbit circle */}
      <motion.div
        className="absolute border border-white/5 rounded-full"
        style={{ width: '350px', height: '350px' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner orbit circle */}
      <motion.div
        className="absolute border border-white/[0.03] rounded-full"
        style={{ width: '200px', height: '200px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Tech Icons in Orbit */}
      {techIcons.map((tech, index) => {
        const Icon = tech.Icon;
        const angle = (index / techIcons.length) * 360;
        const distance = 250;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        return (
          <motion.div
            key={tech.label}
            className="absolute flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-24px',
              marginTop: '-24px',
            }}
            animate={{
              x,
              y,
              rotate: [0, -360],
            }}
            transition={{
              x: { duration: 60, repeat: Infinity, ease: 'linear' },
              y: { duration: 60, repeat: Infinity, ease: 'linear' },
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            }}
          >
            {/* Icon glow background */}
            <motion.div
              className="absolute inset-0 rounded-full blur-lg"
              style={{
                background: tech.color,
                opacity: 0.3,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />

            {/* Icon container */}
            <motion.div
              className="relative flex items-center justify-center w-12 h-12 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm shadow-lg"
              whileHover={{
                scale: 1.2,
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderColor: `${tech.color}80`,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: tech.color }}
              />
            </motion.div>

            {/* Label tooltip */}
            <motion.div
              className="absolute -bottom-8 text-xs font-semibold text-white/60 whitespace-nowrap"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {tech.label}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Center dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-lg"
        animate={{
          scale: [1, 1.3, 1],
          boxShadow: [
            '0 0 20px rgba(var(--glow-color), 0.5)',
            '0 0 40px rgba(var(--glow-color), 0.8)',
            '0 0 20px rgba(var(--glow-color), 0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}
