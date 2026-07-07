import React, { useEffect, useMemo, useRef, useState } from "react";
import { Shield, Key, Phone, Mail, Instagram } from "lucide-react";
import { Button } from "../components/ui/button";

const AboutPage = () => {
  const statsSectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);

  const stats = useMemo(
    () => [
      { endValue: 10, suffix: "+", label: "Лет на рынке" },
      { endValue: 500, suffix: "+", label: "Сделок" },
      { endValue: 200, suffix: "+", label: "Объектов" },
      { endValue: 98, suffix: "%", label: "Довольных клиентов" },
    ],
    [],
  );

  useEffect(() => {
    const sectionElement = statsSectionRef.current;

    if (!sectionElement || hasAnimated) {
      return undefined;
    }

    const animationDuration = 1800;
    let animationFrameId;

    const startAnimation = () => {
      const animationStartTime = performance.now();

      const tick = (timestamp) => {
        const progress = Math.min(
          (timestamp - animationStartTime) / animationDuration,
          1,
        );
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setAnimatedValues(
          stats.map(({ endValue }) => Math.round(endValue * easedProgress)),
        );

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(tick);
          return;
        }

        setAnimatedValues(stats.map(({ endValue }) => endValue));
        setHasAnimated(true);
      };

      animationFrameId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hasAnimated, stats]);

  return (
    <div className="w-full pt-24 md:pt-28 pb-16 md:pb-20 bg-white">
      {/* Hero Section */}
      <section className="mb-16 md:mb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-6">
              Мы создаем новые стандарты элитной недвижимости
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-10 md:mb-12">
              DARS CAPITAL — это не просто агентство, это закрытый клуб для тех,
              кто ценит свое время, статус и безупречный сервис.
            </p>
            <div className="w-24 h-px bg-border mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsSectionRef}
        className="py-12 md:py-16 bg-muted mb-16 md:mb-24"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {stats.map(({ label, suffix }, index) => (
              <div key={label}>
                <div className="text-4xl md:text-5xl font-serif text-accentblue mb-2">
                  {animatedValues[index]}
                  {suffix}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="mb-16 md:mb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Наш подход"
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-accentblue -z-10 hidden md:block"></div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                Наш подход
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Мы понимаем, что покупка элитной недвижимости — это важное
                жизненное решение. Поэтому мы предлагаем не просто объекты, а
                стиль жизни, соответствующий вашему статусу.
              </p>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Каждый объект в нашем каталоге проходит тщательную проверку. Мы
                гарантируем полную конфиденциальность, юридическую чистоту и
                персональное сопровождение на всех этапах сделки.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                    <Shield size={24} className="text-accentblue" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-primary mb-1">
                      Надежность
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Полная юридическая безопасность
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                    <Key size={24} className="text-accentblue" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-primary mb-1">
                      Эксклюзивность
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Доступ к закрытым продажам
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-4">
              Свяжитесь с нами
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Мы всегда готовы ответить на ваши вопросы и предложить лучшие
              варианты недвижимости
            </p>
            <div className="w-16 h-px bg-border mx-auto mt-8"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white p-5 sm:p-8 md:p-12 shadow-[0_12px_34px_rgba(15,31,58,0.08)]">
            <div>
              <h3 className="text-2xl font-serif text-primary mb-8">
                Контактная информация
              </h3>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-accentblue" />
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                      Телефон / WhatsApp
                    </h4>
                    <a
                      href="tel:+77077157249"
                      className="text-xl font-serif text-primary hover:text-accentblue transition-colors block"
                    >
                      +7 707 715 72 49
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-accentblue" />
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                      Email
                    </h4>
                    <a
                      href="mailto:darscapital@gmail.com"
                      className="text-xl font-serif text-primary hover:text-accentblue transition-colors block"
                    >
                      darscapital@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                  Социальные сети
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/d.darsil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 border border-border flex items-center justify-center text-primary hover:bg-accentblue hover:text-white hover:border-accentblue transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-muted p-8 md:p-10">
              <h3 className="text-2xl font-serif text-primary mb-8">
                Свяжитесь с нами
              </h3>
              <p className="text-primary/80 mb-6">
                Для консультации свяжитесь с нами удобным способом — по
                телефону, WhatsApp или через Instagram.
              </p>
              <div className="space-y-4">
                <a href="tel:+77077157249" className="block">
                  <Button className="w-full bg-accentblue hover:bg-accentblue-hover text-white rounded-none py-6 uppercase tracking-widest text-sm transition-all duration-300">
                    Позвонить
                  </Button>
                </a>
                <a
                  href="https://wa.me/77077157249"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-none py-6 uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_10px_24px_rgba(37,211,102,0.35)]">
                    Написать в WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
