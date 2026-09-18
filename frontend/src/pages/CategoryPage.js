import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import properties from '../data/properties.json';
import { isLand, knownNumber, inCategory } from '../lib/property';
const config={apartment:['Апартаменты','Квартиры и пентхаусы для жизни в ритме города'],villa:['Виллы и резиденции','Дома и резиденции в Алматы и предгорьях'],commerce:['Коммерческая недвижимость','Помещения, здания и земельные участки']};
const initial={query:'',district:'',minPrice:'',maxPrice:'',minArea:'',kind:'',sort:'default'};
export default function CategoryPage({category}){
 const [filters,setFilters]=useState(initial);const [open,setOpen]=useState(false);
 const [title,subtitle]=config[category];
 const filterLabels={query:'Поиск',district:'Район',minPrice:'Цена от',maxPrice:'Цена до',minArea:'Площадь от',kind:'Тип'};
 const activeFilters=Object.entries(filters).filter(([key,value])=>key!=='sort'&&value!=='');
 const update=e=>setFilters({...filters,[e.target.name]:e.target.value});
 const results=useMemo(()=>{
  const found=properties.filter(p=>inCategory(p,category)&&!p.hiddenFromCatalog).filter(p=>{
   if(filters.query && !`${p.title} ${p.location}`.toLocaleLowerCase('ru').includes(filters.query.trim().toLocaleLowerCase('ru')))return false;
   if(filters.district&&!p.location.includes(filters.district))return false;
   if(filters.kind==='land'&&!isLand(p))return false;
   if(filters.kind==='house'&&isLand(p))return false;
   if(filters.minPrice!==''&&(!knownNumber(p.price)||p.price<Number(filters.minPrice)))return false;
   if(filters.maxPrice!==''&&(!knownNumber(p.price)||p.price>Number(filters.maxPrice)))return false;
   if(filters.minArea!==''&&(!knownNumber(p.area)||(isLand(p)?p.area*100:p.area)<Number(filters.minArea)))return false;
   return true;
  });
  if(filters.sort!=='default')found.sort((a,b)=>{
   if(!knownNumber(a.price))return knownNumber(b.price)?1:0;
   if(!knownNumber(b.price))return -1;
   return filters.sort==='asc'?a.price-b.price:b.price-a.price;
  });
  return found;
 },[category,filters]);
 return <div className="estate-catalog"><section className="estate-section"><p className="estate-eyebrow"><Link to="/">DARS CAPITAL</Link> / КОЛЛЕКЦИЯ</p><div className="estate-section-heading"><div><h1>{title}</h1><p>{subtitle}</p></div><span className="estate-catalog-count">{properties.filter(p=>inCategory(p,category)&&!p.hiddenFromCatalog).length} объектов</span></div>
 <form className="estate-filters" onSubmit={e=>e.preventDefault()}><div className="estate-search"><Search size={18}/><input aria-label="Поиск по названию или адресу" name="query" value={filters.query} onChange={update} placeholder="Название объекта, улица или район"/><button type="button" className="estate-filter-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="catalog-filters"><SlidersHorizontal size={18}/>Фильтры</button></div>
 <div id="catalog-filters" className={`estate-filter-fields ${open?'is-open':''}`}>
 <label>Район<select name="district" value={filters.district} onChange={update}><option value="">Все районы</option>{['Бостандыкский','Медеуский','Ауэзовский','Алмалинский','Наурызбайский'].map(d=><option key={d}>{d}</option>)}</select></label>
 {category==='commerce'&&<label>Тип объекта<select name="kind" value={filters.kind} onChange={update}><option value="">Все объекты</option><option value="house">Помещения и здания</option><option value="land">Земельные участки</option></select></label>}
 <label>Цена от, ₸<input type="number" min="0" name="minPrice" value={filters.minPrice} onChange={update} placeholder="Без ограничений"/></label><label>Цена до, ₸<input type="number" min="0" name="maxPrice" value={filters.maxPrice} onChange={update} placeholder="Без ограничений"/></label><label>Площадь от, м²<input type="number" min="0" step="any" name="minArea" value={filters.minArea} onChange={update} placeholder="Любая площадь"/></label>
 </div>{filters.minPrice!==''&&filters.maxPrice!==''&&Number(filters.minPrice)>Number(filters.maxPrice)&&<p role="status" className="estate-filter-note">Цена «от» не должна превышать цену «до».</p>}{category==='commerce'&&<p className="estate-filter-note">Площадь участков при поиске пересчитывается в м²: 1 сотка = 100 м².</p>}</form>
 <div className="estate-filter-chips">{activeFilters.map(([key,value])=><button type="button" key={key} onClick={()=>setFilters({...filters,[key]:''})} aria-label={`Убрать фильтр: ${filterLabels[key]}`}><span>{filterLabels[key]}: {key==='kind'?(value==='land'?'Участки':'Помещения и здания'):value}{key.includes('Price')?' ₸':key==='minArea'?' м²':''}</span><X size={14}/></button>)}</div><div className="estate-results-bar"><p aria-live="polite">Найдено: {results.length}</p>{activeFilters.length>0&&<button onClick={()=>setFilters(initial)} type="button">Сбросить фильтры</button>}<label><span className="sr-only">Сортировка</span><select name="sort" value={filters.sort} onChange={update}><option value="default">Порядок коллекции</option><option value="asc">Сначала дешевле</option><option value="desc">Сначала дороже</option></select></label></div>
 {results.length?<div className="estate-grid">{results.map(p=><PropertyCard key={p.id} property={p}/>)}</div>:<div className="estate-empty"><h2>Подходящих объектов пока нет</h2><p>Измените параметры или поручите подбор нашему консультанту.</p><Link to="/contact" className="estate-button">Помочь с подбором</Link></div>}
 </section></div>;
}
