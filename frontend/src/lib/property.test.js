import { briefFacts, specifications, additionalSpecifications, formatPrice, isRental, inCategory, areaInSquareMetres } from './property';
import properties from '../data/properties.json';
test('every record has unique reviewed content and clean display values',()=>{
 expect(properties).toHaveLength(81);
 for(const key of ['id','title','description','seo_description'])expect(new Set(properties.map(p=>p[key])).size).toBe(properties.length);
 for(const p of properties){
  expect(p.description).toBe(p.description_sections.flatMap(s=>s.paragraphs).join('\n\n'));
  expect(p.description).not.toMatch(/—|₸|тенге|доллар|по предоставлен|согласно имеющимся|предположительно|данные не предоставлены/i);
  const rows=[...specifications(p),...additionalSpecifications(p)];
  expect(new Set(rows.map(([k])=>k)).size).toBe(rows.length);
  expect(rows.every(([label,value])=>label && value && !/undefined|null|NaN|Уточняется/.test(value))).toBe(true);
  expect(briefFacts(p).join(' ')).not.toMatch(/null|undefined|NaN|(?:^|\s)0 комн/);
 }
});
test('unknown fields are omitted instead of represented by zero or placeholders',()=>{
 const rows=specifications({type:'apartment',rooms:0,area:null,ceiling_height:0});
 for(const label of ['Количество комнат','Общая площадь','Этаж','Высота потолков'])expect(rows.some(([k])=>k===label)).toBe(false);
 expect(formatPrice(0)).toBe('Цена по запросу');
});
test('land uses a single area and does not confuse land purpose with size',()=>{
 const p=properties.find(p=>p.id==='68');
 expect(briefFacts(p)).toEqual(['23 сот.']);
 expect([...specifications(p),...additionalSpecifications(p)].filter(([k])=>k==='Площадь участка')).toHaveLength(1);
 expect(additionalSpecifications(p)).toContainEqual(['Назначение участка','ИЖС']);
 expect(inCategory(p,'commerce')).toBe(true);expect(inCategory(p,'villa')).toBe(false);
 expect(areaInSquareMetres(p)).toBe(2300);
 expect(areaInSquareMetres(properties.find(p=>p.id==='97'))).toBe(200000);
});
test('rent is explicit after removing prices from legacy feature text',()=>{
 for(const id of ['63','96'])expect(isRental(properties.find(p=>p.id===id))).toBe(true);
 expect(formatPrice(1455000,true)).toMatch(/₸ \/ мес\./);
 const p=properties.find(p=>p.id==='96');
 for(const option of p.rental_options)expect(option.monthly).toBe(option.area*option.rate);
 expect(p.price).toBe(p.rental_options[0].monthly);
});
test('construction and material caveats remain in the passport',()=>{
 expect(additionalSpecifications(properties.find(p=>p.id==='91'))).toContainEqual(['Назначение участка','ЛПХ']);
 expect(specifications(properties.find(p=>p.id==='105'))).toContainEqual(['Материал здания','Металлокаркас и газоблок']);
 expect(additionalSpecifications(properties.find(p=>p.id==='113'))).toContainEqual(['Канализация','Септик']);
 expect(specifications(properties.find(p=>p.id==='72'))).toContainEqual(['Этаж','7']);
});
