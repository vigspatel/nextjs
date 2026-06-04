module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},64240,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},79405,a=>{"use strict";var b=a.i(7997),c=a.i(94474);a.s(["JsonLdScript",0,function({yoastSeo:a}){let d=(0,c.getYoastSchema)(a);return d?(0,b.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(d)}}):null}])},26758,a=>{a.v("/_next/static/media/favicon.0x3dzn~oxb6tn.ico"+(globalThis.NEXT_CLIENT_ASSET_SUFFIX||""))},38872,a=>{"use strict";let b={src:a.i(26758).default,width:256,height:256};a.s(["default",0,b])},64256,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/app/contact/ContactForm.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/app/contact/ContactForm.tsx <module evaluation>","default")},98385,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/app/contact/ContactForm.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/app/contact/ContactForm.tsx","default")},57856,a=>{"use strict";a.i(64256);var b=a.i(98385);a.n(b)},60978,a=>{"use strict";var b=a.i(7997),c=a.i(79405),d=a.i(67613),e=a.i(90919),f=a.i(94474),g=a.i(4927),h=a.i(15559),i=a.i(57856);let j=g.gql`
  query ContactPage($slug: String!) {
    pages(where: { name: $slug }) {
      nodes {
        title
        content
        contactSection {
          contactTitle
          contactSubtitle
          contactEmail
          contactPhone
          contactAddress
        }
        seo {
          title
          metaDesc
          metaKeywords
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          canonical
          schema {
            raw
          }
        }
      }
    }
  }
`;async function k(){try{let a=new h.GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL||"https://bluereeftech.com/demo-next-js/graphql"),b=await a.request(e.GET_PAGE_BY_SLUG,{slug:"contact"}),c=b.pages?.nodes?.[0];if(!c)return{title:"Contact Us",description:"Get in touch with us"};return(0,f.generateSeoMetadata)({title:c.title,description:c.content?.substring(0,160),url:"https://yourdomain.com/contact",yoastSeo:c.seo})}catch(a){return console.error("Error fetching Yoast SEO data:",a),{title:"Contact Us",description:"Get in touch with us"}}}async function l(){let a,e=null;try{let b=await d.default.query({query:j,variables:{slug:"contact"},errorPolicy:"all",fetchPolicy:"no-cache"}),c=b?.data;e=c?.pages?.nodes?.[0]??null,a=e?.seo}catch(a){console.error("GraphQL error:",a)}let f=e?.contactSection;return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c.JsonLdScript,{yoastSeo:a}),(0,b.jsxs)("div",{className:"bg-indigo-900 pt-32 pb-16 text-center text-white relative overflow-hidden",children:[(0,b.jsx)("div",{className:"absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"}),(0,b.jsxs)("div",{className:"relative z-10 max-w-4xl mx-auto px-6",children:[(0,b.jsx)("h1",{className:"text-4xl md:text-5xl font-extrabold mb-4",children:f?.contactTitle||"Get In Touch"}),(0,b.jsx)("p",{className:"text-indigo-200 text-lg",children:"We'd love to hear from you and answer your questions"})]})]}),(0,b.jsx)("section",{id:"contact",className:"py-24 bg-white flex items-center",children:(0,b.jsxs)("div",{className:"max-w-4xl mx-auto px-6 w-full",children:[(0,b.jsxs)("div",{className:"text-center mb-16",children:[(0,b.jsx)("span",{className:"text-indigo-600 font-semibold text-sm uppercase tracking-widest",children:"Reach Out"}),(0,b.jsx)("h2",{className:"text-4xl font-bold mt-2 mb-4",children:f?.contactTitle||"Get In Touch"}),f?.contactSubtitle&&(0,b.jsx)("p",{className:"text-gray-500 text-lg",children:f.contactSubtitle})]}),(0,b.jsxs)("div",{className:"grid md:grid-cols-2 gap-16",children:[(0,b.jsxs)("div",{className:"space-y-6",children:[f?.contactEmail&&(0,b.jsxs)("div",{className:"flex items-start gap-4",children:[(0,b.jsx)("div",{className:"w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0",children:"✉️"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"font-semibold text-gray-700",children:"Email"}),(0,b.jsx)("a",{href:`mailto:${f.contactEmail}`,className:"text-indigo-600 hover:underline",children:f.contactEmail})]})]}),f?.contactPhone&&(0,b.jsxs)("div",{className:"flex items-start gap-4",children:[(0,b.jsx)("div",{className:"w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0",children:"📞"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"font-semibold text-gray-700",children:"Phone"}),(0,b.jsx)("a",{href:`tel:${f.contactPhone}`,className:"text-indigo-600 hover:underline",children:f.contactPhone})]})]}),f?.contactAddress&&(0,b.jsxs)("div",{className:"flex items-start gap-4",children:[(0,b.jsx)("div",{className:"w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0",children:"📍"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"font-semibold text-gray-700",children:"Address"}),(0,b.jsx)("p",{className:"text-gray-500",children:f.contactAddress})]})]})]}),(0,b.jsx)(i.default,{})]})]})})]})}a.s(["default",0,l,"dynamic",0,"force-dynamic","generateMetadata",0,k])},29885,a=>{a.n(a.i(60978))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-mj5fg._.js.map