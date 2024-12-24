import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Brain, Code, Layers, BarChart2, 
  Target, Zap, Power, Atom,
  Network, Binary, Database, Shield,
  GitBranch, Box, Workflow, Globe,
  Fingerprint, Lock, Cloud, Wifi
} from 'lucide-react';

const AudioPlayer = () => {
  const [primaryAudio] = useState(() => {
    const audio = new Audio();
    audio.src = '/loading.mp3';
    audio.loop = true;
    return audio;
  });

  const [effectsAudio] = useState(() => {
    const audio = new Audio();
    audio.src = '/effects.mp3';
    return audio;
  });

  const playSound = useCallback(() => {
    primaryAudio.play().catch(error => console.error('Audio playback error:', error));
  }, [primaryAudio]);

  const playEffect = useCallback(() => {
    effectsAudio.currentTime = 0;
    effectsAudio.play().catch(error => console.error('Effect playback error:', error));
  }, [effectsAudio]);

  const stopSound = useCallback(() => {
    primaryAudio.pause();
    primaryAudio.currentTime = 0;
    effectsAudio.pause();
    effectsAudio.currentTime = 0;
  }, [primaryAudio, effectsAudio]);

  return { playSound, playEffect, stopSound };
};

const DynamicBackground = () => {
  const [hexagons] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 50,
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      color: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, 255, ${Math.random() * 0.1 + 0.05})`,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {hexagons.map(({ id, size, initialX, initialY, color, duration, delay }) => (
        <motion.div
          key={id}
          className="absolute"
          style={{
            width: size,
            height: size,
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: color,
          }}
          initial={{ x: initialX, y: initialY, rotate: 0 }}
          animate={{
            x: [initialX, initialX + 100, initialX - 100, initialX],
            y: [initialY, initialY - 100, initialY + 100, initialY],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const GridLines = () => (
  <motion.div 
    className="absolute inset-0 overflow-hidden opacity-20"
    animate={{
      backgroundPosition: ['0% 0%', '100% 100%'],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "linear",
    }}
  >
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px',
    }} />
  </motion.div>
);

const FloatingIcon = ({ icon: Icon, delay = 0, position = {} }) => (
  <motion.div
    className="absolute"
    style={{
      top: position.top || `${Math.random() * 80 + 10}%`,
      left: position.left || `${Math.random() * 80 + 10}%`,
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0.8, 1.2, 0.8],
      opacity: [0.3, 0.7, 0.3],
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    <Icon className="text-blue-400/30" size={32} />
  </motion.div>
);

const LoadingProgress = ({ progress }) => (
  <div className="relative w-[32rem] h-3">
    <motion.div 
      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full opacity-20 blur-lg"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    />
    <div className="relative w-full bg-gray-900/50 rounded-full h-full overflow-hidden backdrop-blur-sm
                    border border-blue-500/20">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ 
          width: `${progress}%`,
          background: [
            'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            'linear-gradient(90deg, #8B5CF6, #EC4899)',
            'linear-gradient(90deg, #EC4899, #3B82F6)'
          ]
        }}
        transition={{ 
          width: { duration: 1 },
          background: { duration: 3, repeat: Infinity }
        }}
        className="h-full rounded-full shadow-lg"
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />
      </motion.div>
    </div>
  </div>
);

const SubProcessLoader = ({ processes }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {processes.map((process, index) => (
        <motion.div
          key={process.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="flex items-center space-x-2 text-sm text-blue-400/70"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <process.icon size={16} />
          </motion.div>
          <span>{process.name}</span>
          <motion.span
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            {process.status}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

const StartButton = ({ onClick }) => (
  <motion.div
    className="relative"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-lg opacity-50 blur-xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    />
    <motion.button
      onClick={onClick}
      className="relative px-16 py-8 bg-gradient-to-r from-blue-900/80 to-purple-900/80 
                 rounded-lg text-white font-bold text-2xl shadow-2xl
                 border border-blue-400/30 backdrop-blur-md"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center space-x-4">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Brain className="w-10 h-10" />
        </motion.div>
        <span className="relative">
          <span className="absolute -inset-1 blur-md bg-blue-400/30" />
          <span className="relative">Power Up</span>
        </span>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Power className="w-10 h-10" />
        </motion.div>
      </div>
    </motion.button>
  </motion.div>
);

const LoadingStage = ({ icon: Icon, text, subText, progress, subProcesses }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="text-white text-center"
  >
    <motion.div
      className="mx-auto mb-8 w-48 h-48 bg-gradient-to-r from-blue-900/50 to-purple-900/50 
                 rounded-full flex items-center justify-center relative
                 backdrop-blur-lg border border-blue-500/20"
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            '0 0 30px rgba(59, 130, 246, 0.3)',
            '0 0 60px rgba(124, 58, 237, 0.5)',
            '0 0 30px rgba(59, 130, 246, 0.3)',
          ],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(90deg, rgba(59, 130, 246, 0.5), rgba(124, 58, 237, 0.5))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        animate={{
          rotate: 360,
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon className="w-24 h-24 text-blue-400" />
      </motion.div>
    </motion.div>

    <div className="space-y-4">
      <motion.div 
        className="text-2xl font-light tracking-wider"
        animate={{
          color: ['#60A5FA', '#8B5CF6', '#60A5FA'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        {text}
      </motion.div>
      <div className="text-blue-400/70 text-sm">{subText}</div>
      
      <LoadingProgress progress={progress} />
      
      {subProcesses && <SubProcessLoader processes={subProcesses} />}
    </div>
  </motion.div>
);

const AdvancedMLLoader = ({ onLoadingComplete }) => {
  const [loadingStage, setLoadingStage] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { playSound, playEffect, stopSound } = AudioPlayer();

  const loadingStages = [
    {
      icon: Brain,
      text: 'Initializing Quantum Neural Architecture',
      subText: 'Establishing primary cognitive matrices...',
      progress: 15,
      subProcesses: [
        { icon: Cpu, name: 'Neural Core', status: 'Initializing...' },
        { icon: Network, name: 'Synaptic Links', status: 'Connecting...' },
        { icon: Shield, name: 'Security Layer', status: 'Active' },
        { icon: Binary, name: 'Base Systems', status: 'Online' },
      ]
    },
    {
      icon: Network,
      text: 'Deploying Distributed Intelligence Mesh',
      subText: 'Synchronizing quantum entanglement protocols...',
      progress: 30,
      subProcesses: [
        { icon: Cloud, name: 'Cloud Nodes', status: 'Connecting...' },
        { icon: Wifi, name: 'Network Mesh', status: 'Optimizing...' },
        { icon: Lock, name: 'Encryption', status: 'Active' },
        { icon: GitBranch, name: 'Load Balancing', status: 'Online' },
      ]
    },
    {
      icon: Shield,
      text: 'Establishing Quantum Security Framework',
      subText: 'Implementing advanced protection protocols...',
      progress: 45,
      subProcesses: [
        { icon: Lock, name: 'Quantum Encryption', status: 'Active' },
        { icon: Fingerprint, name: 'Biometric Auth', status: 'Scanning...' },
        { icon: Shield, name: 'Neural Firewall', status: 'Enabled' },
        { icon: Binary, name: 'Core Security', status: 'Running' },
      ]
    },
    {
      icon: Database,
      text: 'Processing Neural Training Data',
      subText: 'Analyzing quantum information patterns...',
      progress: 60,
      subProcesses: [
        { icon: Brain, name: 'Pattern Analysis', status: 'Processing...' },
        { icon: BarChart2, name: 'Data Metrics', status: 'Calculating...' },
        { icon: Layers, name: 'Neural Layers', status: 'Training...' },
        { icon: Target, name: 'Accuracy', status: '94.7%' },
      ]
    },
    {
      icon: Atom,
      text: 'Optimizing Quantum Processing Units',
      subText: 'Fine-tuning computational matrices...',
      progress: 75,
      subProcesses: [
        { icon: Cpu, name: 'QPU Cores', status: 'Optimizing...' },
        { icon: Zap, name: 'Power Draw', status: 'Stable' },
        { icon: BarChart2, name: 'Performance', status: 'Tuning...' },
        { icon: Target, name: 'Efficiency', status: '97.2%' },
      ]
    },
    {
      icon: Workflow,
      text: 'Harmonizing AI Subsystems',
      subText: 'Achieving quantum cognitive resonance...',
      progress: 90,
      subProcesses: [
        { icon: Binary, name: 'Core Systems', status: 'Syncing...' },
        { icon: Network, name: 'Neural Net', status: 'Active' },
        { icon: Shield, name: 'Security', status: 'Optimal' },
        { icon: Globe, name: 'Global Sync', status: 'Complete' },
      ]
    },
    {
      icon: Globe,
      text: 'Launching Quantum Neural Core',
      subText: 'Initiating full spectrum operations...',
      progress: 100,
      subProcesses: [
        { icon: Power, name: 'Core Power', status: '100%' },
        { icon: Target, name: 'Accuracy', status: '99.9%' },
        { icon: Shield, name: 'Defenses', status: 'Active' },
        { icon: Brain, name: 'AI Core', status: 'Ready' },
      ]
    },
  ];

  const handleStart = () => {
    setIsLoading(true);
    playSound();
    playEffect();
  };

  useEffect(() => {
    if (!isLoading) return;

    const loadingTimer = setTimeout(() => {
      if (loadingStage < loadingStages.length - 1) {
        setLoadingStage(prev => prev + 1);
        playEffect();
      } else {
        stopSound();
        setTimeout(() => {
          setShowLoader(false);
          onLoadingComplete?.();
        }, 2000);
      }
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, [loadingStage, isLoading, loadingStages.length, onLoadingComplete, stopSound, playEffect]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-gradient-to-br from-black via-blue-950 to-purple-950"
        >
          <GridLines />
          <DynamicBackground />
          
          {!isLoading ? (
            <>
              <FloatingIcon icon={Binary} delay={0} />
              <FloatingIcon icon={Box} delay={1} />
              <FloatingIcon icon={Code} delay={2} />
              <StartButton onClick={handleStart} />
            </>
          ) : (
            <LoadingStage {...loadingStages[loadingStage]} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvancedMLLoader;