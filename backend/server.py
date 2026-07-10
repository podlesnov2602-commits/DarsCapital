import html
import json
import mimetypes
import re
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT_DIR / "frontend"
BUILD_DIR = FRONTEND_DIR / "build"
PUBLIC_DIR = FRONTEND_DIR / "public"
INDEX_PATH = (
    (BUILD_DIR / "index.html")
    if (BUILD_DIR / "index.html").exists()
    else (PUBLIC_DIR / "index.html")
)
PROPERTIES_PATH = FRONTEND_DIR / "src" / "data" / "properties.json"
SITE_URL = "https://dars-capital.kz"
SITE_NAME = "DARS CAPITAL"
LOCALE = "ru_RU"
DEFAULT_IMAGE = "https://res.cloudinary.com/ddr5ek7jn/image/upload/v1777115922/10_p5mtoq.png"
DEFAULT_TITLE = "DarsCapital | Недвижимость в Алматы"
DEFAULT_DESCRIPTION = (
    "DarsCapital — бутик-агентство недвижимости в Алматы. Продажа и аренда квартир, домов, "
    "вилл, участков и коммерческой недвижимости с профессиональным сопровождением."
)
DEFAULT_KEYWORDS = "DarsCapital, недвижимость Алматы, купить квартиру Алматы, виллы Алматы, участки Алматы"
IMAGE_WIDTH = "1200"
IMAGE_HEIGHT = "630"

app = FastAPI()

if (BUILD_DIR / "static").exists():
    app.mount("/static", StaticFiles(directory=BUILD_DIR / "static"), name="static")


def load_properties() -> list[dict[str, Any]]:
    with PROPERTIES_PATH.open(encoding="utf-8") as properties_file:
        return json.load(properties_file)


def esc(value: Any) -> str:
    return html.escape(str(value or ""), quote=True)


def canonical_url(path: str) -> str:
    clean_path = path if path.startswith("/") else f"/{path}"
    return f"{SITE_URL}{clean_path.rstrip('/') if clean_path != '/' else clean_path}"


def format_price(price: Any) -> str:
    try:
        return f"{int(price):,}".replace(",", " ") + " ₸"
    except (TypeError, ValueError):
        return "Цена по запросу"


def format_area(property_data: dict[str, Any]) -> str:
    if not property_data.get("area"):
        return ""
    return f"{property_data['area']} {property_data.get('area_unit') or 'м²'}"


def city_and_district(location: str) -> tuple[str, str]:
    district = (location or "").split(",")[0].strip()
    return "Алматы", district


def property_kind(property_data: dict[str, Any]) -> str:
    property_type = property_data.get("type")
    rooms = property_data.get("rooms")
    if property_type == "commerce":
        return "коммерческого помещения"
    if property_data.get("plot_size") and property_type not in {"apartment", "villa"}:
        return f"участка {property_data['plot_size']} соток"
    if property_type == "villa":
        return "дома"
    if rooms:
        return f"{rooms}-комнатной квартиры"
    return "объекта недвижимости"


def property_title(property_data: dict[str, Any]) -> str:
    city, district = city_and_district(property_data.get("location", ""))
    parts = [f"Продажа {property_kind(property_data)}"]
    if format_area(property_data):
        parts.append(format_area(property_data))
    if district:
        parts.append(district)
    parts.append(city)
    return " • ".join(parts)


def property_description(property_data: dict[str, Any]) -> str:
    items = [f"Цена: {format_price(property_data.get('price'))}"]
    if format_area(property_data):
        items.append(f"Площадь: {format_area(property_data)}")
    if property_data.get("rooms"):
        items.append(f"Комнат: {property_data['rooms']}")
    if property_data.get("floor"):
        items.append(f"Этаж: {property_data['floor']}")
    city, district = city_and_district(property_data.get("location", ""))
    if district:
        items.append(f"Район: {district}")
    items.append(city)
    if property_data.get("short_description"):
        items.append(property_data["short_description"])
    return " • ".join(items)


def absolute_image_url(image: str) -> str:
    if not image:
        return DEFAULT_IMAGE
    if image.startswith(("http://", "https://")):
        return image
    clean_image = image if image.startswith("/") else f"/{image}"
    return f"{SITE_URL}{clean_image}"


def property_image(property_data: dict[str, Any]) -> str:
    images = property_data.get("images") or []
    return absolute_image_url(images[0]) if images else DEFAULT_IMAGE


def organization_schema() -> dict[str, Any]:
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": DEFAULT_IMAGE,
        "description": DEFAULT_DESCRIPTION,
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+77077157249",
            "contactType": "sales",
        },
    }


def property_schema(property_data: dict[str, Any], url: str) -> list[dict[str, Any]]:
    title = property_title(property_data)
    city, district = city_and_district(property_data.get("location", ""))
    return [
        organization_schema(),
        {
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": title,
            "description": property_description(property_data),
            "url": url,
            "image": property_image(property_data),
            "address": {
                "@type": "PostalAddress",
                "addressLocality": city,
                "addressRegion": district,
                "addressCountry": "KZ",
            },
            "offers": {
                "@type": "Offer",
                "price": property_data.get("price"),
                "priceCurrency": "KZT",
                "availability": "https://schema.org/InStock",
                "url": url,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Residence",
            "name": title,
            "floorSize": {
                "@type": "QuantitativeValue",
                "value": property_data.get("area"),
                "unitText": property_data.get("area_unit") or "m2",
            },
            "numberOfRooms": property_data.get("rooms"),
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Главная",
                    "item": SITE_URL,
                },
                {"@type": "ListItem", "position": 2, "name": title, "item": url},
            ],
        },
    ]


def image_mime_type(image: str) -> str:
    lower_image = image.lower().split("?", 1)[0]
    if lower_image.endswith(".png"):
        return "image/png"
    if lower_image.endswith(".svg"):
        return "image/svg+xml"
    if lower_image.endswith(".webp"):
        return "image/webp"
    return "image/jpeg"


def meta_tags(
    title: str,
    description: str,
    keywords: str,
    url: str,
    image: str,
    schemas: list[dict[str, Any]],
) -> str:
    schema_tags = "\n".join(
        f'<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>'
        for schema in schemas
    )
    return f"""
    <title>{esc(title)}</title>
    <meta name="description" content="{esc(description)}" />
    <meta name="keywords" content="{esc(keywords)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="{esc(url)}" />
    <link rel="icon" href="/favicon.ico" />
    <meta property="og:locale" content="{LOCALE}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="{SITE_NAME}" />
    <meta property="og:title" content="{esc(title)}" />
    <meta property="og:description" content="{esc(description)}" />
    <meta property="og:image" content="{esc(image)}" />
    <meta property="og:image:secure_url" content="{esc(image)}" />
    <meta property="og:image:alt" content="{esc(title)}" />
    <meta property="og:image:width" content="{IMAGE_WIDTH}" />
    <meta property="og:image:height" content="{IMAGE_HEIGHT}" />
    <meta property="og:image:type" content="{image_mime_type(image)}" />
    <meta property="og:url" content="{esc(url)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{esc(title)}" />
    <meta name="twitter:description" content="{esc(description)}" />
    <meta name="twitter:image" content="{esc(image)}" />
    <meta name="twitter:image:alt" content="{esc(title)}" />
    <meta name="twitter:site" content="@darscapital" />
    {schema_tags}
    """


def render_index(meta_html: str) -> str:
    index = INDEX_PATH.read_text(encoding="utf-8")
    # CRA minifies index.html in production, so replace the whole static SEO block
    # from the first <title> up to the font preconnect section in both public and build HTML.
    index = re.sub(
        r"<title>.*?(?=<link\s+rel=[\"']preconnect[\"'])",
        meta_html,
        index,
        count=1,
        flags=re.DOTALL,
    )
    return index.replace("%PUBLIC_URL%", "")


def home_meta(path: str = "/") -> str:
    return meta_tags(
        DEFAULT_TITLE,
        DEFAULT_DESCRIPTION,
        DEFAULT_KEYWORDS,
        canonical_url(path),
        DEFAULT_IMAGE,
        [organization_schema()],
    )


@app.get("/property/{property_id}", response_class=HTMLResponse)
@app.get("/object/{property_id}", response_class=HTMLResponse)
def property_page(property_id: str, request: Request):
    property_data = next(
        (item for item in load_properties() if str(item.get("id")) == property_id), None
    )
    if property_data is None:
        return HTMLResponse(
            "<!doctype html><html lang='ru'><head><title>404 — объект не найден</title><meta name='robots' content='noindex, nofollow'></head><body><h1>404 — объект не найден</h1></body></html>",
            status_code=404,
        )
    url = canonical_url(request.url.path)
    title = property_title(property_data)
    description = property_description(property_data)
    keywords = ", ".join(
        filter(
            None,
            [
                title,
                "DARS CAPITAL",
                "недвижимость Алматы",
                property_data.get("location"),
            ],
        )
    )
    return HTMLResponse(
        render_index(
            meta_tags(
                title,
                description,
                keywords,
                url,
                property_image(property_data),
                property_schema(property_data, url),
            )
        )
    )


@app.get("/{full_path:path}")
def spa(full_path: str, request: Request):
    file_path = (BUILD_DIR if BUILD_DIR.exists() else PUBLIC_DIR) / full_path
    if full_path and file_path.is_file():
        return FileResponse(file_path, media_type=mimetypes.guess_type(file_path)[0])
    return HTMLResponse(render_index(home_meta(request.url.path)))
