import React, { useState, useEffect } from 'react';

interface BootLoaderProps {
  children: React.ReactNode;
  onBootComplete?: () => void;
  isLoading: boolean;
}

const SystemBootLoader: React.FC<BootLoaderProps> = ({ children, isLoading }) => {
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(isLoading);
  const [renderChildren, setRenderChildren] = useState(!isLoading);

  useEffect(() => {
    if (isLoading) {
      setIsBooting(true);
      setRenderChildren(false);
      setBootSequence([]);
      
      const bootSteps = [
        "INITIALIZING_SECURE_NETWORK...",
        "ESTABLISHING_SECURE_CONNECTION...",
        "SYNCHRONIZING_GRIEVANCE_NODES...",
        "DECRYPTING_AUTHORITY_PROTOCOLS...",
        "SYSTEM_STATE_CHECK: GREEN/STABLE...",
        "ACCESS_GRANTED."
      ];
      
      let stepIndex = 0;
      const intervalId = setInterval(() => {
        if (stepIndex < bootSteps.length) {
          setBootSequence(prev => [...prev, bootSteps[stepIndex]]);
          stepIndex++;
        } else {
          clearInterval(intervalId);
          setTimeout(() => {
            setIsBooting(false);
            setRenderChildren(true);
          }, 600);
        }
      }, 350);
      
      return () => clearInterval(intervalId);
    } else {
      setIsBooting(false);
      setRenderChildren(true);
    }
  }, [isLoading]);

  return (
    <div className="relative w-full h-full min-h-screen">
      {isBooting && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="max-w-md w-full p-8 border border-[#ccff00]/40 shadow-[0_0_30px_rgba(57,255,20,0.15)] bg-black/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#39ff14] to-[#ccff00] animate-pulse"></div>
            <div className="font-mono text-sm tracking-widest text-[#39ff14] mb-4 uppercase animate-booting-flicker">
              JEC-RESOLVE // TERMINAL
            </div>
            
            <div className="space-y-2 h-48 overflow-y-auto">
              {bootSequence.map((text, idx) => (
                <div key={idx} className="font-mono text-xs tracking-wider text-green-400 opacity-90">
                  <span className="text-[#ccff00] mr-2">&gt; </span>
                  {text}
                </div>
              ))}
              <div className="font-mono text-xs tracking-wider text-[#39ff14] animate-pulse">
                <span className="text-[#ccff00] mr-2">&gt; </span>_
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={`transition-opacity duration-1000 ${renderChildren ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {children}
      </div>
    </div>
  );
};

export default SystemBootLoader;
