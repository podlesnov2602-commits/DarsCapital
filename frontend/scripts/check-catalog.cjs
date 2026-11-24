const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=read('docs/catalog-standardization/original.json');
const current=read('frontend/src/data/properties.json');
const review=read('docs/catalog-standardization/review.json');
const editorial=new Set(['title','short_description','description','description_sections','features']);
assert.equal(current.length,old.length);
assert.equal(review.length,old.length);
for(const p of old){
 const next=current.find(x=>x.id===p.id);
 assert(next,'Missing object '+p.id);
 for(const k of Object.keys(p))if(!editorial.has(k))assert.deepStrictEqual(next[k],p[k],p.id+': '+k+' changed');
 assert.notEqual(next.description,p.description,p.id+': description not rewritten');
 assert(review.some(r=>r.id===p.id&&['reviewed','manual-review'].includes(r.result)));
}
for(const key of ['title','description','seo_description'])assert.equal(new Set(current.map(p=>p[key])).size,current.length,key+' duplicated');
console.log('PASS: '+current.length+' objects; facts, images, prices, IDs and visibility unchanged; every record reviewed.');
