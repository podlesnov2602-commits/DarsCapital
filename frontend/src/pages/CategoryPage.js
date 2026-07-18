import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import propertiesData from '../data/properties.json';

const CategoryPage = ({ category }) => {
  const categoryConfig = {
    apartment: {
      title: 'Апартаменты',
      subtitle: 'Эксклюзивные квартиры в лучших жилых комплексах Алматы',
      label: 'Апартаменты',
    },
    villa: {
      title: 'Виллы',
      subtitle: 'Роскошные загородные резиденции и дома премиум-класса',
      label: 'Вилла',
    },
    commerce: {
      title: 'Коммерция',
      subtitle: 'Премиальные коммерческие помещения для бизнеса и инвестиций',
      label: 'Коммерция',
    },
  };

  const currentCategory = categoryConfig[category] || categoryConfig.apartment;
  const { title, subtitle, label } = currentCategory;

  // Filters State
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minArea: '',
    district: 'all',
    sortOrder: ['villa', 'apartment'].includes(category) ? 'priceDesc' : 'default'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filter Properties
  const filteredProperties = useMemo(() => {
    const categoryProperties = propertiesData.filter(property => property.type === category);

    const filteredCategoryProperties = categoryProperties.filter(property => {
      // Filter by Price
      if (filters.minPrice && property.price < parseInt(filters.minPrice, 10)) return false;
      if (filters.maxPrice && property.price > parseInt(filters.maxPrice, 10)) return false;

      // Filter by Area
      if (filters.minArea && property.area < parseInt(filters.minArea, 10)) return false;

      // Filter by District
      if (filters.district !== 'all' && !property.location.toLowerCase().includes(filters.district.toLowerCase())) {
        return false;
      }

      return true;
    });

    if (filters.sortOrder === 'priceDesc') {
      return [...filteredCategoryProperties].sort((a, b) => b.price - a.price);
    }

    if (filters.sortOrder === 'priceAsc') {
      return [...filteredCategoryProperties].sort((a, b) => a.price - b.price);
    }

    return filteredCategoryProperties;
  }, [category, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatArea = (property) => `${property.area} ${property.area_unit || 'м²'}`;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('kk-KZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' ₸';
  };

  const districts = ['Бостандыкский', 'Медеуский', 'Ауэзовский', 'Алмалинский'];

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minArea: '',
      district: 'all',
      sortOrder: ['villa', 'apartment'].includes(category) ? 'priceDesc' : 'default',
    });
  };

  return (
    <div className="w-full pt-24 md:pt-28 pb-14 md:pb-20 bg-muted min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-4">{title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          <div className="w-16 h-px bg-border mx-auto mt-8"></div>
        </div>

        {/* Filters Toggle Button (Mobile) */}
        <div className="mb-6 flex justify-end md:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            Фильтры
          </Button>
        </div>

        {/* Filters Panel */}
        <div className={`bg-white p-6 md:p-8 shadow-[0_12px_34px_rgba(15,31,58,0.08)] mb-12 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Район</label>
              <select
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                className="w-full border-b-2 border-border py-2 bg-transparent focus:outline-none focus:border-accentblue transition-colors text-primary"
              >
                <option value="all">Все районы</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d} район</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Сортировка</label>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="w-full border-b-2 border-border py-2 bg-transparent focus:outline-none focus:border-accentblue transition-colors text-primary"
              >
                <option value="default">По умолчанию</option>
                <option value="priceDesc">Цена по убыванию</option>
                <option value="priceAsc">Цена по возрастанию</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Мин. Цена (₸)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="От"
                className="w-full border-b-2 border-border py-2 bg-transparent focus:outline-none focus:border-accentblue transition-colors text-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Макс. Цена (₸)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="До"
                className="w-full border-b-2 border-border py-2 bg-transparent focus:outline-none focus:border-accentblue transition-colors text-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Мин. Площадь (м²)</label>
              <input
                type="number"
                name="minArea"
                value={filters.minArea}
                onChange={handleFilterChange}
                placeholder="От"
                className="w-full border-b-2 border-border py-2 bg-transparent focus:outline-none focus:border-accentblue transition-colors text-primary"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={resetFilters}
              variant="ghost"
              className="text-muted-foreground hover:text-primary uppercase text-xs tracking-widest"
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>

        {/* Results Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <h3 className="text-xl font-serif text-primary mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры фильтрации</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {filteredProperties.map(property => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="group bg-white flex flex-col h-full shadow-[0_8px_24px_rgba(15,31,58,0.07)] hover:shadow-[0_18px_36px_rgba(15,31,58,0.14)] transition-shadow duration-500 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                    {property.status_label || (property.status === 'available' ? 'В продаже' : 'Продано')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-accentblue text-xs uppercase tracking-widest mb-3">
                    {categoryConfig[property.type]?.label || 'Объект'}
                  </div>
                  <h3 className="text-xl font-serif text-primary mb-3 line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4 gap-1">
                    <MapPin size={14} className="text-accentblue" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-end">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {property.type === 'commerce'
                          ? formatArea(property)
                          : `${formatArea(property)} • ${property.rooms} комн.${property.plot_size ? ` • участок ${property.plot_size} сот.` : ''}`}
                      </div>
                      <div className="text-lg font-serif font-medium text-primary">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-accentblue group-hover:text-white transition-colors duration-300">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
