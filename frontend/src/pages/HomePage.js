import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Compass, KeyRound } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import properties from '../data/properties.json';
import { inCategory } from '../lib/property';
const collections=[['Виллы и резиденции','Пространство для вашей жизни','villa','/villas'],['Апартаменты','Город в вашем ритме','apartment','/apartments'],['Коммерческая недвижимость','Адрес для вашего бизнеса','commerce','/commerce']];
export default function HomePage(){
 const available=properties.filter(p=>!p.hiddenFromCatalog && p.status==='available');
 const featured=['31','79','78'].map(id=>available.find(p=>p.id===id)).filter(Boolean);
 return <div className="estate-home">
  <section className="estate-hero">
   <img src={available.find(p=>p.id==='31')?.images[0]} alt="Резиденция в предгорьях Алматы из коллекции DARS CAPITAL" fetchPriority="high"/>
   <div className="estate-hero-shade"/>
   <div className="estate-hero-content"><p className="estate-eyebrow">DARS CAPITAL · Алматы</p><h1>Превращаем мечту<br/>в адрес</h1><p className="estate-hero-copy">Ознакомьтесь с предложениями</p><div className="estate-actions"><Link to="/villas" className="estate-button">Виллы</Link><Link to="/apartments" className="estate-button">Апартаменты</Link><Link to="/commerce" className="estate-button">Коммерция</Link></div></div>
   <div className="estate-hero-caption"><span>01 / КОЛЛЕКЦИЯ DARS CAPITAL</span><Link to="/property/31">Резиденция в предгорьях Алматы <ArrowUpRight size={16}/></Link></div>
  </section>
  <section id="collection" className="estate-section"><div className="estate-section-heading"><div><p className="estate-eyebrow">ВАШ СЛЕДУЮЩИЙ АДРЕС</p><h2>Недвижимость с характером</h2></div><p>От городской квартиры до частной резиденции.<br/>Выберите пространство под свой образ жизни.</p></div><div className="estate-collections">{collections.map(([title,subtitle,type,url],i)=><Link to={url} key={type}><span className="estate-collection-number">0{i+1}</span><h3>{title}</h3><p>{subtitle}</p><span className="estate-collection-footer">{available.filter(p=>inCategory(p,type)).length} в коллекции <ArrowUpRight size={22}/></span></Link>)}</div></section>
  <section className="estate-section estate-featured"><div className="estate-section-heading"><div><p className="estate-eyebrow">В ФОКУСЕ</p><h2>Знакомство начинается здесь</h2></div><Link to="/villas" className="estate-text-link">Коллекция резиденций <ArrowUpRight size={18}/></Link></div><div className="estate-grid">{featured.map(p=><PropertyCard key={p.id} property={p}/>)}</div></section>
  <section className="estate-service"><div><p className="estate-eyebrow">ЛИЧНЫЙ ПОДХОД</p><h2>Ваши приоритеты.<br/>Наша точка отсчёта.</h2><p>Поможем сравнить объекты, организовать просмотры и пройти путь от первого знакомства до передачи ключей.</p><Link to="/about" className="estate-text-link">О DARS CAPITAL <ArrowUpRight size={18}/></Link></div><div className="estate-service-steps">{[[Compass,'Подбор по вашим критериям','Район, архитектура, планировка и бюджет — начинаем с того, что важно вам.'],[ShieldCheck,'Внимание к деталям','Уточняем характеристики и условия, чтобы у вас была основа для взвешенного решения.'],[KeyRound,'Сопровождение сделки','Координируем просмотры, переговоры и следующие шаги с персональным консультантом.']].map(([Icon,title,copy])=><article key={title}><Icon size={24}/><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>
  <section className="estate-section estate-contact"><p className="estate-eyebrow">НАЧНЁМ С РАЗГОВОРА</p><h2>Каким вы видите свой новый адрес?</h2><p>Расскажите о своих планах. Мы поможем найти подходящие варианты.</p><Link to="/contact" className="estate-button">Получить персональный подбор <ArrowUpRight size={18}/></Link></section>
 </div>;
}
