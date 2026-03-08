import { useEffect, useMemo, useState, type ComponentType, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import { cn } from '@/lib/utils';

type MotionLikeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
};

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  placeholderClassName?: string;
  fallbackClassName?: string;
  enableMotion?: boolean;
}

async function loadMotionImage(): Promise<ComponentType<MotionLikeImageProps> | null> {
  try {
    const dynamicImport = new Function('modulePath', 'return import(modulePath);') as (modulePath: string) => Promise<unknown>;
    const motionModule = await dynamicImport('framer-motion') as {
      motion?: { img?: ComponentType<MotionLikeImageProps> };
    };

    return motionModule.motion?.img ?? null;
  } catch {
    return null;
  }
}

export function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  placeholderClassName,
  fallbackClassName,
  enableMotion = true,
  onLoad,
  onError,
  ...imgProps
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [MotionImg, setMotionImg] = useState<ComponentType<MotionLikeImageProps> | null>(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    let active = true;

    if (!enableMotion || typeof window === 'undefined') {
      return;
    }

    void loadMotionImage().then((component) => {
      if (active && component) {
        setMotionImg(() => component);
      }
    });

    return () => {
      active = false;
    };
  }, [enableMotion]);

  const sharedImageProps = useMemo(
    () => ({
      src,
      alt,
      className: cn(
        'h-full w-full object-cover transition-[opacity,filter,transform] duration-500 ease-out',
        isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-[1.02]',
        className
      ),
      onLoad: (event: SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoaded(true);
        onLoad?.(event);
      },
      onError: (event: SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        onError?.(event);
      },
      ...imgProps,
    }),
    [src, alt, className, isLoaded, onLoad, onError, imgProps]
  );

  const shouldShowImage = Boolean(src) && !hasError;
  const shouldShowPlaceholder = !isLoaded && !hasError;

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden bg-stone-200',
        wrapperClassName
      )}
      aria-busy={shouldShowPlaceholder}
    >
      {shouldShowImage && MotionImg ? (
        <MotionImg
          {...sharedImageProps}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      ) : null}

      {shouldShowImage && !MotionImg ? (
        <img {...sharedImageProps} />
      ) : null}

      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 transition-opacity duration-300',
          shouldShowPlaceholder ? 'animate-pulse opacity-100' : 'opacity-0',
          placeholderClassName
        )}
      />

      {!shouldShowImage && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-200 to-stone-100',
            fallbackClassName
          )}
        />
      )}
    </div>
  );
}
