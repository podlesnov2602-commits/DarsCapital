import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowRight, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import { Button } from '../components/ui/button';
import propertiesData from '../data/properties.json';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreenGalleryOpen, setIsFullscreenGalleryOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const foundProperty = propertiesData.find(p => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
      setActiveImage(0);
      setIsFullscreenGalleryOpen(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isFullscreenGalleryOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreenGalleryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenGalleryOpen]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-primary mb-4">Объект не найден</h2>
          <Link to="/">
            <Button variant="outline">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('kk-KZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' ₸';
  };

  const propertyTypeConfig = {
    apartment: { label: 'Апартаменты', path: '/apartments' },
    villa: { label: 'Вилла', path: '/villas' },
    commerce: { label: 'Коммерция', path: '/commerce' },
  };

  const currentPropertyType = propertyTypeConfig[property.type] || { label: 'Объект', path: '/apartments' };
  const formatArea = (item) => `${item.area} ${item.area_unit || 'м²'}`;

  const similarProperties = propertiesData
    .filter(p => p.type === property.type && p.id !== property.id)
    .slice(0, 3);

  const goToPreviousImage = () => {
    setActiveImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 40;

    if (swipeDistance > minSwipeDistance) {
      goToNextImage();
    }

    if (swipeDistance < -minSwipeDistance) {
      goToPreviousImage();
    }

    setTouchStartX(null);
  };

  return (
    <div className="w-full pt-20 bg-white">
      {/* Gallery Section */}
      <section className="bg-muted pb-12 pt-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Image */}
            <div
              className="lg:col-span-9 h-[400px] md:h-[600px] relative overflow-hidden group cursor-pointer"
              onClick={() => setIsFullscreenGalleryOpen(true)}
            >
              <img
                src={property.images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 px-4 py-1 text-xs uppercase tracking-wider font-semibold">
                {property.status === 'available' ? 'В продаже' : 'Продано'}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="lg:col-span-3 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto h-auto lg:h-[600px] pb-4 lg:pb-0 scrollbar-hide">
              {property.images.map((img, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-32 lg:w-full h-24 lg:h-[140px] cursor-pointer border-2 transition-all ${
                    activeImage === index ? 'border-accentblue opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isFullscreenGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black">
          <button
            type="button"
            onClick={() => setIsFullscreenGalleryOpen(false)}
            className="absolute right-4 top-4 z-20 text-white bg-black/40 p-2 rounded-full"
            aria-label="Закрыть фото"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={goToPreviousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 p-2 rounded-full"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={goToNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 p-2 rounded-full"
            aria-label="Следующее фото"
          >
            <ChevronRight size={24} />
          </button>

          <div
            className="w-full h-full flex items-center justify-center"
            onClick={() => setIsFullscreenGalleryOpen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={property.images[activeImage]}
              alt={property.title}
              className="w-full h-full object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
            {activeImage + 1} / {property.images.length}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-2 text-accentblue text-sm uppercase tracking-widest font-semibold">
                <span>{currentPropertyType.label}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif text-primary mb-6 leading-tight">
                {property.title}
              </h1>

              <div className="flex items-center text-muted-foreground mb-10 text-lg">
                <MapPin size={20} className="text-accentblue mr-2" />
                {property.location}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border mb-12">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Площадь</div>
                  <div className="text-2xl font-medium text-primary">
                    {formatArea(property)}
                  </div>
                </div>
                {property.type !== 'commerce' && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Комнаты</div>
                    <div className="text-2xl font-medium text-primary">{property.rooms}</div>
                  </div>
                )}
                {property.plot_size && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Участок</div>
                    <div className="text-2xl font-medium text-primary">{property.plot_size} сот.</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-12">
                <h3 className="text-2xl font-serif text-primary mb-6">Описание</h3>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-12 bg-muted p-8">
                  <h3 className="text-2xl font-serif text-primary mb-6">Характеристики</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={20} className="text-accentblue mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/85">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-2xl font-serif text-primary mb-6">Yandex Maps</h3>
                <GoogleMapEmbed
                  title={property.title}
                  location={property.location}
                  mapUrl={property.map_url}
                  heightClassName="h-80"
                />
              </div>

            </div>

            {/* Right Column - Sidebar / Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 md:top-28 bg-white border border-border p-5 sm:p-8 shadow-[0_18px_36px_rgba(15,31,58,0.12)]">
                <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Стоимость</div>
                <div className="text-3xl sm:text-4xl font-serif text-primary mb-8">
                  {formatPrice(property.price)}
                </div>

                <div className="space-y-4 mb-8">
                  <a href={`https://wa.me/77077157249?text=Здравствуйте! Интересует объект "${property.title}" `} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-none py-6 uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_10px_24px_rgba(37,211,102,0.35)]">
                      Написать в WhatsApp
                    </Button>
                  </a>
                </div>

                <div className="border-t border-border pt-8">
                  <h4 className="text-xl font-serif text-primary mb-6">Связаться с консультантом</h4>
                  <a href="tel:+77077157249" className="block w-full">
                    <Button className="w-full rounded-none py-6 uppercase tracking-widest text-sm transition-all duration-300 bg-accentblue text-white hover:bg-accentblue-hover shadow-[0_10px_24px_rgba(23,92,211,0.28)]">
                      Позвонить
                    </Button>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mb-12 flex flex-col md:flex-row gap-4 md:gap-0 justify-between md:items-end">
              <div>
                <h2 className="text-3xl font-serif text-primary mb-2">Похожие объекты</h2>
                <div className="w-16 h-px bg-border"></div>
              </div>
              <Link to={currentPropertyType.path} className="hidden md:flex items-center text-sm uppercase tracking-widest font-semibold text-accentblue hover:text-accentblue-hover transition-colors">
                Смотреть все <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map(simProp => (
                <Link
                  key={simProp.id}
                  to={`/property/${simProp.id}`}
                  className="group bg-white flex flex-col h-full shadow-[0_8px_24px_rgba(15,31,58,0.07)] hover:shadow-[0_18px_36px_rgba(15,31,58,0.14)] transition-shadow duration-500 overflow-hidden"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={simProp.images[0]}
                      alt={simProp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-serif text-primary mb-2 line-clamp-1">{simProp.title}</h3>
                    <div className="text-sm text-muted-foreground mb-4">{simProp.location}</div>
                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <div className="text-lg font-medium text-primary">{formatPrice(simProp.price)}</div>
                      <div className="text-xs text-muted-foreground">
                        {simProp.type === 'commerce'
                          ? formatArea(simProp)
                          : `${formatArea(simProp)}${simProp.plot_size ? ` • участок ${simProp.plot_size} сот.` : ''}`}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link to={currentPropertyType.path}>
                <Button variant="outline" className="w-full border-accentblue text-accentblue hover:bg-accentblue hover:text-white">
                  Смотреть все
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetail;
