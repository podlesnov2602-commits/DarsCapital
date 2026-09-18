import { briefFacts, specifications, formatPrice, isRental } from './property';
import properties from '../data/properties.json';
test('all 48 properties share description sections and valid display values',()=>{
 expect(properties).toHaveLength(48);
 for(const p of properties){
  expect(p.description_sections.map(s=>s.title)).toEqual(['Об объекте','Планировка и оснащение','Территория и инфраструктура','Расположение']);
  expect(specifications(p).every(([label,value])=>label && value && !/undefined|null|NaN/.test(value))).toBe(true);
  expect(briefFacts(p).join(' ')).not.toMatch(/null|undefined|NaN|(?:^|\s)0 комн/);
 }
});
test('land uses сотки without room count or duplicate plot',()=>{
 const p=properties.find(p=>p.id==='68');
 expect(briefFacts(p)).toEqual(['23 сот.']);
 expect(specifications(p).filter(([k])=>k==='Площадь участка')).toHaveLength(1);
 expect(specifications(p).some(([k])=>k==='Комнаты')).toBe(false);
});
test('unknown prices and rooms are not invented',()=>{
 expect(formatPrice(null)).toBe('Цена по запросу');
 expect(formatPrice(0)).toBe('Цена по запросу');
 expect(specifications(properties.find(p=>p.id==='80'))).toContainEqual(['Комнаты','Уточняется']);
});
test('rental price includes monthly period',()=>{
 const p=properties.find(p=>p.id==='63');
 expect(isRental(p)).toBe(true);
 expect(formatPrice(2400000,true)).toMatch(/₸ \/ мес\./);
});

