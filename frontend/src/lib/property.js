export const number = value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value);
export const knownNumber = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
export const isLand = p => /^сот/.test(p.area_unit || '');
export const isRental = p => p.transaction_type === 'rent' || /аренд/i.test(p.status_label || '') || (p.features || []).some(f => /^Аренда:/.test(f));
export const formatPrice = (price, rental = false) => knownNumber(price) ? number(price)+' ₸'+(rental ? ' / мес.' : '') : 'Цена по запросу';
export const formatArea = p => knownNumber(p.area) ? number(p.area)+' '+(p.area_unit || 'м²') : '';
export const areaInSquareMetres = p => knownNumber(p.area) ? p.area * (isLand(p) ? 100 : p.area_unit === 'га' ? 10000 : 1) : null;
export const typeLabel = p => isLand(p) ? 'Участок' : ({villa:'Дом', apartment:'Квартира', commerce:'Коммерция'}[p.type] || 'Недвижимость');
export const statusLabel = p => p.status_label || (p.status === 'available' ? (isRental(p) ? 'Аренда' : 'В продаже') : p.status === 'sold' ? 'Продано' : '');
const visible = value => value !== null && value !== undefined && value !== false && value !== 0 && String(value).trim() !== '' && !/^(null|undefined|NaN|0|Уточняется)$/i.test(String(value));
const display = value => typeof value === 'number' ? number(value) : String(value).replace(/—|–/g,'-').trim();
const unit = (value, suffix) => knownNumber(value) ? number(value)+' '+suffix : null;
const rows = values => values.filter(([,v])=>visible(v)).map(([k,v])=>[k,display(v)]);
const material = value => value ? String(value).replace(/^Монолитный$/i,'Монолит').replace(/^Кирпичный$/i,'Кирпич') : null;
const condition = value => value ? String(value).replace(/^(Свежий ремонт|Аккуратный ремонт|Не новый, но аккуратный ремонт)$/i,'С ремонтом').replace(/^(Новый )?Дизайнерский ремонт/i,'С ремонтом') : null;

// The schema supplements legacy facts without mutating them or inferring missing values.
export function specifications(p) {
 const a=p.catalog_attributes || {};
 const floor=String(p.floor || '').split('/');
 return rows([
  ['Тип недвижимости',typeLabel(p)], ['Расположение',p.location],
  ['Формат сделки',isRental(p)?'Аренда':'Продажа'],
  ['Жилой комплекс',a.complex],
  [isLand(p)?'Площадь участка':'Общая площадь',formatArea(p)],
  ['Количество комнат',!isLand(p)&&p.type!=='commerce'&&knownNumber(p.rooms)?p.rooms:null],
  ['Этаж',a.floor || floor[0]], ['Этажность здания',a.building_floors || floor[1]],
  ['Количество этажей',a.levels || (knownNumber(p.floors)?p.floors:null)],
  ['Год постройки',(a.year || p.year_built) ? String(a.year || p.year_built) : null],
  ['Высота потолков',a.ceiling || unit(p.ceiling_height,'м')],
  ['Состояние',condition(a.condition || p.condition)],
  ['Материал здания',material(a.material || p.building_type)],
 ]);
}
export function additionalSpecifications(p) {
 const a=p.catalog_attributes || {};
 return rows([
  ['Площадь участка',!isLand(p)?unit(p.plot_size,'сот.'):null],
  ['Назначение участка',a.land_use], ['ПДП',a.planning], ['Делимость участка',a.division],
  ['Рельеф',a.terrain], ['Подъезд',a.access], ['Геология',a.geology],
  ['Состав площади',a.area_note], ['Жилая площадь',unit(p.living_area,'м²')],
  ['Площадь кухни',a.kitchen || unit(p.kitchen_area,'м²')],
  ['Количество спален',a.bedrooms || p.bedrooms],
  ['Количество санузлов',a.bathrooms || p.bathrooms || p.bathrooms_label],
  ['Планировка',a.layout], ['Меблировка',a.furnishing], ['Напольное покрытие',a.flooring],
  ['Террасы и балконы',a.terrace], ['Высота атриума',a.atrium], ['Кладовая',a.storage],
  ['Парковка',a.parking || p.parking], ['Назначение помещения',a.purpose], ['Отдельный вход',a.entrance],
  ['Лифт',a.lift], ['Арендопригодная площадь',a.lease_area], ['Договор аренды',a.lease],
  ['Отопление',a.heating], ['Газоснабжение',a.gas], ['Водоснабжение',a.water],
  ['Канализация',a.sewer], ['Электроснабжение',a.power], ['Интернет',a.internet],
  ['Коммуникации',a.utilities], ['Вентиляция',a.ventilation], ['Безопасность',a.security],
  ['Мокрые точки',a.water_points], ['Инженерные стояки',a.risers],
  ['Дополнительные строения',a.guest_house], ['SPA-комплекс',a.spa], ['Сервисные помещения',a.staff],
  ['Количество кухонь',a.kitchens], ['Собственная территория',a.private_land],
  ['Территория вне участка',a.outside_land], ['Панорамный зал',a.hall],
  ['Архитектор',a.architect], ['Ввод в эксплуатацию',a.commissioned ? String(a.commissioned) : null],
  ['Территория карьера',a.quarry], ['Территория под промбазу',a.industrial_land],
  ['Запасы',a.reserves], ['Перспективный ресурс',a.potential], ['Прочность щебня',a.strength],
  ['Истираемость',a.abrasion], ['Морозостойкость',a.frost], ['Лицензия',a.license],
 ]);
}
export function briefFacts(p) {
 return [formatArea(p), !isLand(p) && knownNumber(p.rooms) ? number(p.rooms)+' комн.' : null, !isLand(p) && knownNumber(p.plot_size) ? number(p.plot_size)+' сот.' : null].filter(Boolean);
}
export const inCategory = (p, category) => isLand(p) ? category === 'commerce' : p.type === category;
