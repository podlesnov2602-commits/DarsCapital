import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { briefFacts, formatPrice, isRental, typeLabel, statusLabel } from '../lib/property';
export default function PropertyCard({ property: p }) {
 return <Link to={`/property/${p.id}`} className="estate-card">
  <div className="estate-card-image"><img src={p.images?.[0]} alt={p.title} loading="lazy" decoding="async" /><span className="estate-photo-count">{p.images?.length || 0} фото</span><span className="estate-status">{statusLabel(p)}</span></div>
  <div className="estate-card-body"><p className="estate-eyebrow">{typeLabel(p)}</p><h3>{p.title}</h3>{p.location && <p className="estate-location"><MapPin size={14}/>{p.location}</p>}
  <p className="estate-card-price">{formatPrice(p.price,isRental(p))}</p><div className="estate-facts">{briefFacts(p).map(f=><span key={f}>{f}</span>)}</div>
  <div className="estate-card-bottom"><span>Подробнее об объекте</span><ArrowUpRight size={20} aria-hidden="true"/></div></div>
 </Link>;
}
