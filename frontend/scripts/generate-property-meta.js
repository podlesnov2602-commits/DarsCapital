const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const templatePath = path.join(publicDir, 'index.html');
const propertiesPath = path.join(root, 'src', 'data', 'properties.json');

const SITE_URL = 'https://dars-capital.kz';
const SITE_NAME = 'DarsCapital';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/ddr5ek7jn/image/upload/v1777115922/10_p5mtoq.png';
const DEFAULT_DESCRIPTION = 'DarsCapital — бутик-агентство недвижимости в Алматы. Продажа и аренда квартир, домов, вилл, участков и коммерческой недвижимости.';

const template = fs.readFileSync(templatePath, 'utf8');
const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatPrice = (price) => {
  const number = Number(price);
  return Number.isFinite(number) ? `${new Intl.NumberFormat('ru-RU').format(number)} ₸` : 'Цена по запросу';
};

const formatArea = (property) => property.area ? `${property.area} ${property.area_unit || 'м²'}` : '';

const propertyKind = (property) => {
  if (property.type === 'commerce') return 'коммерческого объекта';
  if (property.type === 'villa') return 'дома';
  if (property.rooms) return `${property.rooms}-комнатной квартиры`;
  return 'объекта недвижимости';
};

const absoluteImageUrl = (image) => {
  if (!image) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;
};

const imageMimeType = (image) => {
  const clean = image.toLowerCase().split('?')[0];
  if (clean.endsWith('.png')) return 'image/png';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.svg')) return 'image/svg+xml';
  return 'image/jpeg';
};

const buildDescription = (property) => [
  `Цена: ${formatPrice(property.price)}`,
  formatArea(property) && `Площадь: ${formatArea(property)}`,
  property.rooms && `Комнат: ${property.rooms}`,
  property.location && `Локация: ${property.location}`,
  property.short_description,
].filter(Boolean).join(' • ');

const buildTitle = (property) => [
  `Продажа ${propertyKind(property)}`,
  formatArea(property),
  property.location,
].filter(Boolean).join(' • ');

const renderMeta = ({ title, description, url, image }) => `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="${imageMimeType(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(title)}" />`;

const injectMeta = (meta) => template
  .replace(/\s*<title>[\s\S]*?<\/title>[\s\S]*?<!-- Fonts -->/, `\n${meta}\n\n    <!-- Fonts -->`)
  .replace(/\n\s*<!-- Open Graph[\s\S]*?<!-- Yandex Maps/, '\n    <!-- Yandex Maps');

for (const property of properties) {
  const image = absoluteImageUrl(property.images && property.images[0]);
  for (const prefix of ['property', 'object']) {
    const url = `${SITE_URL}/${prefix}/${property.id}`;
    const html = injectMeta(renderMeta({
      title: buildTitle(property),
      description: buildDescription(property) || DEFAULT_DESCRIPTION,
      url,
      image,
    }));
    const targetDir = path.join(publicDir, prefix, String(property.id));
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), html);
  }
}

console.log(`Generated static Open Graph pages for ${properties.length} properties.`);
