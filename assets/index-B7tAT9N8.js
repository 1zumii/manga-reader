import{e as j,o as _,k as N,i as B,a as D,b as k,f as $,s as C,t as z,u as T,l as q,h as J,m as O,j as H,n as K,c as E,F as Q,S as W}from"./index-Cp_Y-R1w.js";import{U as X}from"./url-transformer-DK_g3h-P.js";const Y=e=>{const n=[];let o=0;for(;o<1;)n.push(o),o+=e;return n.push(1),n},Z="_root_1jepb_1",ee="_image_1jepb_50",ne="_unload_1jepb_58",te="_loading_1jepb_78",S={root:Z,image:ee,unload:ne,loading:te};var re=z("<div><img>");const ae=e=>[],oe=e=>{let n;const[o,i]=j("unload");_(()=>{n&&(n.src="")});const c=()=>{i("loaded"),e.onLoaded?.()},s=()=>{i("error"),e.onError?.()},a=new ResizeObserver(r=>{r.forEach(l=>{const f=l.contentBoxSize[0].blockSize;o()!=="unload"||f===0||(e.onLoadStart?.(),i("loading"))})});N(()=>{n&&a.observe(n)}),_(()=>a.disconnect());let d;const t=new IntersectionObserver(r=>{r.forEach(l=>{const{boundingClientRect:f,intersectionRatio:p,isIntersecting:g}=l;e.onIntersect?.({boundingClientRect:f,intersectionRatio:p,isIntersecting:g})})},{threshold:Y(1e-4)});return N(()=>{d&&t.observe(d)}),_(()=>t.disconnect()),(()=>{var r=re(),l=r.firstChild,f=d;typeof f=="function"?T(f,r):d=r,B(r,()=>ae(e.id),l),l.addEventListener("error",s),l.addEventListener("load",c);var p=n;return typeof p=="function"?T(p,l):n=l,D(g=>{var h=S.image,w={[S.unload]:o()==="unload",[S.loading]:o()==="loading"},v=e.id,I=e.src,x=e.alt;return h!==g.e&&k(r,g.e=h),g.t=$(r,w,g.t),v!==g.a&&C(r,"data-id",g.a=v),I!==g.o&&C(l,"src",g.o=I),x!==g.i&&C(l,"alt",g.i=x),g},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),r})()},se="_read-view_v2xka_1",ie={readView:se},P=e=>JSON.stringify(e,Object.keys(e).sort()),de=()=>{const e=q();if(!Number.isNaN(Number.parseInt(e.chapterIndex,10))&&!Number.isNaN(Number.parseInt(e.pageIndex,10)))return{mangaId:e.mangaId,chapterIndex:Number.parseInt(e.chapterIndex,10),pageIndex:Number.parseInt(e.pageIndex,10)}},R=(e,n,o,i)=>{if(o===0)return[];const{pageIndex:u,chapterIndex:c}=e,s=i.find(t=>t.index===c),a=t=>{const r=R(t,n,o-1,i);return n==="prev"?[...r,t]:[t,...r]};if(n==="prev"){if(u!==1)return a({...e,pageIndex:u-1});const t=i.find(r=>r.index===s?.prevIndex);return t?a({...e,chapterIndex:t.index,pageIndex:t.total}):[]}if(typeof s?.total<"u"&&u!==s.total)return a({...e,pageIndex:u+1});const d=i.find(t=>t.index===s?.nextIndex);return d?a({...e,chapterIndex:d.index,pageIndex:1}):[]},y=(e,n)=>P(e)===P(n),A=(e,n)=>e.mangaId!==n.mangaId?!1:e.chapterIndex!==n.chapterIndex?n.chapterIndex<e.chapterIndex:n.pageIndex<e.pageIndex,U=e=>{if(!e)return;const n=Array.from(e.children).map(o=>{try{const i=JSON.parse(o.dataset.id??"null");if(!i)return;const{top:u,height:c}=o.getBoundingClientRect();return{pageInfo:i,height:c,clientTop:u,element:o}}catch{return}});if(!n.includes(void 0))return n.filter(o=>!!o)},ce=(e,n)=>e.reduce((o,i)=>o+i.height,-n),L=2,le=()=>{const e=J(),[n,o]=j(de()),i=O(()=>{if(e.state!=="ready")return;const s=n();if(s)return e().find(a=>a.id===s.mangaId)});H(()=>{const s=i();s&&(document.title=s.title)});const u=O(()=>{const s=n();if(!s)return[];const a=i();return a?[...R(s,"prev",L,a.chapters),s,...R(s,"next",L,a.chapters)]:[]});return{mangaInfo:i,mangaResource:e,readingInfo:n,displayPageImages:u,handleReadingInfoChange:(s,a)=>{const d=n();if(!d)return;const t=i();if(!t)return;const r=R(d,s,1,t.chapters)[0];r&&(o(r),K(r),a?.())}}};var ue=z("<div>");const ge=.05,me=()=>{const{mangaResource:e,readingInfo:n,displayPageImages:o,handleReadingInfoChange:i}=le();let u,c;N(()=>{const a=n();if(!a)return;const d=U(c);if(!d)return;const t=d.find(r=>y(r.pageInfo,a));u=0,t?.element.scrollIntoView(!0)});const s=a=>{const{pageInfo:d,boundingClientRect:t,intersectionRatio:r}=a,l=n();if(!l||!y(l,d)||u===t.top||(u=t.top,r>=ge)||!c)return;const f=t.top>0?"prev":"next",p=l,g=c.scrollTop,h=u;i(f,()=>requestAnimationFrame(()=>{if(!c)return;const v=c.scrollTop-g,I=U(c);if(!I)return;const x=I.filter(m=>A(p,m.pageInfo)),b=I.findIndex(m=>y(l,m.pageInfo));if(b===-1)return;const F=f==="prev"?Math.max(b-1,-1):Math.min(b+1,I.length),G=I[F],M=ce(x,h-v);c?.scrollTo({top:M}),u=I.filter(m=>A(G.pageInfo,m.pageInfo)).reduce((m,V)=>m+V.height,-M)}))};return E(W,{get when(){return!e.loading},get children(){var a=ue(),d=c;return typeof d=="function"?T(d,a):c=a,B(a,E(Q,{get each(){return o()},children:t=>E(oe,{get id(){return P(t)},get src(){return X.getPageImage(t)},containerRef:c,onIntersect:r=>s({...r,pageInfo:t})})})),D(()=>k(a,ie.readView)),a}})};export{me as default};
