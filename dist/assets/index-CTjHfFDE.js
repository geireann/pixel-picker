(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=globalThis,st=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,it=Symbol(),gt=new WeakMap;let At=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==it)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(st&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=gt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&gt.set(e,t))}return t}toString(){return this.cssText}};const Yt=s=>new At(typeof s=="string"?s:s+"",void 0,it),R=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,o,n)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+s[n+1],s[0]);return new At(e,s,it)},jt=(s,t)=>{if(st)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),o=I.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}},mt=st?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return Yt(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Zt,defineProperty:Wt,getOwnPropertyDescriptor:Ft,getOwnPropertyNames:Kt,getOwnPropertySymbols:qt,getPrototypeOf:Jt}=Object,W=globalThis,yt=W.trustedTypes,Gt=yt?yt.emptyScript:"",Qt=W.reactiveElementPolyfillSupport,k=(s,t)=>s,N={toAttribute(s,t){switch(t){case Boolean:s=s?Gt:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ot=(s,t)=>!Zt(s,t),vt={attribute:!0,type:String,converter:N,reflect:!1,useDefault:!1,hasChanged:ot};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;let E=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=vt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);o!==void 0&&Wt(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:n}=Ft(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:o,set(r){const l=o?.call(this);n?.call(this,r),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??vt}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;const t=Jt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){const e=this.properties,i=[...Kt(e),...qt(e)];for(const o of i)this.createProperty(o,e[o])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,o]of e)this.elementProperties.set(i,o)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const o=this._$Eu(e,i);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const o of i)e.unshift(mt(o))}else t!==void 0&&e.push(mt(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return jt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(o!==void 0&&i.reflect===!0){const n=(i.converter?.toAttribute!==void 0?i.converter:N).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=i.getPropertyOptions(o),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:N;this._$Em=o;const l=r.fromAttribute(e,n.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,i,o=!1,n){if(t!==void 0){const r=this.constructor;if(o===!1&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??ot)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),n!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[o,n]of i){const{wrapped:r}=n,l=this[o];r!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[k("elementProperties")]=new Map,E[k("finalized")]=new Map,Qt?.({ReactiveElement:E}),(W.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nt=globalThis,xt=s=>s,X=nt.trustedTypes,wt=X?X.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ht="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Vt="?"+w,te=`<${Vt}>`,C=document,M=()=>C.createComment(""),O=s=>s===null||typeof s!="object"&&typeof s!="function",rt=Array.isArray,ee=s=>rt(s)||typeof s?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$t=/-->/g,St=/>/g,$=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ct=/'/g,Tt=/"/g,kt=/^(?:script|style|textarea|title)$/i,se=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),d=se(1),_=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),Et=new WeakMap,S=C.createTreeWalker(C,129);function Mt(s,t){if(!rt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return wt!==void 0?wt.createHTML(t):t}const ie=(s,t)=>{const e=s.length-1,i=[];let o,n=t===2?"<svg>":t===3?"<math>":"",r=V;for(let l=0;l<e;l++){const a=s[l];let f,b,p=-1,m=0;for(;m<a.length&&(r.lastIndex=m,b=r.exec(a),b!==null);)m=r.lastIndex,r===V?b[1]==="!--"?r=$t:b[1]!==void 0?r=St:b[2]!==void 0?(kt.test(b[2])&&(o=RegExp("</"+b[2],"g")),r=$):b[3]!==void 0&&(r=$):r===$?b[0]===">"?(r=o??V,p=-1):b[1]===void 0?p=-2:(p=r.lastIndex-b[2].length,f=b[1],r=b[3]===void 0?$:b[3]==='"'?Tt:Ct):r===Tt||r===Ct?r=$:r===$t||r===St?r=V:(r=$,o=void 0);const y=r===$&&s[l+1].startsWith("/>")?" ":"";n+=r===V?a+te:p>=0?(i.push(f),a.slice(0,p)+Ht+a.slice(p)+w+y):a+w+(p===-2?l:y)}return[Mt(s,n+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class D{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,r=0;const l=t.length-1,a=this.parts,[f,b]=ie(t,e);if(this.el=D.createElement(f,i),S.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(o=S.nextNode())!==null&&a.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(const p of o.getAttributeNames())if(p.endsWith(Ht)){const m=b[r++],y=o.getAttribute(p).split(w),T=/([.?@])?(.*)/.exec(m);a.push({type:1,index:n,name:T[2],strings:y,ctor:T[1]==="."?ne:T[1]==="?"?re:T[1]==="@"?ae:F}),o.removeAttribute(p)}else p.startsWith(w)&&(a.push({type:6,index:n}),o.removeAttribute(p));if(kt.test(o.tagName)){const p=o.textContent.split(w),m=p.length-1;if(m>0){o.textContent=X?X.emptyScript:"";for(let y=0;y<m;y++)o.append(p[y],M()),S.nextNode(),a.push({type:2,index:++n});o.append(p[m],M())}}}else if(o.nodeType===8)if(o.data===Vt)a.push({type:2,index:n});else{let p=-1;for(;(p=o.data.indexOf(w,p+1))!==-1;)a.push({type:7,index:n}),p+=w.length-1}n++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function P(s,t,e=s,i){if(t===_)return t;let o=i!==void 0?e._$Co?.[i]:e._$Cl;const n=O(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),n===void 0?o=void 0:(o=new n(s),o._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=o:e._$Cl=o),o!==void 0&&(t=P(s,o._$AS(s,t.values),o,i)),t}class oe{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??C).importNode(e,!0);S.currentNode=o;let n=S.nextNode(),r=0,l=0,a=i[0];for(;a!==void 0;){if(r===a.index){let f;a.type===2?f=new L(n,n.nextSibling,this,t):a.type===1?f=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(f=new le(n,this,t)),this._$AV.push(f),a=i[++l]}r!==a?.index&&(n=S.nextNode(),r++)}return S.currentNode=C,o}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class L{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),O(t)?t===g||t==null||t===""?(this._$AH!==g&&this._$AR(),this._$AH=g):t!==this._$AH&&t!==_&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ee(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==g&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=D.createElement(Mt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const n=new oe(o,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(t){let e=Et.get(t.strings);return e===void 0&&Et.set(t.strings,e=new D(t)),e}k(t){rt(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const n of t)o===e.length?e.push(i=new L(this.O(M()),this.O(M()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const i=xt(t).nextSibling;xt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class F{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,n){this.type=1,this._$AH=g,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=g}_$AI(t,e=this,i,o){const n=this.strings;let r=!1;if(n===void 0)t=P(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==_,r&&(this._$AH=t);else{const l=t;let a,f;for(t=n[0],a=0;a<n.length-1;a++)f=P(this,l[i+a],e,a),f===_&&(f=this._$AH[a]),r||=!O(f)||f!==this._$AH[a],f===g?t=g:t!==g&&(t+=(f??"")+n[a+1]),this._$AH[a]=f}r&&!o&&this.j(t)}j(t){t===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ne extends F{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===g?void 0:t}}class re extends F{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==g)}}class ae extends F{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??g)===_)return;const i=this._$AH,o=t===g&&i!==g||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==g&&(i===g||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class le{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}}const ce=nt.litHtmlPolyfillSupport;ce?.(D,L),(nt.litHtmlVersions??=[]).push("3.3.3");const he=(s,t,e)=>{const i=e?.renderBefore??t;let o=i._$litPart$;if(o===void 0){const n=e?.renderBefore??null;i._$litPart$=o=new L(t.insertBefore(M(),n),n,void 0,e??{})}return o._$AI(s),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const at=globalThis;class x extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=he(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _}}x._$litElement$=!0,x.finalized=!0,at.litElementHydrateSupport?.({LitElement:x});const de=at.litElementPolyfillSupport;de?.({LitElement:x});(at.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=s=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,t)}):customElements.define(s,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pe={attribute:!0,type:String,converter:N,reflect:!1,hasChanged:ot},ue=(s=pe,t,e)=>{const{kind:i,metadata:o}=e;let n=globalThis.litPropertyMetadata.get(o);if(n===void 0&&globalThis.litPropertyMetadata.set(o,n=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),n.set(e.name,s),i==="accessor"){const{name:r}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(r,a,s,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,s,l),l}}}if(i==="setter"){const{name:r}=e;return function(l){const a=this[r];t.call(this,l),this.requestUpdate(r,a,s,!0,l)}}throw Error("Unsupported decorator location: "+i)};function K(s){return(t,e)=>typeof e=="object"?ue(s,t,e):((i,o,n)=>{const r=o.hasOwnProperty(n);return o.constructor.createProperty(n,i),r?Object.getOwnPropertyDescriptor(o,n):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function lt(s){return K({...s,state:!0,attribute:!1})}const fe=R`
  :host {
    display: block;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(9, 9, 11, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

  .modal {
    background: #ffffff;
    border: 1px solid #d4d4d8;
    border-top: 3px solid #09090b;
    max-width: 380px;
    width: 100%;
    padding: 24px;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    position: relative;
    box-sizing: border-box;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .title {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 1.6rem;
    letter-spacing: 0.04em;
    margin: 0 0 12px 0;
    color: #09090b;
  }

  .description {
    font-size: 0.88rem;
    line-height: 1.6;
    color: #52525b;
    margin-bottom: 20px;
  }

  .action-btn {
    width: 100%;
    padding: 12px;
    border: 1px solid #09090b;
    background: #09090b;
    color: #ffffff;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  .action-btn:hover {
    background: #27272a;
  }
`;function be(s){return s.open?d`
    <div class="backdrop" @click=${t=>t.target===t.currentTarget&&s.onDismiss()}>
      <div class="modal" role="dialog" aria-labelledby="modal-title">
        <h2 id="modal-title" class="title">PIXEL PICKER</h2>
        <p class="description">
          A real-time collaborative 256x256 board. Click any pixel to edit its color, letter, or number—or type directly on your keyboard to draw.
        </p>

        <button class="action-btn" @click=${s.onDismiss}>
          START
        </button>
      </div>
    </div>
  `:d``}var ge=Object.defineProperty,me=Object.getOwnPropertyDescriptor,Ot=(s,t,e,i)=>{for(var o=i>1?void 0:i?me(t,e):t,n=s.length-1,r;n>=0;n--)(r=s[n])&&(o=(i?r(t,e,o):r(o))||o);return i&&o&&ge(t,e,o),o};let Y=class extends x{constructor(){super(...arguments),this.open=!1}connectedCallback(){super.connectedCallback(),localStorage.getItem("pixelpicker_intro_seen")||(this.open=!0)}dismiss(){this.open=!1,localStorage.setItem("pixelpicker_intro_seen","true"),this.dispatchEvent(new CustomEvent("intro-dismissed",{bubbles:!0,composed:!0}))}render(){return be({open:this.open,onDismiss:()=>this.dismiss()})}};Y.styles=[fe];Ot([K({type:Boolean})],Y.prototype,"open",2);Y=Ot([U("app-intro-modal")],Y);const ye=R`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #e4e4e7;
    user-select: none;
    touch-action: none;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: grab;
  }

  canvas:active {
    cursor: grabbing;
  }

  /* Minimalist Light Mode HUD Overlay */
  .hud-overlay {
    position: absolute;
    top: 14px;
    left: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 1px solid #d4d4d8;
    padding: 4px 10px;
    color: #09090b;
    font-size: 0.8rem;
    font-family: 'Space Mono', monospace;
    z-index: 10;
  }

  .hud-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 6px;
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
  }

  .hud-pill span.label {
    color: #71717a;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .hud-pill span.val {
    color: #09090b;
    font-weight: 700;
    font-family: 'Space Mono', monospace;
  }

  .controls-bar {
    position: absolute;
    top: 14px;
    right: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 10;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    background: #ffffff;
    border: 1px solid #d4d4d8;
    color: #09090b;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.1s ease;
  }

  .icon-btn:hover {
    background: #f4f4f5;
    border-color: #09090b;
  }

  .icon-btn.active {
    background: #09090b;
    color: #ffffff;
    border-color: #09090b;
  }

  svg {
    display: block;
  }
`,ve=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="12" height="12" fill="currentColor" stroke="#000000" stroke-width="2" />
    <rect x="4" y="4" width="4" height="4" fill="#09090b" />
    <rect x="8" y="8" width="4" height="4" fill="#71717a" />
  </svg>
`,xe=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2H10V4H12V14H10V10H6V14H4V4H6V2ZM6 6V8H10V6H6Z" />
  </svg>
`,we=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2H12V4L8 14H6L10 4H4V2Z" />
  </svg>
`,$e=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2H9V7H14V9H9V14H7V9H2V7H7V2Z" />
  </svg>
`,Se=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7H14V9H2V7Z" />
  </svg>
`,Ce=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2H6V4H4V6H2V2ZM10 2H14V6H12V4H10V2ZM2 10H4V12H6V14H2V10ZM12 12H10V14H14V10H12V12ZM7 7H9V9H7V7Z" />
  </svg>
`;d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2H6V6H2V2ZM10 2H14V6H10V2ZM2 10H6V14H2V10ZM10 10H14V14H10V10Z" />
  </svg>
`;const Te=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3H11V5H13V8H11V10H9V11H7V8H9V6H5V3ZM7 13H9V15H7V13Z" />
  </svg>
`,ct=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2H5L8 5L11 2H14V5L11 8L14 11V14H11L8 11L5 14H2V11L5 8L2 5V2Z" />
  </svg>
`,ht=d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2H11V4H13V6H15V10H13V12H11V14H5V12H3V10H1V6H3V4H5V2ZM5 4V6H3V10H5V12H11V10H13V6H11V4H5ZM7 5H9V8H12V10H7V5Z" />
  </svg>
`;d`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 3H15V13H1V3ZM3 5V7H5V5H3ZM7 5V7H9V5H7ZM11 5V7H13V5H11ZM3 9V11H13V9H3Z" />
  </svg>
`;function Ee(s){return d`
    <div class="hud-overlay">
      <div class="hud-pill">
        <span class="label">POS</span>
        <span class="val">${s.coordText}</span>
      </div>
      <div class="hud-pill">
        <span class="label">ZOOM</span>
        <span class="val">${s.zoomText}</span>
      </div>
    </div>

    <div class="controls-bar">
      <button class="icon-btn ${s.isTimeTravelOpen?"active":""}" title="Toggle Time Travel Timeline" @click=${s.onToggleTimeTravel}>${ht}</button>
      <button class="icon-btn" title="Zoom In" @click=${s.onZoomIn}>${$e}</button>
      <button class="icon-btn" title="Zoom Out" @click=${s.onZoomOut}>${Se}</button>
      <button class="icon-btn" title="Reset View" @click=${s.onResetView}>${Ce}</button>
      <button class="icon-btn" title="Help / Info" @click=${s.onOpenHelp}>${Te}</button>
    </div>

    <canvas id="board-canvas"></canvas>
  `}class _e{constructor(t){this.pixelsMap=new Map,this.activeFlips=new Map,this.width=256,this.height=256,this.canvas=t;const e=t.getContext("2d",{alpha:!1});if(!e)throw new Error("Failed to get 2D context");this.ctx=e,this.offscreenCanvas=document.createElement("canvas"),this.offscreenCanvas.width=this.width,this.offscreenCanvas.height=this.height;const i=this.offscreenCanvas.getContext("2d");if(!i)throw new Error("Failed to get offscreen 2D context");this.offscreenCtx=i,this.initOffscreenBackground()}setDimensions(t,e){(this.width!==t||this.height!==e)&&(this.width=t,this.height=e,this.offscreenCanvas.width=t,this.offscreenCanvas.height=e,this.initOffscreenBackground())}initOffscreenBackground(){this.offscreenCtx.fillStyle="#ffffff",this.offscreenCtx.fillRect(0,0,this.width,this.height)}triggerPixelFlip(t,e){t>=0&&t<this.width&&e>=0&&e<this.height&&this.activeFlips.set(`${t},${e}`,{startTime:performance.now(),duration:240})}updatePixels(t){const e=performance.now();t.forEach(i=>{this.pixelsMap.set(`${i.x},${i.y}`,i),this.drawSinglePixelToOffscreen(i),this.activeFlips.set(`${i.x},${i.y}`,{startTime:e,duration:240})})}setAllPixels(t){this.pixelsMap.clear(),this.initOffscreenBackground(),t.forEach(e=>{this.pixelsMap.set(`${e.x},${e.y}`,e),this.drawSinglePixelToOffscreen(e)})}drawSinglePixelToOffscreen(t){const{x:e,y:i,type:o,val:n,bgColor:r="#ffffff"}=t;e<0||e>=this.width||i<0||i>=this.height||(o==="color"?(this.offscreenCtx.fillStyle=n||"#ffffff",this.offscreenCtx.fillRect(e,i,1,1)):(this.offscreenCtx.fillStyle=r||"#ffffff",this.offscreenCtx.fillRect(e,i,1,1)),this.offscreenCtx.fillStyle="rgba(0, 0, 0, 0.08)",this.offscreenCtx.fillRect(e,i+.48,1,.04))}render(t,e,i){const o=this.canvas.width,n=this.canvas.height,r=performance.now(),l=t.boardWidth||this.width,a=t.boardHeight||this.height;if(this.setDimensions(l,a),this.ctx.fillStyle="#e4e4e7",this.ctx.fillRect(0,0,o,n),this.ctx.save(),this.ctx.translate(t.panX,t.panY),this.ctx.scale(t.zoom,t.zoom),this.ctx.imageSmoothingEnabled=!1,this.ctx.drawImage(this.offscreenCanvas,0,0),t.showGrid&&t.zoom>=4){this.ctx.strokeStyle="rgba(0, 0, 0, 0.08)",this.ctx.lineWidth=.03;for(let u=0;u<=l;u++)this.ctx.beginPath(),this.ctx.moveTo(u,0),this.ctx.lineTo(u,a),this.ctx.stroke();for(let u=0;u<=a;u++)this.ctx.beginPath(),this.ctx.moveTo(0,u),this.ctx.lineTo(l,u),this.ctx.stroke()}this.ctx.strokeStyle="#09090b",this.ctx.lineWidth=.25,this.ctx.strokeRect(0,0,l,a),i&&i.x>=0&&i.x<l&&i.y>=0&&i.y<a&&(this.ctx.strokeStyle="rgba(9, 9, 11, 0.6)",this.ctx.lineWidth=.15,this.ctx.strokeRect(i.x,i.y,1,1)),e&&e.x>=0&&e.x<l&&e.y>=0&&e.y<a&&(this.ctx.strokeStyle="#09090b",this.ctx.lineWidth=.3,this.ctx.strokeRect(e.x,e.y,1,1),this.ctx.fillStyle="rgba(9, 9, 11, 0.12)",this.ctx.fillRect(e.x,e.y,1,1)),this.ctx.restore();const f=Math.floor(t.zoom*.78);let b=!1;const p=Math.max(0,Math.floor(-t.panX/t.zoom)),m=Math.min(l-1,Math.ceil((o-t.panX)/t.zoom)),y=Math.max(0,Math.floor(-t.panY/t.zoom)),T=Math.min(a-1,Math.ceil((n-t.panY)/t.zoom));this.pixelsMap.forEach(u=>{if(u.x<p||u.x>m||u.y<y||u.y>T)return;const ut=`${u.x},${u.y}`,z=this.activeFlips.get(ut);let ft=!1,J=0;if(z){const bt=r-z.startTime;bt<z.duration?(ft=!0,J=bt/z.duration,b=!0):this.activeFlips.delete(ut)}const It=(u.x+.5)*t.zoom+t.panX,Bt=(u.y+.54)*t.zoom+t.panY,G=t.zoom,H=t.zoom,Nt=u.x*t.zoom+t.panX,Xt=u.y*t.zoom+t.panY;ft&&(this.ctx.save(),this.ctx.translate(Nt,Xt),J<.4?(this.ctx.fillStyle="rgba(9, 9, 11, 0.2)",this.ctx.fillRect(0,0,G,H*.5)):J<.7?(this.ctx.fillStyle="#09090b",this.ctx.fillRect(0,H*.45,G,H*.1)):(this.ctx.fillStyle="rgba(9, 9, 11, 0.1)",this.ctx.fillRect(0,H*.5,G,H*.5)),this.ctx.restore()),f>=4&&(u.type==="letter"||u.type==="number")&&(this.ctx.save(),this.ctx.font=`700 ${f}px 'Space Mono', monospace`,this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillStyle=u.textColor||"#09090b",this.ctx.fillText(String(u.val).charAt(0),It,Bt),this.ctx.restore())}),b&&requestAnimationFrame(()=>this.render(t,e,i))}screenToBoardCoord(t,e,i){const o=i.boardWidth||this.width,n=i.boardHeight||this.height,r=Math.floor((t-i.panX)/i.zoom),l=Math.floor((e-i.panY)/i.zoom);return r>=0&&r<o&&l>=0&&l<n?{x:r,y:l}:null}}class Pe{constructor(t,e){this.initialPinchDistance=0,this.isMultiTouch=!1,this.lastTouchX=0,this.lastTouchY=0,this.lastTapTime=0,this.element=t,this.callbacks=e,this.bindEvents()}bindEvents(){this.element.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.element.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.element.addEventListener("touchend",this.handleTouchEnd.bind(this),{passive:!1})}getDistance(t,e){const i=t.clientX-e.clientX,o=t.clientY-e.clientY;return Math.sqrt(i*i+o*o)}handleTouchStart(t){if(t.touches.length===1){this.isMultiTouch=!1,this.lastTouchX=t.touches[0].clientX,this.lastTouchY=t.touches[0].clientY;const e=Date.now();e-this.lastTapTime<300&&this.callbacks.onTap(this.lastTouchX,this.lastTouchY),this.lastTapTime=e}else t.touches.length===2&&(this.isMultiTouch=!0,this.initialPinchDistance=this.getDistance(t.touches[0],t.touches[1]))}handleTouchMove(t){if(t.preventDefault(),t.touches.length===1&&!this.isMultiTouch){const e=t.touches[0].clientX-this.lastTouchX,i=t.touches[0].clientY-this.lastTouchY;this.lastTouchX=t.touches[0].clientX,this.lastTouchY=t.touches[0].clientY,this.callbacks.onPan(e,i)}else if(t.touches.length===2){const e=this.getDistance(t.touches[0],t.touches[1]);if(this.initialPinchDistance>0){const i=e/this.initialPinchDistance,o=(t.touches[0].clientX+t.touches[1].clientX)/2,n=(t.touches[0].clientY+t.touches[1].clientY)/2;this.callbacks.onPinchZoom(i,o,n),this.initialPinchDistance=e}}}handleTouchEnd(t){t.touches.length===0&&this.isMultiTouch}}const tt={"1080x1080":{presetId:"1080x1080",width:1080,height:1080,label:"1080 x 1080 Mega"},"256x256":{presetId:"256x256",width:256,height:256,label:"256 x 256 Canvas"},"6x22":{presetId:"6x22",width:22,height:6,label:"6 x 22 Micro"}};function B(s=window.location.pathname){const t=s.toLowerCase().replace(/\/$/,"");return t==="/6x22"?"6x22":t==="/256x256"?"256x256":"1080x1080"}class Ae{constructor(){this.pixelsMap=new Map,this.activePreset=B(),this.viewport={zoom:3.5,panX:50,panY:50,showGrid:!0,boardWidth:tt[B()].width,boardHeight:tt[B()].height},this.activeUsers=1,this.isLive=!0,this.listeners=new Set}getPreset(){return this.activePreset}setPreset(t){this.activePreset=t;const e=tt[t];this.viewport.boardWidth=e.width,this.viewport.boardHeight=e.height,this.pixelsMap.clear(),this.notify()}getPixels(){return Array.from(this.pixelsMap.values())}getPixel(t,e){return this.pixelsMap.get(`${t},${e}`)||null}setPixels(t){this.pixelsMap.clear(),t.forEach(e=>this.pixelsMap.set(`${e.x},${e.y}`,e)),this.notify()}updatePixel(t){this.pixelsMap.set(`${t.x},${t.y}`,t),this.notify()}getViewport(){return{...this.viewport}}setViewport(t){this.viewport={...this.viewport,...t},this.notify()}getActiveUsers(){return this.activeUsers}setActiveUsers(t){this.activeUsers=t,this.notify()}getIsLive(){return this.isLive}setIsLive(t){this.isLive=t,this.notify()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t())}}const c=new Ae;class He{constructor(){this.selectedCoord=null,this.activeTab="color",this.colorVal="#38bdf8",this.letterVal="P",this.numberVal="7",this.textColor="#ffffff",this.bgColor="#1e293b",this.listeners=new Set}getSelectedCoord(){return this.selectedCoord}setSelectedCoord(t){this.selectedCoord=t,this.notify()}getActiveTab(){return this.activeTab}setActiveTab(t){this.activeTab=t,this.notify()}getValues(){return{colorVal:this.colorVal,letterVal:this.letterVal,numberVal:this.numberVal,textColor:this.textColor,bgColor:this.bgColor}}setValues(t){t.colorVal!==void 0&&(this.colorVal=t.colorVal),t.letterVal!==void 0&&(this.letterVal=t.letterVal),t.numberVal!==void 0&&(this.numberVal=t.numberVal),t.textColor!==void 0&&(this.textColor=t.textColor),t.bgColor!==void 0&&(this.bgColor=t.bgColor),this.notify()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t())}}const h=new He;var Ve=Object.defineProperty,ke=Object.getOwnPropertyDescriptor,q=(s,t,e,i)=>{for(var o=i>1?void 0:i?ke(t,e):t,n=s.length-1,r;n>=0;n--)(r=s[n])&&(o=(i?r(t,e,o):r(o))||o);return i&&o&&Ve(t,e,o),o};let A=class extends x{constructor(){super(...arguments),this.hoverCoord=null,this.isDragging=!1,this.isTimeTravelOpen=!1,this.isSpacePressed=!1,this.dragStartX=0,this.dragStartY=0,this.renderer=null,this.unsubscribeBoardStore=null,this.unsubscribeEditorStore=null,this.boundKeyDownHandler=null,this.boundKeyUpHandler=null,this.boundTimeTravelClosedHandler=null}triggerPixelFlip(s,t){this.renderer&&(this.renderer.triggerPixelFlip(s,t),this.requestRender())}firstUpdated(){const s=this.shadowRoot?.querySelector("#board-canvas");s&&(this.setupCanvasSize(s),this.renderer=new _e(s),s.addEventListener("wheel",this.handleWheel.bind(this),{passive:!1}),s.addEventListener("mousedown",this.handleMouseDown.bind(this)),window.addEventListener("mousemove",this.handleMouseMove.bind(this)),window.addEventListener("mouseup",this.handleMouseUp.bind(this)),new Pe(s,{onPan:(e,i)=>this.panViewport(e,i),onPinchZoom:(e,i,o)=>this.zoomAtPoint(e,i,o),onTap:(e,i)=>this.handleTapAt(e,i)}),new ResizeObserver(()=>{this.setupCanvasSize(s),this.requestRender()}).observe(this)),this.boundKeyDownHandler=this.handleKeyDown.bind(this),this.boundKeyUpHandler=this.handleKeyUp.bind(this),window.addEventListener("keydown",this.boundKeyDownHandler),window.addEventListener("keyup",this.boundKeyUpHandler),this.boundTimeTravelClosedHandler=()=>{this.isTimeTravelOpen=!1},window.addEventListener("time-travel-closed",this.boundTimeTravelClosedHandler),this.unsubscribeBoardStore=c.subscribe(()=>{if(this.renderer){const t=c.getViewport();this.renderer.setDimensions(t.boardWidth,t.boardHeight),this.renderer.setAllPixels(c.getPixels()),this.requestRender()}}),this.unsubscribeEditorStore=h.subscribe(()=>{this.requestRender()}),this.centerBoard()}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribeBoardStore?.(),this.unsubscribeEditorStore?.(),this.boundKeyDownHandler&&window.removeEventListener("keydown",this.boundKeyDownHandler),this.boundKeyUpHandler&&window.removeEventListener("keyup",this.boundKeyUpHandler),this.boundTimeTravelClosedHandler&&window.removeEventListener("time-travel-closed",this.boundTimeTravelClosedHandler)}handleKeyUp(s){s.key===" "&&(this.isSpacePressed=!1)}handleKeyDown(s){const t=s.target,e=t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA");if(s.key===" "&&!e){this.isSpacePressed=!0,s.preventDefault();return}const i=h.getSelectedCoord();if(!i)return;if(s.key==="Escape"){h.setSelectedCoord(null),e&&t.blur();return}if(e)return;const o=c.getViewport();if(s.key==="ArrowLeft"){s.preventDefault(),h.setSelectedCoord({x:Math.max(0,i.x-1),y:i.y});return}if(s.key==="ArrowRight"){s.preventDefault(),h.setSelectedCoord({x:Math.min(o.boardWidth-1,i.x+1),y:i.y});return}if(s.key==="ArrowUp"){s.preventDefault(),h.setSelectedCoord({x:i.x,y:Math.max(0,i.y-1)});return}if(s.key==="ArrowDown"){s.preventDefault(),h.setSelectedCoord({x:i.x,y:Math.min(o.boardHeight-1,i.y+1)});return}if(!s.ctrlKey&&!s.metaKey&&!s.altKey&&s.key.length===1){s.preventDefault();const n=s.key,r=/^[0-9]$/.test(n),l=r?"number":"letter",a=h.getValues();this.triggerPixelFlip(i.x,i.y),this.dispatchEvent(new CustomEvent("apply-edit",{detail:{x:i.x,y:i.y,pixelType:l,val:r?n:n.toUpperCase(),textColor:a.textColor||"#fafafa",bgColor:a.bgColor||"#18181b",boardId:c.getPreset()},bubbles:!0,composed:!0})),i.x<o.boardWidth-1&&h.setSelectedCoord({x:i.x+1,y:i.y})}}setupCanvasSize(s){const t=this.getBoundingClientRect();s.width=t.width||window.innerWidth,s.height=t.height||window.innerHeight}centerBoard(){const s=this.shadowRoot?.querySelector("#board-canvas"),t=s?s.width:window.innerWidth,e=s?s.height:window.innerHeight,i=c.getViewport(),o=Math.min(t/(i.boardWidth*1.1),e/(i.boardHeight*1.1)),n=(t-i.boardWidth*o)/2,r=(e-i.boardHeight*o)/2;c.setViewport({zoom:o,panX:n,panY:r})}handleWheel(s){if(s.preventDefault(),s.ctrlKey||s.metaKey){const t=Math.pow(1.005,-s.deltaY);this.zoomAtPoint(t,s.clientX,s.clientY)}else this.panViewport(-s.deltaX,-s.deltaY)}zoomAtPoint(s,t,e){const i=this.getBoundingClientRect(),o=t-i.left,n=e-i.top,r=c.getViewport(),l=Math.max(.2,Math.min(100,r.zoom*s)),a=o-(o-r.panX)*(l/r.zoom),f=n-(n-r.panY)*(l/r.zoom);c.setViewport({zoom:l,panX:a,panY:f})}panViewport(s,t){const e=c.getViewport();c.setViewport({panX:e.panX+s,panY:e.panY+t})}handleMouseDown(s){(s.button===0||s.button===1||this.isSpacePressed)&&(this.isDragging=!0,this.dragStartX=s.clientX,this.dragStartY=s.clientY)}handleMouseMove(s){const t=this.getBoundingClientRect(),e=s.clientX-t.left,i=s.clientY-t.top,o=c.getViewport();if(this.renderer&&(this.hoverCoord=this.renderer.screenToBoardCoord(e,i,o)),this.isDragging){const n=s.clientX-this.dragStartX,r=s.clientY-this.dragStartY;this.dragStartX=s.clientX,this.dragStartY=s.clientY,this.panViewport(n,r)}}handleMouseUp(s){this.isDragging&&Math.hypot(s.clientX-this.dragStartX,s.clientY-this.dragStartY)<5&&!this.isSpacePressed&&s.button===0&&this.handleTapAt(s.clientX,s.clientY),this.isDragging=!1}handleTapAt(s,t){const e=this.getBoundingClientRect(),i=s-e.left,o=t-e.top,n=c.getViewport();if(this.renderer){const r=this.renderer.screenToBoardCoord(i,o,n);r&&(h.setSelectedCoord(r),this.dispatchEvent(new CustomEvent("pixel-selected",{detail:r,bubbles:!0,composed:!0})))}}requestRender(){this.renderer&&this.renderer.render(c.getViewport(),h.getSelectedCoord(),this.hoverCoord)}render(){const s=c.getViewport(),t=h.getSelectedCoord(),e=t?`X: ${t.x}, Y: ${t.y}`:this.hoverCoord?`X: ${this.hoverCoord.x}, Y: ${this.hoverCoord.y}`:"X: --, Y: --",i=`${Math.round(s.zoom*100/Math.min(window.innerWidth/s.boardWidth,window.innerHeight/s.boardHeight))}%`;return Ee({coordText:e,zoomText:i,isTimeTravelOpen:this.isTimeTravelOpen,onZoomIn:()=>this.zoomAtPoint(1.25,window.innerWidth/2,window.innerHeight/2),onZoomOut:()=>this.zoomAtPoint(.8,window.innerWidth/2,window.innerHeight/2),onResetView:()=>this.centerBoard(),onToggleTimeTravel:()=>{this.isTimeTravelOpen=!this.isTimeTravelOpen,this.dispatchEvent(new CustomEvent("toggle-time-travel",{detail:{open:this.isTimeTravelOpen},bubbles:!0,composed:!0}))},onOpenHelp:()=>this.dispatchEvent(new CustomEvent("open-help",{bubbles:!0,composed:!0}))})}};A.styles=[ye];q([lt()],A.prototype,"hoverCoord",2);q([lt()],A.prototype,"isDragging",2);q([lt()],A.prototype,"isTimeTravelOpen",2);A=q([U("app-canvas-board")],A);const Me=R`
  :host {
    display: block;
  }

  .inspector-card {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 240px;
    background: #ffffff;
    border: 1px solid #d4d4d8;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    padding: 12px;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    z-index: 40;
    animation: fadeIn 0.15s ease;
  }

  @media (max-width: 640px) {
    .inspector-card {
      bottom: 16px;
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      max-width: 280px;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f4f4f5;
  }

  .coord-tag {
    font-size: 0.78rem;
    font-weight: 700;
    color: #09090b;
    background: #f4f4f5;
    padding: 2px 6px;
    border: 1px solid #e4e4e7;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .icon-action-btn {
    width: 24px;
    height: 24px;
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    color: #71717a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .icon-action-btn:hover {
    color: #09090b;
    background: #e4e4e7;
    border-color: #09090b;
  }

  .tab-bar {
    display: flex;
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    padding: 2px;
    gap: 2px;
    margin-bottom: 10px;
  }

  .tab-btn {
    flex: 1;
    padding: 5px 2px;
    border: none;
    background: none;
    color: #71717a;
    font-size: 0.68rem;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .tab-btn.active {
    background: #ffffff;
    color: #09090b;
    border: 1px solid #09090b;
  }

  .input-area {
    margin-bottom: 10px;
  }

  .character-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .char-input {
    width: 46px;
    height: 46px;
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    text-align: center;
    font-family: 'Space Mono', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    color: #09090b;
    box-sizing: border-box;
  }

  .char-input:focus {
    outline: none;
    border-color: #09090b;
    background: #ffffff;
  }

  .color-pickers {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .color-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.65rem;
    color: #71717a;
    cursor: pointer;
  }

  input[type="color"] {
    -webkit-appearance: none;
    border: none;
    width: 22px;
    height: 22px;
    cursor: pointer;
    background: none;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: 1px solid #d4d4d8;
  }

  .color-swatches-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
  }

  .swatch-btn {
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid #d4d4d8;
    cursor: pointer;
  }

  .swatch-btn:hover, .swatch-btn.selected {
    border-color: #09090b;
    transform: scale(1.05);
  }

  .custom-color-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    cursor: pointer;
  }

  .apply-btn {
    width: 100%;
    padding: 8px;
    border: 1px solid #09090b;
    background: #09090b;
    color: #ffffff;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  .apply-btn:hover {
    background: #27272a;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,Oe=["#09090b","#ffffff","#e11d48","#2563eb","#16a34a","#ca8a04","#7c3aed","#ea580c"];function De(s){return s.coord?d`
    <div class="inspector-card">
      <div class="card-header">
        <div class="coord-tag">X: ${s.coord.x}, Y: ${s.coord.y}</div>
        <div class="header-actions">
          <button class="icon-action-btn" title="View History" @click=${s.onViewHistory}>${ht}</button>
          <button class="icon-action-btn" title="Close Inspector" @click=${s.onClose}>${ct}</button>
        </div>
      </div>

      <div class="tab-bar">
        <button
          class="tab-btn ${s.activeTab==="letter"?"active":""}"
          @click=${()=>s.onTabChange("letter")}
        >${xe} LETTER</button>
        <button
          class="tab-btn ${s.activeTab==="color"?"active":""}"
          @click=${()=>s.onTabChange("color")}
        >${ve} COLOR</button>
        <button
          class="tab-btn ${s.activeTab==="number"?"active":""}"
          @click=${()=>s.onTabChange("number")}
        >${we} NUMBER</button>
      </div>

      <div class="input-area">
        ${s.activeTab==="letter"||s.activeTab==="number"?d`
          <div class="character-input-row">
            <input
              id="pixel-char-input"
              class="char-input"
              type="text"
              maxlength="1"
              placeholder=${s.activeTab==="letter"?"A":"7"}
              .value=${s.activeTab==="letter"?s.letterVal:s.numberVal}
              @input=${t=>{const e=t.target.value;s.activeTab==="letter"?s.onLetterChange(e):s.onNumberChange(e)}}
            />
            <div class="color-pickers">
              <label class="color-field">
                <span>TEXT</span>
                <input
                  type="color"
                  .value=${s.textColor}
                  @input=${t=>s.onTextColorChange(t.target.value)}
                />
              </label>
              <label class="color-field">
                <span>BG</span>
                <input
                  type="color"
                  .value=${s.bgColor}
                  @input=${t=>s.onBgColorChange(t.target.value)}
                />
              </label>
            </div>
          </div>
        `:d`
          <div class="color-swatches-grid">
            ${Oe.map(t=>d`
              <button
                class="swatch-btn ${s.colorVal===t?"selected":""}"
                style="background: ${t}"
                @click=${()=>{s.onColorChange(t),s.onApply()}}
              ></button>
            `)}
            <label class="custom-color-btn" title="Custom Color">
              <input
                type="color"
                .value=${s.colorVal}
                @input=${t=>s.onColorChange(t.target.value)}
              />
            </label>
          </div>
        `}
      </div>

      <button class="apply-btn" @click=${s.onApply}>
        APPLY EDIT
      </button>
    </div>
  `:d``}var Re=Object.getOwnPropertyDescriptor,Le=(s,t,e,i)=>{for(var o=i>1?void 0:i?Re(t,e):t,n=s.length-1,r;n>=0;n--)(r=s[n])&&(o=r(o)||o);return o};let et=class extends x{constructor(){super(...arguments),this.unsubscribeStore=null}connectedCallback(){super.connectedCallback(),this.unsubscribeStore=h.subscribe(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribeStore?.()}handleKeypadTap(s){const t=h.getValues();if(s==="C")h.setValues({numberVal:""});else if(s==="↵")this.handleApply();else{const e=(t.numberVal==="0"?s:t.numberVal+s).substring(0,2);h.setValues({numberVal:e}),this.handleApply()}}handleApply(){const s=h.getSelectedCoord();if(!s)return;const t=h.getActiveTab(),e=h.getValues();let i=e.colorVal;t==="letter"&&(i=e.letterVal||"A"),t==="number"&&(i=e.numberVal||"0"),this.dispatchEvent(new CustomEvent("apply-edit",{detail:{x:s.x,y:s.y,pixelType:t,val:i,textColor:e.textColor,bgColor:e.bgColor},bubbles:!0,composed:!0}))}render(){const s=h.getSelectedCoord(),t=h.getActiveTab(),e=h.getValues();return De({coord:s,activeTab:t,...e,onTabChange:i=>h.setActiveTab(i),onColorChange:i=>h.setValues({colorVal:i}),onLetterChange:i=>{h.setValues({letterVal:i.toUpperCase()}),i&&this.handleApply()},onNumberChange:i=>h.setValues({numberVal:i}),onTextColorChange:i=>h.setValues({textColor:i}),onBgColorChange:i=>h.setValues({bgColor:i}),onApply:()=>this.handleApply(),onViewHistory:()=>this.dispatchEvent(new CustomEvent("open-pixel-history",{detail:s,bubbles:!0,composed:!0})),onClose:()=>h.setSelectedCoord(null),onKeypadTap:i=>this.handleKeypadTap(i)})}};et.styles=[Me];et=Le([U("app-editor-panel")],et);const Ue=R`
  :host {
    display: block;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(9, 9, 11, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
  }

  .panel {
    background: #ffffff;
    border: 1px solid #d4d4d8;
    border-top: 3px solid #09090b;
    width: 100%;
    max-width: 480px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .header {
    padding: 14px 18px;
    border-bottom: 1px solid #e4e4e7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f4f4f5;
  }

  .title {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 1.3rem;
    letter-spacing: 0.05em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .coord-subtitle {
    font-family: 'Space Mono', monospace;
    color: #52525b;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .close-btn {
    background: #ffffff;
    border: 1px solid #d4d4d8;
    color: #71717a;
    cursor: pointer;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: #ffffff;
    background: #09090b;
    border-color: #09090b;
  }

  .history-list {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .history-item {
    background: #f4f4f5;
    border: 1px solid #e4e4e7;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .item-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .preview-box {
    width: 36px;
    height: 36px;
    border: 1.5px solid #09090b;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 1rem;
    position: relative;
    box-sizing: border-box;
  }

  .preview-box::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.15);
  }

  .meta-author {
    font-size: 0.78rem;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
  }

  .meta-time {
    font-size: 0.72rem;
    color: #71717a;
  }

  .empty-state {
    text-align: center;
    padding: 32px;
    color: #71717a;
    font-size: 0.85rem;
  }
`;function ze(s){return!s.open||!s.coord?d``:d`
    <div class="modal-backdrop" @click=${t=>t.target===t.currentTarget&&s.onClose()}>
      <div class="panel">
        <div class="header">
          <div class="title">
            <span style="display: inline-flex; align-items: center;">${ht}</span>
            <span>HISTORY</span>
            <span class="coord-subtitle">(${s.coord.x}, ${s.coord.y})</span>
          </div>
          <button class="close-btn" @click=${s.onClose}>${ct}</button>
        </div>

        <div class="history-list">
          ${s.history.length===0?d`
            <div class="empty-state">NO RECORDED EDITS FOR THIS COORDINATE.</div>
          `:s.history.map(t=>{const e=new Date(t.timestamp).toLocaleString();let i=`background: ${t.val};`,o="";return t.type!=="color"&&(i=`background: ${t.bgColor||"#ffffff"}; color: ${t.textColor||"#09090b"};`,o=t.val),d`
              <div class="history-item">
                <div class="item-left">
                  <div class="preview-box" style="${i}">
                    ${o}
                  </div>
                  <div>
                    <div style="font-size: 0.8rem; font-weight: 700; color: #09090b;">TYPE: ${t.type.toUpperCase()}</div>
                    <div class="meta-author">AUTHOR: ${t.authorHash}</div>
                  </div>
                </div>
                <div class="meta-time">${e}</div>
              </div>
            `})}
        </div>
      </div>
    </div>
  `}class Ie{constructor(){this.pixelHistory=[],this.earliestTimestamp=Date.now(),this.latestTimestamp=Date.now(),this.currentScrubberTimestamp=Date.now(),this.totalEditsCount=0,this.listeners=new Set}getPixelHistory(){return this.pixelHistory}setPixelHistory(t){this.pixelHistory=t,this.notify()}getTimeline(){return{earliest:this.earliestTimestamp,latest:this.latestTimestamp,current:this.currentScrubberTimestamp,totalEdits:this.totalEditsCount}}setTimeline(t,e,i,o){this.earliestTimestamp=t,this.latestTimestamp=e,this.currentScrubberTimestamp=i,this.totalEditsCount=o,this.notify()}setCurrentScrubberTimestamp(t){this.currentScrubberTimestamp=t,this.notify()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>t())}}const v=new Ie;var Be=Object.defineProperty,Ne=Object.getOwnPropertyDescriptor,Dt=(s,t,e,i)=>{for(var o=i>1?void 0:i?Ne(t,e):t,n=s.length-1,r;n>=0;n--)(r=s[n])&&(o=(i?r(t,e,o):r(o))||o);return i&&o&&Be(t,e,o),o};let j=class extends x{constructor(){super(...arguments),this.open=!1,this.unsubscribeHistoryStore=null,this.unsubscribeEditorStore=null}connectedCallback(){super.connectedCallback(),this.unsubscribeHistoryStore=v.subscribe(()=>this.requestUpdate()),this.unsubscribeEditorStore=h.subscribe(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribeHistoryStore?.(),this.unsubscribeEditorStore?.()}render(){const s=h.getSelectedCoord(),t=v.getPixelHistory();return ze({open:this.open,coord:s,history:t,onClose:()=>{this.open=!1,this.dispatchEvent(new CustomEvent("close-history",{bubbles:!0,composed:!0}))}})}};j.styles=[Ue];Dt([K({type:Boolean})],j.prototype,"open",2);j=Dt([U("app-history-panel")],j);const Xe=R`
  :host {
    display: block;
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 680px;
    z-index: 30;
  }

  .scrubber-card {
    background: #ffffff;
    border: 1px solid #d4d4d8;
    border-top: 3px solid #09090b;
    padding: 12px 18px;
    color: #09090b;
    font-family: 'Space Mono', monospace;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 900;
    padding: 4px 8px;
    font-family: 'Playfair Display', serif;
    letter-spacing: 0.05em;
    font-size: 0.9rem;
  }

  .status-tag.live {
    background: #f4f4f5;
    color: #09090b;
    border: 1px solid #d4d4d8;
  }

  .status-tag.historical {
    background: #09090b;
    color: #ffffff;
    border: 1px solid #09090b;
  }

  .indicator-box {
    width: 6px;
    height: 6px;
    background: currentColor;
  }

  .time-display {
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'Space Mono', monospace;
    color: #09090b;
  }

  .close-scrubber-btn {
    width: 26px;
    height: 26px;
    background: #f4f4f5;
    border: 1px solid #d4d4d8;
    color: #71717a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .close-scrubber-btn:hover {
    color: #ffffff;
    background: #09090b;
    border-color: #09090b;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  input[type="range"] {
    flex: 1;
    -webkit-appearance: none;
    background: #f4f4f5;
    height: 6px;
    border: 1px solid #d4d4d8;
    outline: none;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #09090b;
    border: 1px solid #09090b;
    cursor: pointer;
  }

  .return-btn {
    padding: 4px 10px;
    border: 1px solid #09090b;
    background: #09090b;
    color: #ffffff;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: 'Playfair Display', serif;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  .return-btn:hover {
    background: #27272a;
  }
`;function Ye(s){if(!s.open)return d``;const t=s.isLive?"LIVE BOARD":new Date(s.current).toLocaleString();return d`
    <div class="scrubber-card">
      <div class="top-row">
        <div class="status-tag ${s.isLive?"live":"historical"}">
          <div class="indicator-box"></div>
          <span>${s.isLive?"LIVE":"HISTORICAL SNAPSHOT"}</span>
        </div>

        <div class="time-display">${t}</div>

        <div style="display: flex; align-items: center; gap: 8px;">
          ${s.isLive?d`
            <div style="font-size: 0.75rem; color: #71717a;">${s.totalEdits} EDITS</div>
          `:d`
            <button class="return-btn" @click=${s.onReturnLive}>
              RETURN LIVE
            </button>
          `}
          <button class="close-scrubber-btn" title="Close Time Travel Mode" @click=${s.onClose}>${ct}</button>
        </div>
      </div>

      <div class="slider-row">
        <span style="font-size: 0.7rem; color: #71717a;">PAST</span>
        <input
          type="range"
          .min=${String(s.earliest)}
          .max=${String(s.latest)}
          .value=${String(s.current)}
          @input=${e=>s.onScrub(Number(e.target.value))}
        />
        <span style="font-size: 0.7rem; color: #71717a;">NOW</span>
      </div>
    </div>
  `}var je=Object.defineProperty,Ze=Object.getOwnPropertyDescriptor,Rt=(s,t,e,i)=>{for(var o=i>1?void 0:i?Ze(t,e):t,n=s.length-1,r;n>=0;n--)(r=s[n])&&(o=(i?r(t,e,o):r(o))||o);return i&&o&&je(t,e,o),o};let Z=class extends x{constructor(){super(...arguments),this.open=!1,this.unsubscribeHistoryStore=null,this.unsubscribeBoardStore=null}connectedCallback(){super.connectedCallback(),this.unsubscribeHistoryStore=v.subscribe(()=>this.requestUpdate()),this.unsubscribeBoardStore=c.subscribe(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribeHistoryStore?.(),this.unsubscribeBoardStore?.()}handleScrub(s){v.setCurrentScrubberTimestamp(s),c.setIsLive(!1),this.dispatchEvent(new CustomEvent("time-travel-scrub",{detail:{timestamp:s},bubbles:!0,composed:!0}))}handleReturnLive(){c.setIsLive(!0);const{latest:s}=v.getTimeline();v.setCurrentScrubberTimestamp(s),this.dispatchEvent(new CustomEvent("return-live",{bubbles:!0,composed:!0}))}handleClose(){this.open=!1,c.getIsLive()||this.handleReturnLive(),this.dispatchEvent(new CustomEvent("time-travel-closed",{bubbles:!0,composed:!0}))}render(){const s=c.getIsLive(),t=v.getTimeline();return Ye({open:this.open,isLive:s,...t,onScrub:e=>this.handleScrub(e),onReturnLive:()=>this.handleReturnLive(),onClose:()=>this.handleClose()})}};Z.styles=[Xe];Rt([K({type:Boolean})],Z.prototype,"open",2);Z=Rt([U("app-time-scrubber")],Z);class We{async fetchInitialBoard(t="1080x1080"){try{const i=await(await fetch(`/api/board?preset=${t}`)).json();return i.success?i.pixels||[]:[]}catch(e){return console.warn("Fallback: Failed to fetch board via REST API",e),[]}}async fetchSnapshotAt(t,e="1080x1080"){try{const o=await(await fetch(`/api/board/snapshot?timestamp=${t}&preset=${e}`)).json();return o.success?o.pixels||[]:[]}catch(i){return console.error("Failed to fetch board snapshot",i),[]}}}class Fe{constructor(){this.ws=null,this.listeners=new Set,this.isConnected=!1,this.reconnectTimer=null,this.currentPreset="1080x1080",this.connect()}setPreset(t){this.currentPreset=t,this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify({type:"JOIN_PRESET",data:{preset:t}}))}connect(){const t=window.location.protocol==="https:"?"wss:":"ws:",e=window.location.host,i=`${t}//${e}/ws`;try{this.ws=new WebSocket(i),this.ws.onopen=()=>{this.isConnected=!0,this.emit({type:"CONNECTED",data:{}}),this.setPreset(this.currentPreset)},this.ws.onmessage=o=>{try{const n=JSON.parse(o.data);this.emit(n)}catch(n){console.error("WebSocket parse error:",n)}},this.ws.onclose=()=>{this.isConnected=!1,this.emit({type:"DISCONNECTED",data:{}}),this.scheduleReconnect()},this.ws.onerror=o=>{console.warn("WebSocket error:",o)}}catch{this.scheduleReconnect()}}scheduleReconnect(){this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=setTimeout(()=>this.connect(),2e3)}sendEdit(t){this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify({type:"EDIT_PIXEL",data:{...t,boardId:t.boardId||this.currentPreset}}))}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(t){this.listeners.forEach(e=>e(t))}}class Ke{async fetchPixelHistory(t,e,i="1080x1080"){try{const n=await(await fetch(`/api/pixel/history?x=${t}&y=${e}&preset=${i}`)).json();return n.success?n.history||[]:[]}catch(o){return console.error("Failed to fetch pixel history",o),[]}}async fetchHistoryTimeline(t="1080x1080"){try{const i=await(await fetch(`/api/history/timeline?preset=${t}`)).json();return i.success?{earliest:i.earliest||Date.now(),latest:i.latest||Date.now(),totalEdits:i.totalEdits||0}:{earliest:Date.now(),latest:Date.now(),totalEdits:0}}catch{return{earliest:Date.now(),latest:Date.now(),totalEdits:0}}}}function _t(){const s=typeof window<"u"?window.innerWidth:1024;let t="desktop";s<600?t="mobile":s<1024&&(t="tablet");const e=typeof document<"u"&&document.referrer?document.referrer:"",i=e?e.replace(/^https?:\/\//,"").split("/")[0]:"direct",o=typeof window<"u"?`${window.innerWidth}x${window.innerHeight}`:"unknown",n=typeof navigator<"u"?navigator.language:"en-US",r=typeof Intl<"u"&&Intl.DateTimeFormat?Intl.DateTimeFormat().resolvedOptions().timeZone:"unknown";return{deviceType:t,screenResolution:o,referrer:i,language:n,timeZone:r}}class qe{constructor(){this.lastTrackedPath=null}trackPageView(t=window.location.pathname,e){if(this.lastTrackedPath===t)return;this.lastTrackedPath=t;const i=_t(),o={path:t,title:e||(typeof document<"u"?document.title:"Pixel Picker"),timestamp:new Date().toISOString(),deviceContext:i};this.postToFirestore(o)}trackEvent(t,e){const i=_t(),o={name:t,params:e,timestamp:new Date().toISOString(),deviceContext:i};this.postToFirestoreEvent(o)}async postToFirestore(t){try{const e="https://firestore.googleapis.com/v1/projects/geireann/databases/(default)/documents/pixelpicker_analytics",i={fields:{path:{stringValue:t.path},title:{stringValue:t.title||"Pixel Picker"},deviceType:{stringValue:t.deviceContext.deviceType},screenResolution:{stringValue:t.deviceContext.screenResolution},referrer:{stringValue:t.deviceContext.referrer},language:{stringValue:t.deviceContext.language},timeZone:{stringValue:t.deviceContext.timeZone},timestamp:{stringValue:t.timestamp}}};typeof fetch<"u"&&await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})}catch{}}async postToFirestoreEvent(t){try{const e="https://firestore.googleapis.com/v1/projects/geireann/databases/(default)/documents/pixelpicker_events",i={fields:{name:{stringValue:t.name},params:{stringValue:JSON.stringify(t.params||{})},deviceType:{stringValue:t.deviceContext.deviceType},timestamp:{stringValue:t.timestamp}}};typeof fetch<"u"&&await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})}catch{}}}const Lt=new qe,dt=new We,pt=new Fe,Ut=new Ke;async function zt(){const s=B();c.setPreset(s),pt.setPreset(s),Lt.trackPageView(window.location.pathname);const t=document.getElementById("canvas-board");t&&t.centerBoard&&t.centerBoard();const e=await dt.fetchInitialBoard(s);c.setPixels(e);const i=await Ut.fetchHistoryTimeline(s);v.setTimeline(i.earliest,i.latest,i.latest,i.totalEdits)}zt();window.addEventListener("popstate",()=>{zt()});pt.subscribe(s=>{if(s.type==="INIT"){const{pixels:t,activeUsers:e,preset:i}=s.data;i&&i===c.getPreset()&&(t&&c.setPixels(t),e&&Pt(e))}else if(s.type==="PIXEL_UPDATED"){const t=s.data,e=c.getPreset();if((t.boardId||e)===e&&c.getIsLive()){c.updatePixel(t);const o=document.getElementById("canvas-board");o&&o.triggerPixelFlip&&o.triggerPixelFlip(t.x,t.y)}}else s.type==="USER_COUNT_UPDATED"&&Pt(s.data.activeUsers)});function Pt(s){c.setActiveUsers(s);const t=document.getElementById("active-users-count");t&&(t.textContent=`${s} CONNECTED`)}window.addEventListener("apply-edit",s=>{const e={...s.detail,boardId:c.getPreset()};pt.sendEdit(e),Lt.trackEvent("apply_edit",{boardId:e.boardId,type:e.pixelType})});window.addEventListener("toggle-time-travel",s=>{const t=s,e=document.getElementById("time-scrubber");e&&(e.open=t.detail.open)});window.addEventListener("open-pixel-history",async s=>{const t=s,{x:e,y:i}=t.detail,o=c.getPreset(),n=await Ut.fetchPixelHistory(e,i,o);v.setPixelHistory(n);const r=document.getElementById("history-panel");r&&(r.open=!0)});window.addEventListener("time-travel-scrub",async s=>{const t=s,{timestamp:e}=t.detail,i=c.getPreset(),o=await dt.fetchSnapshotAt(e,i);c.setPixels(o)});window.addEventListener("return-live",async()=>{const s=c.getPreset(),t=await dt.fetchInitialBoard(s);c.setPixels(t)});window.addEventListener("open-help",()=>{const s=document.getElementById("intro-modal");s&&(s.open=!0)});
