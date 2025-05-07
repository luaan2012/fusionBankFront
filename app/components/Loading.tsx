import React from 'react';

type SpinnerType = 'circle' | 'dots' | 'bars' | 'ring' | 'pulse' | 'wave' | 'loading' | 'carregando' | 'carregando-barra' | 'ripple' | 'square' | 'orbit';
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type AnimationSpeed = 'slow' | 'normal' | 'fast';

interface SpinnerProps {
  type?: SpinnerType;
  size?: SpinnerSize;
  color?: string;
  speed?: AnimationSpeed;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 text-sm',
  md: 'w-6 h-6 text-base',
  lg: 'w-8 h-8 text-lg',
  xl: 'w-12 h-12 text-2xl',
};

const speedStyles: Record<AnimationSpeed, string> = {
  slow: 'animate-[spin_1.5s_linear_infinite]',
  normal: 'animate-[spin_1s_linear_infinite]',
  fast: 'animate-[spin_0.5s_linear_infinite]',
};

const Spinner: React.FC<SpinnerProps> = ({
  type = 'circle',
  size = 'sm',
  color = 'text-blue-500 dark:text-blue-400',
  speed = 'normal',
  className = '',
}) => {
  const baseSize = sizeStyles[size];
  const animationSpeed = speedStyles[speed];
  const baseClasses = `inline-block ${baseSize} ${color} ${className}`;

  if (type === 'circle') {
    return (
      <div
        className={`${baseClasses} ${animationSpeed} rounded-full border-4 border-solid border-current border-r-transparent`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`${baseClasses} flex space-x-1`} role="status">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1/3 h-1/3 bg-current rounded-full animate-bounce"
            style={{ animationDuration: speed === 'slow' ? '0.8s' : speed === 'fast' ? '0.3s' : '0.5s', animationDelay: `${i * (speed === 'slow' ? 0.2 : speed === 'fast' ? 0.05 : 0.1)}s` }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'bars') {
    return (
      <div className={`${baseClasses} flex space-x-1`} role="status">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1/4 h-full bg-current animate-pulse"
            style={{ animationDuration: speed === 'slow' ? '1.2s' : speed === 'fast' ? '0.6s' : '0.9s', animationDelay: `${i * (speed === 'slow' ? 0.2 : speed === 'fast' ? 0.05 : 0.1)}s` }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'ring') {
    return (
      <div
        className={`${baseClasses} ${animationSpeed} rounded-full border-2 border-solid border-current border-t-transparent border-b-transparent`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div
        className={`${baseClasses} animate-pulse`}
        style={{ animationDuration: speed === 'slow' ? '1.5s' : speed === 'fast' ? '0.7s' : '1s' }}
        role="status"
      >
        <div className="w-full h-full bg-current rounded-full" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'wave') {
    return (
      <div className={`${baseClasses} flex space-x-1`} role="status">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-1/5 h-full bg-current animate-[wave_0.8s_ease-in-out_infinite]"
            style={{ animationDuration: speed === 'slow' ? '1.2s' : speed === 'fast' ? '0.5s' : '0.8s', animationDelay: `${i * (speed === 'slow' ? 0.15 : speed === 'fast' ? 0.05 : 0.1)}s` }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'loading') {
    return (
      <div className={`${baseClasses} flex items-center justify-center`} role="status">
        <div className="relative">
          <div className={`${animationSpeed} absolute w-full h-full border-3 border-current border-dashed rounded-full`}></div>
          <span className="text-center text-current font-semibold">Loading</span>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'carregando') {
    return (
      <div className={`${baseClasses} flex items-center justify-center`} role="status">
        <div className="relative flex items-center">
          <div className={`${animationSpeed} w-1/2 h-1/2 border-2 border-current rounded-full`}></div>
          <span className="ml-2 text-current font-semibold">Carregando...</span>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'carregando-barra') {
    return (
      <div className={`${baseClasses} flex flex-col items-center`} role="status">
        <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-current animate-[progress_2s_ease-in-out_infinite]"
            style={{ animationDuration: speed === 'slow' ? '3s' : speed === 'fast' ? '1s' : '2s' }}
          ></div>
        </div>
        <span className="mt-1 text-current font-semibold">Carregando...</span>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'ripple') {
    return (
      <div className={`${baseClasses} relative`} role="status">
        <div
          className="absolute w-full h-full bg-current rounded-full animate-[ripple_1.2s_ease-in-out_infinite]"
          style={{ animationDuration: speed === 'slow' ? '1.8s' : speed === 'fast' ? '0.8s' : '1.2s', opacity: 0.5 }}
        ></div>
        <div
          className="absolute w-full h-full bg-current rounded-full animate-[ripple_1.2s_ease-in-out_infinite]"
          style={{ animationDuration: speed === 'slow' ? '1.8s' : speed === 'fast' ? '0.8s' : '1.2s', animationDelay: speed === 'slow' ? '0.9s' : speed === 'fast' ? '0.4s' : '0.6s' }}
        ></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'square') {
    return (
      <div
        className={`${baseClasses} ${animationSpeed} border-4 border-current transform rotate-45`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === 'orbit') {
    return (
      <div className={`${baseClasses} relative`} role="status">
        <div
          className="absolute w-1/3 h-1/3 bg-current rounded-full animate-[orbit_1.5s_linear_infinite]"
          style={{ animationDuration: speed === 'slow' ? '2s' : speed === 'fast' ? '1s' : '1.5s' }}
        ></div>
        <div
          className="absolute w-1/3 h-1/3 bg-current rounded-full animate-[orbit_1.5s_linear_infinite]"
          style={{ animationDuration: speed === 'slow' ? '2s' : speed === 'fast' ? '1s' : '1.5s', animationDelay: speed === 'slow' ? '1s' : speed === 'fast' ? '0.5s' : '0.75s' }}
        ></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return null;
};

export default Spinner;