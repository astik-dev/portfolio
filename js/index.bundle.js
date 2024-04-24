(()=>{"use strict";const t=document,e=e=>t.querySelector(e),r=e=>t.querySelectorAll(e),n={id:"1K842-NO5cQoYdsCjDdWzTbxwYfTmaysR4V8oSBI0qMo",get link(){return`https://opensheet.elk.sh/${this.id}/`},fetchJSON:function(t,e=3){return fetch(this.link+t).then((t=>{if(!t.ok)throw new Error("Response was not ok");return t.json()})).catch((r=>{if(console.error("Error fetching JSON:",r),e<=0)throw new Error("Max retries exceeded");return new Promise((r=>{setTimeout((()=>{r(this.fetchJSON(t,e-1))}),1500)}))}))}};function s(t){"undefined"!=typeof dataLayer&&Array.isArray(dataLayer)&&dataLayer.push(t)}function o(){const t=e(".header__container"),r="header__container_open-burger";t.classList.contains(r)||s({event:"open_burgerMenu"}),t.classList.toggle(r)}const i={imgBasePath:{local:"img/",external:"https://raw.githubusercontent.com/astik-dev/portfolio/content/images/"},px1:"img/1x1.png",fullPath:function(t,e){return this.imgBasePath[t]+e},newWebpPic:function(t,e,r,n,s){const o=s?"data-src":"srcset",i=r.split(".").pop(),c={jpg:"jpeg"}[i]||i;return`<picture>\n\t\t\t\t\t<source type="image/webp" ${o}="${this.fullPath(t,e)}">\n\t\t\t\t\t<source type="image/${c}" ${o}="${this.fullPath(t,r)}">\n\t\t\t\t\t${this.newImg(t,r,n,s)}\n\t\t\t\t</picture>`},newImg:function(t,e,r,n){const s=this.fullPath(t,e);return`<img src=${n?`"${this.px1}" data-src="${s}"`:`"${s}"`} alt="${r}">`},loadPictureSources:function(t){t.querySelectorAll("source").forEach((t=>{t.srcset=t.dataset.src}));const e=t.querySelector("img");e.src=e.dataset.src}};let c=!0;function a(n,o){if(!(o&&o.classList.contains("projects__item_empty")||1!=c)){if(c=!1,!e(".open-project-popup")&&void 0!==o){function a(t){let n=".project-popup__image-swiper-wrapper .swiper-slide";e(n)&&("add"==t?r(n).forEach((t=>{t.addEventListener("scroll",p,{once:!0})})):"remove"==t&&r(n).forEach((t=>{t.removeEventListener("scroll",p)})))}function p(t){let e=t.target.querySelector("a").href,r=e.indexOf("/projects/")+10;s({event:"project_slideScroll",projectTrimmedLink:e.substring(r)})}let u;!function(){const e=window.innerWidth-t.documentElement.clientWidth;t.documentElement.style.setProperty("--scroll-width",`${e}px`)}(),a("remove"),r(".projects__item").forEach(((t,e)=>{o==t&&(u=e)}));let _=n[u].folder,d=n[u].title,h=n[u].description,g=n[u].repository,m=n[u].demo,f=n[u].screenshots;const w=e(".project-popup__container h3"),v=e(".project-popup__container p");function j(t){let e="";for(let r=1;r<=t;r++){const t=`projects/${_}/full-size/${r}`;e+=`<div class="project-popup__image-slide swiper-slide">\n\t\t\t\t\t\t\t\t\t\t<a href="${i.fullPath("external",t)}.jpeg" target="_blank">\n\t\t\t\t\t\t\t\t\t\t\t${i.newWebpPic("external",t+".webp",t+".jpeg",`Project image ${r}`,"lazy")}\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>`}return e}w.textContent=d,v.textContent=h,v.scrollTop=0,[g,m].forEach(((t,r)=>{const n=e(`.project-popup__btn:nth-child(${r+1})`),s=""==t;n.classList.toggle("project-popup__btn_disabled",s),s?n.removeAttribute("href"):n.href=t})),e(".project-popup__btns").classList.toggle("project-popup__btns_disabled",""==g&&""==m),e(".project-popup__image-swiper-wrapper").innerHTML=j(f),l.slideTo(0,1,!1),a("add"),setTimeout((()=>{r(".project-popup__image-slide:nth-child(-n+2) picture").forEach(((t,r)=>{if(i.loadPictureSources(t),0==r){const r=t.querySelector("img");r.addEventListener("load",(()=>{r.scrollHeight>e(".project-popup__image").clientHeight&&setTimeout((()=>{e(".project-popup__image-scroll").classList.add("project-popup__image-scroll_animation")}),600)}))}}))}),300)}e("body").classList.toggle("open-project-popup"),setTimeout((()=>{c=!0}),300)}}const l=new Swiper(".project-popup__image-swiper",{navigation:{nextEl:".project-popup__image .swiper-nav_right",prevEl:".project-popup__image .swiper-nav_left"},pagination:{el:".project-popup__swiper-pagination",type:"fraction"},simulateTouch:!1,allowTouchMove:!1,on:{slideChange:function(){s({event:"project_slideChange"});const t=e(".project-popup__image-slide.swiper-slide-next + .project-popup__image-slide picture");t&&setTimeout((()=>{t.querySelector("img").src!=i.px1&&i.loadPictureSources(t)}),300)}}});function p(t,e){e.querySelector(t)&&e.querySelectorAll(t).forEach((t=>{t.remove()}))}const u="#fa1111",_="#fab43c",d="#2CB67D";const h={cssClass:"projects__btn-load-more",create:function(t){e(".projects__container").insertAdjacentHTML("beforeend",`<button class="${this.cssClass}">Load More</button>`),this.elem=e(`.${this.cssClass}`),this.elem.addEventListener("click",(()=>{g(t,"load more")}))}};function g(t,n){const s=e(".projects__items");let o,c=4;if("start"==n)o=0,p(".projects__item_empty",s);else if("load more"==n){let e=r(".projects__item").length,n=t.length-e;n>c?(o=t.length-n,c+=o):(o=t.length-n,c=t.length,h.elem.remove())}for(let e=o;e<c;e++){const r="projects/"+t[e].folder+"/800",n=r+".webp",o=r+".jpeg",c=t[e].title;let a=`<article class="projects__item">\n\t\t\t\t\t\t\t\t${i.newWebpPic("external",n,o,c,"lazy")}\n\t\t\t\t\t\t\t\t<div class="projects__item-title">\n\t\t\t\t\t\t\t\t\t<h5>${t[e].title}</h5>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</article>`;s.insertAdjacentHTML("beforeend",a);let l=s.querySelector(".projects__item:last-child picture");new IntersectionObserver((t=>{t.forEach((t=>{t.isIntersecting&&i.loadPictureSources(t.target)}))}),{rootMargin:"200px 0px 200px 0px"}).observe(l)}"start"==n&&t.length>c&&h.create(t)}let m;n.fetchJSON("projects").then((t=>{m=t,g(m,"start")})),n.fetchJSON("skills").then((t=>function(t){const r=e(".skills__items");p(".skills__item_empty",r),t.forEach((t=>{const e=`skills/${t.img}`,n=t.name;let s=`<article class="skills__item">\n\t\t\t\t\t\t\t\t${t.imgWEBP?i.newWebpPic("external",`skills/${t.imgWEBP}`,e,n):i.newImg("external",e,n)}\n\t\t\t\t\t\t\t\t<h4>${t.name}</h4>\n\t\t\t\t\t\t\t</article>`;r.insertAdjacentHTML("beforeend",s)}))}(t))),n.fetchJSON("reviews").then((t=>function(t){t.sort(((t,e)=>-(t.text.length-e.text.length)));const r=e(".reviews__swiper-wrapper");p(".reviews__slide_empty",r),t.forEach((t=>{const e="Avatar",n=""==t.avatar?i.newImg("local","reviews/user-avatar.svg",e):i.newWebpPic("external",`reviews/${t.avatar}.webp`,`reviews/${t.avatar}.jpeg`,e);r.insertAdjacentHTML("beforeend",function(t,{name:e,grade:r,text:n,date:s,link:o,linkText:i}){const c=(r=+r)<5?u:r<7?_:d;return`\n        <div class="reviews__slide swiper-slide">\n            <div class="reviews__slide-top">\n                ${t}\n                <h5>${e}</h5>\n                <h4 class="reviews__slide-grade">\n                    <span style="color: ${c};">${r}/10</span>\n                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 47.94 47.94" xml:space="preserve"> <path fill="${c}" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/> </svg>\n                </h4>\n            </div>\n            <p>${n}</p>\n            <div class="reviews__slide-bottom">\n                <span>${s}</span>\n                <a href="${o}" target="_blank" title="Go to source">${i}</a>\n            </div>\n        </div>\n    `}(n,t))})),new Swiper(".reviews__swiper",{pagination:{el:".reviews__swiper-pagination",type:"fraction"},navigation:{nextEl:".reviews .swiper-nav_right",prevEl:".reviews .swiper-nav_left"},autoHeight:!0,grabCursor:!0,breakpoints:{767.5:{resistanceRatio:0}},effect:"flip",speed:450,on:{slideChange:function(){s({event:"reviews_slideChange"})}}})}(t))),n.fetchJSON("contacts").then((t=>function(t){const r=e(".contacts__items");p(".contacts__item_empty",r),t.forEach((t=>{const e=`contacts/${t.img}`,n=t.title,s=t.imgWEBP?i.newWebpPic("external",`contacts/${t.imgWEBP}`,e,n):i.newImg("external",e,n);let o=`<a href="${t.link}" target="_blank" title="${t.title}" class="contacts__item">\n\t\t\t\t\t\t\t\t  ${s}\n\t\t\t\t\t\t\t  </a>`;r.insertAdjacentHTML("beforeend",o)}))}(t))),t.addEventListener("click",(t=>{const r=t.target.closest(".header__burger"),n=t.target.closest(".projects__item"),s=t.target.closest(".project-popup__close");r?o():n||s?a(m,n||s):t.target.classList.contains("project-popup")?a():t.target.matches('.header__menu a[href*="#"]')&&(t.preventDefault(),function(t){const r=window.pageYOffset,n=e(t).offsetTop-e(".header").offsetHeight,s=n>r?n-r:r-n;if(window.innerWidth<575.5&&o(),s<100)return void scrollTo(0,n);let i=Math.min(Math.round(s/100),20);const c=Math.round(s/25);let a=n>r?r+c:r-c,l=0;const p=n>r?1:-1;for(let t=r;1===p?t<n:t>n;t+=p*c)setTimeout((t=>{window.scrollTo(0,t)}),l*i,a),a+=p*c,(1===p?a>n:a<n)&&(a=n),l++}(t.target.getAttribute("href")))}))})();