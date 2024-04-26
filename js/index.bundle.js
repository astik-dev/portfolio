(()=>{"use strict";const e=document,t=t=>e.querySelector(t),n=t=>e.querySelectorAll(t),r={id:"1K842-NO5cQoYdsCjDdWzTbxwYfTmaysR4V8oSBI0qMo",get link(){return`https://opensheet.elk.sh/${this.id}/`},fetchJSON:function(e,t=3){return fetch(this.link+e).then((e=>{if(!e.ok)throw new Error("Response was not ok");return e.json()})).catch((n=>{if(console.error("Error fetching JSON:",n),t<=0)throw new Error("Max retries exceeded");return new Promise((n=>{setTimeout((()=>{n(this.fetchJSON(e,t-1))}),1500)}))}))}};function s(e){"undefined"!=typeof dataLayer&&Array.isArray(dataLayer)&&dataLayer.push(e)}function o(){const e=t(".header__container"),n="header__container_open-burger";e.classList.contains(n)||s({event:"open_burgerMenu"}),e.classList.toggle(n)}const i={imgBasePath:{local:"img/",external:"https://raw.githubusercontent.com/astik-dev/portfolio/content/images/"},px1:"img/1x1.png",fullPath:function(e,t){return this.imgBasePath[e]+t},newWebpPic:function(e,t,n,r,s){const o=s?"data-src":"srcset",i=n.split(".").pop(),c={jpg:"jpeg"}[i]||i;return`<picture>\n\t\t\t\t\t<source type="image/webp" ${o}="${this.fullPath(e,t)}">\n\t\t\t\t\t<source type="image/${c}" ${o}="${this.fullPath(e,n)}">\n\t\t\t\t\t${this.newImg(e,n,r,s)}\n\t\t\t\t</picture>`},newImg:function(e,t,n,r){const s=this.fullPath(e,t);return`<img src=${r?`"${this.px1}" data-src="${s}"`:`"${s}"`} alt="${n}">`},loadPictureSources:function(e){e.querySelectorAll("source").forEach((e=>{e.srcset=e.dataset.src}));const t=e.querySelector("img");t.src=t.dataset.src}};let c=!0;function a(r,o){if(!(o&&o.classList.contains("projects__item_empty")||1!=c)){if(c=!1,!t(".open-project-popup")&&void 0!==o){function a(e){let r=".project-popup__image-swiper-wrapper .swiper-slide";t(r)&&("add"==e?n(r).forEach((e=>{e.addEventListener("scroll",p,{once:!0})})):"remove"==e&&n(r).forEach((e=>{e.removeEventListener("scroll",p)})))}function p(e){let t=e.target.querySelector("a").href,n=t.indexOf("/projects/")+10;s({event:"project_slideScroll",projectTrimmedLink:t.substring(n)})}let u;!function(){const t=window.innerWidth-e.documentElement.clientWidth;e.documentElement.style.setProperty("--scroll-width",`${t}px`)}(),a("remove"),n(".projects__item").forEach(((e,t)=>{o==e&&(u=t)}));let _=r[u].folder,d=r[u].title,h=r[u].description,g=r[u].repository,f=r[u].demo,m=r[u].screenshots;const w=t(".project-popup__container h3"),v=t(".project-popup__container p");function j(e){let t="";for(let n=1;n<=e;n++){const e=`projects/${_}/full-size/${n}`;t+=`<div class="project-popup__image-slide swiper-slide">\n\t\t\t\t\t\t\t\t\t\t<a href="${i.fullPath("external",e)}.jpeg" target="_blank">\n\t\t\t\t\t\t\t\t\t\t\t${i.newWebpPic("external",e+".webp",e+".jpeg",`Project image ${n}`,"lazy")}\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>`}return t}w.textContent=d,v.textContent=h,v.scrollTop=0,[g,f].forEach(((e,n)=>{const r=t(`.project-popup__btn:nth-child(${n+1})`),s=""==e;r.classList.toggle("project-popup__btn_disabled",s),s?r.removeAttribute("href"):r.href=e})),t(".project-popup__btns").classList.toggle("project-popup__btns_disabled",""==g&&""==f),t(".project-popup__image-swiper-wrapper").innerHTML=j(m),l.slideTo(0,1,!1),a("add"),setTimeout((()=>{n(".project-popup__image-slide:nth-child(-n+2) picture").forEach(((e,n)=>{if(i.loadPictureSources(e),0==n){const n=e.querySelector("img");n.addEventListener("load",(()=>{n.scrollHeight>t(".project-popup__image").clientHeight&&setTimeout((()=>{t(".project-popup__image-scroll").classList.add("project-popup__image-scroll_animation")}),600)}))}}))}),300)}t("body").classList.toggle("open-project-popup"),setTimeout((()=>{c=!0}),300)}}const l=new Swiper(".project-popup__image-swiper",{navigation:{nextEl:".project-popup__image .swiper-nav_right",prevEl:".project-popup__image .swiper-nav_left"},pagination:{el:".project-popup__swiper-pagination",type:"fraction"},simulateTouch:!1,allowTouchMove:!1,on:{slideChange:function(){s({event:"project_slideChange"});const e=t(".project-popup__image-slide.swiper-slide-next + .project-popup__image-slide picture");e&&setTimeout((()=>{e.querySelector("img").src!=i.px1&&i.loadPictureSources(e)}),300)}}});function p(e,t){t.querySelector(e)&&t.querySelectorAll(e).forEach((e=>{e.remove()}))}const u="#fa1111",_="#fab43c",d="#2CB67D",h="Avatar";let g=0;const f={cssClass:"projects__btn-load-more",create:function(e){t(".projects__container").insertAdjacentHTML("beforeend",`<button class="${this.cssClass}">Load More</button>`),this.elem=t(`.${this.cssClass}`),this.elem.addEventListener("click",(()=>{w(e)}))}};function m({folder:e,title:t}){const n="projects/"+e+"/800",r=n+".webp",s=n+".jpeg";return`\n\t\t<article class="projects__item">\n\t\t\t${i.newWebpPic("external",r,s,t,"lazy")}\n\t\t\t<div class="projects__item-title">\n\t\t\t\t<h5>${t}</h5>\n\t\t\t</div>\n\t\t</article>\n\t`}function w(e){const n=t(".projects__items"),r=e.length-g,s=e.length-r,o=Math.min(4+s,e.length);0==g&&p(".projects__item_empty",n);for(let r=s;r<o;r++)n.insertAdjacentHTML("beforeend",m(e[r])),".projects__item:last-child picture",new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting&&i.loadPictureSources(e.target)}))}),{rootMargin:"200px 0px 200px 0px"}).observe(t(".projects__item:last-child picture"));0==s&&e.length>o?f.create(e):f.elem&&r<=4&&f.elem.remove(),g=o}let v;r.fetchJSON("projects").then((e=>{v=e,w(v)})),r.fetchJSON("skills").then((e=>function(e){const n=t(".skills__items");p(".skills__item_empty",n),e.forEach((e=>{n.insertAdjacentHTML("beforeend",function({name:e,img:t,imgWEBP:n}){const r=`skills/${t}`;return`\n\t\t<article class="skills__item">\n\t\t\t${n?i.newWebpPic("external",`skills/${n}`,r,e):i.newImg("external",r,e)}\n\t\t\t<h4>${e}</h4>\n\t\t</article>\n\t`}(e))}))}(e))),r.fetchJSON("reviews").then((e=>function(e){e.sort(((e,t)=>-(e.text.length-t.text.length)));const n=t(".reviews__swiper-wrapper");p(".reviews__slide_empty",n),e.forEach((e=>{n.insertAdjacentHTML("beforeend",function({avatar:e,name:t,grade:n,text:r,date:s,link:o,linkText:c}){const a=""==e?i.newImg("local","reviews/user-avatar.svg",h):i.newWebpPic("external",`reviews/${e}.webp`,`reviews/${e}.jpeg`,h),l=(n=+n)<5?u:n<7?_:d;return`\n        <div class="reviews__slide swiper-slide">\n            <div class="reviews__slide-top">\n                ${a}\n                <h5>${t}</h5>\n                <h4 class="reviews__slide-grade">\n                    <span style="color: ${l};">${n}/10</span>\n                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 47.94 47.94" xml:space="preserve"> <path fill="${l}" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/> </svg>\n                </h4>\n            </div>\n            <p>${r}</p>\n            <div class="reviews__slide-bottom">\n                <span>${s}</span>\n                <a href="${o}" target="_blank" title="Go to source">${c}</a>\n            </div>\n        </div>\n    `}(e))})),new Swiper(".reviews__swiper",{pagination:{el:".reviews__swiper-pagination",type:"fraction"},navigation:{nextEl:".reviews .swiper-nav_right",prevEl:".reviews .swiper-nav_left"},autoHeight:!0,grabCursor:!0,breakpoints:{767.5:{resistanceRatio:0}},effect:"flip",speed:450,on:{slideChange:function(){s({event:"reviews_slideChange"})}}})}(e))),r.fetchJSON("contacts").then((e=>function(e){const n=t(".contacts__items");p(".contacts__item_empty",n),e.forEach((e=>{n.insertAdjacentHTML("beforeend",function({link:e,title:t,img:n,imgWEBP:r}){const s=`contacts/${n}`;return`\n        <a href="${e}" target="_blank" title="${t}" class="contacts__item">\n            ${r?i.newWebpPic("external",`contacts/${r}`,s,t):i.newImg("external",s,t)}\n        </a>\n    `}(e))}))}(e))),e.addEventListener("click",(e=>{const n=e.target.closest(".header__burger"),r=e.target.closest(".projects__item"),s=e.target.closest(".project-popup__close");n?o():r||s?a(v,r||s):e.target.classList.contains("project-popup")?a():e.target.matches('.header__menu a[href*="#"]')&&(e.preventDefault(),function(e){const n=window.pageYOffset,r=t(e).offsetTop-t(".header").offsetHeight,s=r>n?r-n:n-r;if(window.innerWidth<575.5&&o(),s<100)return void scrollTo(0,r);let i=Math.min(Math.round(s/100),20);const c=Math.round(s/25);let a=r>n?n+c:n-c,l=0;const p=r>n?1:-1;for(let e=n;1===p?e<r:e>r;e+=p*c)setTimeout((e=>{window.scrollTo(0,e)}),l*i,a),a+=p*c,(1===p?a>r:a<r)&&(a=r),l++}(e.target.getAttribute("href")))}))})();