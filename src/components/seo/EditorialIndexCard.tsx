import { Link } from 'react-router-dom';

interface EditorialIndexCardProps {
  to: string;
  kicker?: string;
  title: string;
  description?: string;
  metaLine?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export function EditorialIndexCard({
  to,
  kicker,
  title,
  description,
  metaLine,
  imageSrc,
  imageAlt,
}: EditorialIndexCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col overflow-hidden rounded-sm border border-sage-200 bg-white transition-colors hover:border-sage-300 hover:ring-1 hover:ring-sage-200"
    >
      {imageSrc && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-sage-50">
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {kicker && (
          <span className="editorial-kicker mb-3 inline-block border-b border-sage-100 pb-1 text-sage-700">
            {kicker}
          </span>
        )}
        <h2 className="font-display text-xl font-bold text-stone-900 group-hover:text-sage-800">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {description}
          </p>
        )}
        {metaLine && (
          <div className="mt-auto pt-4 text-sm text-stone-600">
            {metaLine}
          </div>
        )}
      </div>
    </Link>
  );
}
