import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PropertyMetadata({property}) {
 const {pathname}=useLocation();
 useEffect(()=>{
  const previousTitle=document.title;
  document.title=property.title+' | DARS CAPITAL';
  const restore=[];
  const set=(selector,attributes,key,value)=>{
   let element=document.head.querySelector(selector);
   const existing=!!element;
   if(!element){element=document.createElement(selector.startsWith('link')?'link':'meta');Object.entries(attributes).forEach(([k,v])=>element.setAttribute(k,v));document.head.appendChild(element);}
   const previous=element.getAttribute(key);
   element.setAttribute(key,value);
   restore.push(()=>{if(!existing)element.remove();else if(previous===null)element.removeAttribute(key);else element.setAttribute(key,previous);});
  };
  const description=property.seo_description || property.short_description;
  set('meta[name="description"]',{name:'description'},'content',description);
  set('link[rel="canonical"]',{rel:'canonical'},'href','https://dars-capital.kz'+pathname);
  for(const [name,value] of [['og:title',property.title],['og:description',description],['og:url','https://dars-capital.kz'+pathname],['og:image',property.images?.[0]]]){
   if(value)set('meta[property="'+name+'"]',{property:name},'content',value);
  }
  for(const [name,value] of [['twitter:title',property.title],['twitter:description',description]])set('meta[name="'+name+'"]',{name},'content',value);
  return ()=>{document.title=previousTitle;restore.forEach(fn=>fn());};
 },[property,pathname]);
 return null;
}
