import { motion } from 'framer-motion';
import { useMemo } from 'react';

export type ParticleType = 'snow' | 'dust' | 'nature' | 'ink' | 'none';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const ParticleBackground = ({ type }: { type: ParticleType }) => {
  const particles = useMemo(() => {
    if (type === 'none') return [];
    
    const count = type === 'nature' ? 30 : 25;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (type === 'nature' ? 4 : 2) + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, [type]);

  if (type === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: 
              type === 'snow' ? '#ffffff' :
              type === 'dust' ? '#d97706' :
              type === 'nature' ? '#34d399' : // Brighter emerald for fireflies
              '#e5e5e5', // Light grey for embers/ash (instead of black ink)
            boxShadow: type === 'nature' ? '0 0 4px #10b981' : 'none',
            opacity: p.opacity,
            filter: type === 'dust' ? 'blur(1px)' : 'none',
          }}
          animate={
            type === 'snow' ? {
              y: ['0vh', '100vh'],
              x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
            } : type === 'dust' ? {
              y: [`${p.y}%`, `${p.y + (Math.random() * 20 - 10)}%`],
              x: [`${p.x}%`, `${p.x + (Math.random() * 20 - 10)}%`],
              opacity: [p.opacity, p.opacity * 0.5, p.opacity],
            } : type === 'nature' ? {
              scale: [1, 1.2, 1],
              opacity: [p.opacity, p.opacity * 1.5, p.opacity],
              x: [
                `${p.x}%`, 
                `${p.x + (Math.random() * 15 - 7.5)}%`,
                `${p.x - (Math.random() * 15 - 7.5)}%`,
                `${p.x}%`
              ],
              y: [
                `${p.y}%`, 
                `${p.y - (Math.random() * 10 + 5)}%`,
                `${p.y + (Math.random() * 5)}%`,
                `${p.y}%`
              ],
            } : {
              // Embers/Ash
              y: [`${p.y}%`, `${p.y - (Math.random() * 40 + 20)}%`],
              opacity: [0, p.opacity, 0],
              scale: [0, 1.5, 0.5],
              x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
            }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Light ray effect for City/Citadel */}
      {type === 'dust' && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
      )}
    </div>
  );
};

export default ParticleBackground;
