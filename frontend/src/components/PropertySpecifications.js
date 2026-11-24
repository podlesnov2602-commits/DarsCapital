import React from 'react';
import { specifications, additionalSpecifications } from '../lib/property';

export default function PropertySpecifications({property, additional=false}) {
 const values=additional ? additionalSpecifications(property) : specifications(property);
 if(!values.length)return null;
 return <section className="estate-specifications" aria-label={additional?'Дополнительные характеристики':'Основные характеристики'}>
  <h2>{additional?'Дополнительные характеристики':'Основные характеристики'}</h2>
  <dl>{values.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
 </section>;
}
