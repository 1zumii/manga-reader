import{d as S,c as h,S as B,a as m,b as l,i as u,s as x,P as F,t as D,A as N,g as U,F as q,e as E,f as j,u as H,h as T,j as W}from"./index.e2d6658e.js";import{U as A}from"./url-transformer.6b2c128d.js";const G="_root_1iiqr_1",J="_bg-mask_1iiqr_50",K="_detail-drawer_1iiqr_58",O="_brief-info_1iiqr_77",Q="_chapter-list_1iiqr_94",X="_chapter_1iiqr_94",b={root:G,bgMask:J,detailDrawer:K,briefInfo:O,chapterList:Q,chapter:X},Y=D("<div>"),Z=D('<div><div><img alt="cover"><h5></h5></div><div>'),V=o=>{const a=()=>{o.onClose()},v=(t,r)=>h(q,{each:t,children:({name:s,index:n})=>h(N,{get class(){return b.chapter},get href(){return U({mangaId:r,chapterIndex:n,pageIndex:1})},children:s})});return h(F,{get mount(){return document.getElementById("root")??void 0},get children(){return h(B,{get when(){return o.info},children:t=>[(()=>{const r=Y();return r.$$click=a,m(()=>l(r,b.bgMask)),r})(),(()=>{const r=Z(),s=r.firstChild,n=s.firstChild,e=n.nextSibling,$=s.nextSibling;return u(e,()=>t().title),u($,()=>v(t().chapters,t().id)),m(i=>{const _=b.detailDrawer,d=b.briefInfo,g=A.getCover(t().id),k=b.chapterList;return _!==i._v$&&l(r,i._v$=_),d!==i._v$2&&l(s,i._v$2=d),g!==i._v$3&&x(n,"src",i._v$3=g),k!==i._v$4&&l($,i._v$4=k),i},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),r})()]})}})};S(["click"]);const ee=()=>{const[o,a]=E();return{currentDetail:o,openDrawer:r=>{a(r)},closeDrawer:()=>{a(void 0)}}},te="_root_1d8bz_1",ne="_search-panel_1d8bz_50",re="_prefixIcon_1d8bz_63",ie="_input_1d8bz_76",p={root:te,searchPanel:ne,prefixIcon:re,input:ie},ae=D('<div><div></div><input type="text">'),se=o=>{let a;const v=t=>{t.code==="Enter"&&o.onSearch(a.value)};return(()=>{const t=ae(),r=t.firstChild,s=r.nextSibling;s.$$keyup=v;const n=a;return typeof n=="function"?H(n,s):a=s,m(e=>{const $=p.searchPanel,i={[o.class]:!!o.class},_=p.prefixIcon,d=p.input;return $!==e._v$&&l(t,e._v$=$),e._v$2=j(t,i,e._v$2),_!==e._v$3&&l(r,e._v$3=_),d!==e._v$4&&l(s,e._v$4=d),e},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),t})()};S(["keyup"]);const ce="_root_1f2kz_1",oe="_search-panel_1f2kz_50",le="_prefixIcon_1f2kz_63",_e="_input_1f2kz_76",de="_home_1f2kz_86",ve="_base-info-list_1f2kz_98",ue="_card_1f2kz_104",$e="_title_1f2kz_118",fe="_description_1f2kz_126",f={root:ce,searchPanel:oe,prefixIcon:le,input:_e,home:de,baseInfoList:ve,card:ue,title:$e,description:fe},R=D("<div>"),he=D('<div><img loading="lazy"><div></div><div>\u66F4\u65B0\u81F3\u300C<!>\u300D'),ge=()=>{const o=T(),a=()=>o()??[],[v,t]=E(a()),r=s=>{if(!s){t(a());return}const n=a().filter(({title:e})=>e.includes(s));t(n)};return W(()=>{o.loading||t(a())}),{mangaList:v,isLoading:o.loading,handleSearch:r}},De=()=>{const{mangaList:o,handleSearch:a}=ge(),{currentDetail:v,openDrawer:t,closeDrawer:r}=ee(),s=()=>(()=>{const n=R();return u(n,h(q,{get each(){return o()},children:e=>{const $=e.chapters[e.chapters.length-1];return(()=>{const i=he(),_=i.firstChild,d=_.nextSibling,g=d.nextSibling,k=g.firstChild,I=k.nextSibling;return I.nextSibling,i.$$click=t,i.$$clickData=e,u(d,()=>e.title),u(g,()=>$.name,I),m(c=>{const w=f.card,L=f.cover,z=A.getCover(e.id),C=`cover-${e.id}`,M=f.title,y=e.title,P=f.description;return w!==c._v$&&l(i,c._v$=w),L!==c._v$2&&l(_,c._v$2=L),z!==c._v$3&&x(_,"src",c._v$3=z),C!==c._v$4&&x(_,"alt",c._v$4=C),M!==c._v$5&&l(d,c._v$5=M),y!==c._v$6&&x(d,"title",c._v$6=y),P!==c._v$7&&l(g,c._v$7=P),c},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0,_v$5:void 0,_v$6:void 0,_v$7:void 0}),i})()}})),m(()=>l(n,f.baseInfoList)),n})();return(()=>{const n=R();return u(n,h(se,{get class(){return f.searchPanel},onSearch:a}),null),u(n,s,null),u(n,h(V,{get info(){return v()},onClose:r}),null),m(()=>l(n,f.home)),n})()};S(["click"]);export{De as default};
