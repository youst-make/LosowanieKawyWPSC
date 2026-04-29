import Justyna from '../../imports/Justyna/Justyna';
import Tomasz from '../../imports/Tomasz/Tomasz';
import Krzysztof from '../../imports/Krzysztof/Krzysztof';
import Marta from '../../imports/Marta/Marta';
import Iza from '../../imports/Iza/Iza';
import Marcin from '../../imports/Marcin/Marcin';

interface AvatarProps {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

const AVATAR_COMPONENTS: Record<string, React.ComponentType> = {
  'Justyna': Justyna,
  'Tomasz': Tomasz,
  'Krzysztof': Krzysztof,
  'Marta': Marta,
  'Iza': Iza,
  'Marcin': Marcin,
};

export function Avatar({ name, size = 'medium', className = '' }: AvatarProps) {
  const sizeConfig = {
    small: { className: 'w-8 h-8', scale: 0.4, fontSize: 'text-xs' },
    medium: { className: 'w-12 h-12', scale: 0.55, fontSize: 'text-sm' },
    large: { className: 'w-24 h-24', scale: 1.1, fontSize: 'text-2xl' },
    xlarge: { className: 'w-40 h-40', scale: 1.8, fontSize: 'text-5xl' },
  };

  const config = sizeConfig[size];
  const AvatarComponent = AVATAR_COMPONENTS[name];

  if (AvatarComponent) {
    return (
      <div className={`${config.className} overflow-hidden rounded-full relative flex items-center justify-center ${className}`}>
        <div
          className="absolute"
          style={{
            transform: `scale(${config.scale})`,
            transformOrigin: 'center center',
            width: '103px',
            height: '103px',
            left: '50%',
            top: '50%',
            marginLeft: '-51.5px',
            marginTop: '-51.5px',
          }}
        >
          <AvatarComponent />
        </div>
      </div>
    );
  }

  // Fallback - kolorowy avatar z inicjałami
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getColorFromName = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={`${config.className} rounded-full ${getColorFromName(name)} flex items-center justify-center text-white font-bold ${config.fontSize} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
