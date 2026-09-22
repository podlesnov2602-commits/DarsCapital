export const number = value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value);
export const knownNumber = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
export const isLand = p => /^сот/.test(p.area_unit || '');
export const isRental = p => /аренд/i.test(p.status_label || '') || (p.features || []).some(f => /^Аренда:/.test(f));
export const formatPrice = (price, rental = false) => knownNumber(price) ? `${number(price)} ₸${rental ? ' / мес.' : ''}` : 'Цена по запросу';
export const formatArea = p => knownNumber(p.area) ? `${number(p.area)} ${p.area_unit || 'м²'}` : 'Уточняется';
export const typeLabel = p => isLand(p) ? 'Земельный участок' : p.type_label || ({villa:'Дом', apartment:'Апартаменты', commerce:'Коммерческая недвижимость'}[p.type] || 'Недвижимость');
export const statusLabel = p => p.status_label || (p.status === 'available' ? (isRental(p) ? 'В аренду' : 'В продаже') : p.status === 'sold' ? 'Продано' : 'Статус уточняется');
export function specifications(p) {
 const rows = [['Тип объекта',typeLabel(p)], ['Формат сделки',isRental(p) ? 'Аренда' : 'Продажа'], ['Стоимость',formatPrice(p.price,isRental(p))], [isLand(p) ? 'Площадь участка' : 'Площадь объекта',formatArea(p)]];
 if (!isLand(p) && p.type !== 'commerce') rows.push(['Комнаты',knownNumber(p.rooms) ? number(p.rooms) : 'Уточняется']);
 if (!isLand(p) && (p.type === 'villa' || p.plot_size)) rows.push(['Площадь участка',p.plot_label || (knownNumber(p.plot_size) ? `${number(p.plot_size)} сот.` : 'Уточняется')]);
 if (p.type === 'apartment' || p.floor) rows.push(['Этаж',p.floor ? String(p.floor).replace('/', ' из ') : 'Уточняется']);
 if (p.ceiling_height) rows.push(['Высота потолков',`${number(p.ceiling_height)} м`]);
 if (p.location) rows.push(['Адрес',p.location]);
 rows.push(['Статус',statusLabel(p)]);
 return rows;
}
export function briefFacts(p) {
 return [formatArea(p), !isLand(p) && knownNumber(p.rooms) ? `${number(p.rooms)} комн.` : null, !isLand(p) && knownNumber(p.plot_size) ? `${number(p.plot_size)} сот.` : null].filter(Boolean);
}

export const inCategory = (p, category) => isLand(p) ? category === "commerce" : p.type === category;
