import React, { useMemo } from 'react';

const GoogleMapEmbed = ({
  title,
  location,
  mapUrl: mapUrlProp,
  className = '',
  heightClassName = 'h-80',
  compact = false,
}) => {
  const searchQuery = useMemo(() => {
    const raw = [title, location, 'Алматы'].filter(Boolean).join(', ');
    return encodeURIComponent(raw);
  }, [title, location]);

  const defaultOpenUrl = `https://yandex.ru/maps/?text=${searchQuery}`;
  const openUrl = mapUrlProp || defaultOpenUrl;
  const embedUrl = mapUrlProp && mapUrlProp.includes('yandex.')
    ? mapUrlProp
    : `https://yandex.ru/map-widget/v1/?text=${searchQuery}`;

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="overflow-hidden border border-border bg-muted/40">
          <iframe
            title={`Яндекс Карты: ${title}`}
            src={embedUrl}
            className={`w-full ${heightClassName}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-xs uppercase tracking-wider text-accentblue hover:text-accentblue-hover"
        >
          Открыть в Яндекс Карты
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="overflow-hidden border border-border bg-muted/40">
        <iframe
          title={`Яндекс Карты: ${title}`}
          src={embedUrl}
          className={`w-full ${heightClassName}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-3">
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm uppercase tracking-wider text-accentblue hover:text-accentblue-hover"
        >
          Открыть в Яндекс Карты
        </a>
      </div>
    </div>
  );
};

export default GoogleMapEmbed;
