import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Handshake, LockKeyhole, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import propertiesData from '../data/properties.json';

const trustMarkers = [
  '5+ лет в премиальном сегменте Алматы',
  '180+ закрытых и публичных сделок',
  'Полная конфиденциальность на каждом этапе',
  'Юридическое сопровождение на каждом этапе',
];

const advantages = [
  {
    icon: LockKeyhole,
    title: 'Закрытый доступ к лучшим объектам',
    description: 'Предлагаем off-market лоты, которые не публикуются в открытых каталогах и доступны только клиентам DARS CAPITAL.',
  },
  {
    icon: ShieldCheck,
    title: 'Юридическая и финансовая безопасность',
    description: 'Проверяем объекты, структуру собственности и сопровождаем сделку до передачи ключей.',
  },
  {
    icon: Sparkles,
    title: 'Персональный подбор под образ жизни',
    description: 'Формируем short-list недвижимости с учетом сценариев: статусное проживание, инвестиции и капитализация.',
  },
  {
    icon: Handshake,
    title: 'Индивидуальное сопровождение 1:1',
    description: 'Личный консультант, единая коммуникация и организация просмотров в удобное для вас время.',
  },
];

const categories = [
  { title: 'Апартаменты', subtitle: 'Современные резиденции в премиальных ЖК', link: '/apartments' },
  { title: 'Виллы', subtitle: 'Резиденции с участком и приватной инфраструктурой', link: '/villas' },
  { title: 'Коммерция', subtitle: 'Премиальные коммерческие помещения для бизнеса и инвестиций', link: '/commerce' },
];

const process = [
  'Персональная консультация и бриф: задачи, бюджет, приоритеты.',
  'Кураторский подбор 5–7 релевантных объектов, включая off-market.',
  'Организация просмотров и переговоров с собственниками.',
  'Due diligence, структура сделки, юридическое сопровождение.',
  'Подписание и пост-сервис: передача объекта, рекомендации по управлению.',
];

const HomePage = () => {
  const featuredTitles = [
    'Резиденция в предгорьях Алматы',
    'Одноэтажный коттедж рядом с ботаническим садом',
    'Участок 98 соток у Парка Президента',
  ];

  const featured = featuredTitles
    .map((title) => propertiesData.find((property) => property.title === title))
    .filter(Boolean);

  const formatPrice = (price) => `${new Intl.NumberFormat('kk-KZ', { maximumFractionDigits: 0 }).format(price)} ₸`;

  return (
    <div className="bg-[#F5F7FA] text-primary">
      <section className="relative min-h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80"
          alt="Премиальная недвижимость Алматы"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,18,36,0.86),rgba(8,18,36,0.42))]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 md:px-8">
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.24em] text-white">
            <Sparkles size={14} /> DARS CAPITAL · Алматы
          </p>
          <h1 className="max-w-4xl text-4xl font-serif leading-tight text-white md:text-6xl">Превращаем мечту в адрес</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#E4E7EC]">Ознакомтесь с предложениями</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button asChild variant="outline" className="border-white bg-transparent px-8 py-6 text-sm uppercase tracking-[0.18em] text-white hover:bg-white/10 hover:text-white">
              <Link to="/villas">Виллы</Link>
            </Button>
            <Button asChild variant="outline" className="border-white bg-transparent px-8 py-6 text-sm uppercase tracking-[0.18em] text-white hover:bg-white/10 hover:text-white">
              <Link to="/apartments">Апартаменты</Link>
            </Button>
            <Button asChild variant="outline" className="border-white bg-transparent px-8 py-6 text-sm uppercase tracking-[0.18em] text-white hover:bg-white/10 hover:text-white">
              <Link to="/commerce">Коммерция</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-3 text-sm text-[#E9EDF2] md:grid-cols-2">
            {trustMarkers.map((marker) => (
              <div key={marker} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 text-accentblue" size={16} />
                <span>{marker}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-serif md:text-4xl">Почему клиенты выбирают DARS CAPITAL</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {advantages.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-sm border border-[#E2E8F0] bg-white p-8 shadow-[0_12px_30px_rgba(12,31,64,0.06)]">
              <Icon className="mb-4 text-accentblue" />
              <h3 className="mb-3 text-2xl font-serif">{title}</h3>
              <p className="leading-relaxed text-[#667085]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-serif md:text-4xl">Избранные объекты</h2>
            <Button asChild variant="outline"><Link to="/apartments">Смотреть все</Link></Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featured.map((item) => (
              <Link
                key={item.id}
                to={`/property/${item.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(17,35,67,0.1)]"
              >
                <img src={item.images[0]} alt={item.title} className="h-64 w-full object-cover" loading="lazy" decoding="async" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-accentblue">{item.type === 'villa' ? 'Вилла' : item.type === 'commerce' ? 'Коммерция' : 'Апартаменты'}</p>
                  <h3 className="mt-3 text-2xl font-serif">{item.title}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm text-[#667085]"><MapPin size={14} />{item.location}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#667085]">{item.short_description || item.description}</p>
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <span className="text-lg font-semibold">{formatPrice(item.price)}</span>
                    <span className="inline-flex items-center text-sm text-accentblue transition group-hover:text-accentblue-hover">
                      Подробнее <ArrowRight size={14} className="ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="mb-10 text-center text-3xl font-serif md:text-4xl">Категории недвижимости</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.title} to={category.link} className="group rounded-sm border border-[#DFE6EF] bg-white p-8 transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(17,35,67,0.1)]">
              <p className="text-sm uppercase tracking-[0.18em] text-accentblue">Коллекция</p>
              <h3 className="mt-3 text-3xl font-serif">{category.title}</h3>
              <p className="mt-3 text-[#667085]">{category.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-10 text-center text-3xl font-serif md:text-4xl">Как мы работаем</h2>
          <ol className="mx-auto max-w-4xl space-y-4">
            {process.map((step) => (
              <li key={step} className="flex gap-4 rounded-sm border border-[#E2E8F0] p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accentblue text-sm text-white">{process.indexOf(step) + 1}</span>
                <p className="text-[#475467]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-4 md:px-8">
          {[
            ['5+', 'лет в премиум-сегменте'],
            ['180+', 'успешных сделок'],
            ['65%', 'клиентов по рекомендации'],
            ['24/7', 'персональная поддержка'],
          ].map(([value, label]) => (
            <div key={value} className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-7 text-center">
              <p className="text-4xl font-serif text-accentblue">{value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.12em] text-[#667085]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-8 rounded-sm border border-[#DFE6EF] bg-white p-8 md:grid-cols-[1.2fr_1fr] md:p-10">
          <img
            src="https://res.cloudinary.com/ddr5ek7jn/image/upload/v1773984631/%D0%9A%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B0_pdoing.png?auto=format&fit=crop&w=1200&q=80"
            alt="Команда DARS CAPITAL"
            className="h-full min-h-[320px] w-full rounded-sm object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-accentblue">Команда DARS CAPITAL</p>
            <h2 className="text-3xl font-serif">Мы представляем ваши интересы так, как представили бы свои.</h2>
            <p className="mt-4 leading-relaxed text-[#667085]">Работаем конфиденциально, точечно и на результат. Для нас премиальный сервис — это не обещание, а стандарт в каждой коммуникации и каждой сделке.</p>
            <Button asChild className="mt-6 w-fit bg-accentblue hover:bg-accentblue-hover"><Link to="/about">Познакомиться с командой</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="rounded-sm border border-[#DFE6EF] bg-white px-6 py-14 text-center shadow-[0_16px_36px_rgba(17,35,67,0.08)] md:px-10">
          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-accentblue">Персональный подбор</p>
          <h2 className="text-3xl font-serif md:text-4xl">Получите персональную подборку из лучших объектов Алматы</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[#667085]">В течение дня сформируем стратегию под ваш запрос и предложим релевантные варианты, включая закрытые off-market предложения.</p>
          <Button asChild className="mt-8 bg-accentblue px-8 py-6 uppercase tracking-[0.16em] hover:bg-accentblue-hover"><Link to="/contact">Получить подборку</Link></Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="rounded-sm border border-[#DFE6EF] bg-white p-10 shadow-[0_16px_36px_rgba(17,35,67,0.08)]">
          <h2 className="text-3xl font-serif md:text-4xl">Свяжитесь с нами</h2>
          <p className="mt-4 max-w-3xl text-[#667085]">Укажите цель покупки, бюджет и предпочитаемые районы во время консультации — мы подготовим персональный план сделки.</p>
          <div className="mt-8 space-y-4 text-sm text-[#475467]">
            <p className="flex items-center gap-2"><ShieldCheck size={16} className="text-accentblue" />Конфиденциальность обращения гарантирована.</p>
            <p className="flex items-center gap-2"><BriefcaseBusiness size={16} className="text-accentblue" />Персональный брокер в день обращения.</p>
          </div>
          <Button asChild className="mt-8 bg-accentblue py-6 uppercase tracking-[0.14em] hover:bg-accentblue-hover">
            <Link to="/contact">Перейти к контактам</Link>
          </Button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
