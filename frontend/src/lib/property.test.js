import { briefFacts, specifications, formatPrice, isRental } from './property';
import properties from '../data/properties.json';
test('all 48 properties share description sections and valid display values',()=>{
 expect(properties).toHaveLength(48);
 for(const p of properties){
  expect(p.description_sections.map(s=>s.title)).toEqual(['Об объекте','Характеристики и оснащение','Территория и инфраструктура','Расположение']);
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


test('editorial descriptions have four complete sections and synchronized plain text',()=>{
 for(const p of properties){
  expect(p.description_sections.every(s=>s.paragraphs.length===1 && s.paragraphs[0].length>40)).toBe(true);
  expect(p.description).toBe(p.description_sections.map(s=>s.title+'\n\n'+s.paragraphs.join('\n\n')).join('\n\n'));
  expect(p.short_description).toBe(p.description_sections[0].paragraphs[0]);
  expect(p.description).not.toMatch(/🔥|🏡|📍|💰|✔|Не упустите|Звоните|заходи и живи|Подробности уточняются у консультанта/);
 }
});
