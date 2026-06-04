module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},64240,(a,b,c)=>{"use strict";function d(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(d=function(a){return a?c:b})(a)}c._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=d(b);if(c&&c.has(a))return c.get(a);var e={__proto__:null},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=f?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(e,g,h):e[g]=a[g]}return e.default=a,c&&c.set(a,e),e}},79405,a=>{"use strict";var b=a.i(7997),c=a.i(94474);a.s(["JsonLdScript",0,function({yoastSeo:a}){let d=(0,c.getYoastSchema)(a);return d?(0,b.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(d)}}):null}])},26758,a=>{a.v("/_next/static/media/favicon.0x3dzn~oxb6tn.ico"+(globalThis.NEXT_CLIENT_ASSET_SUFFIX||""))},38872,a=>{"use strict";let b={src:a.i(26758).default,width:256,height:256};a.s(["default",0,b])},19439,a=>{"use strict";var b=a.i(7997),c=a.i(79405),d=a.i(67613),e=a.i(90919),f=a.i(94474),g=a.i(4927),h=a.i(15559);let i=g.gql`
  query TestimonialsPage($slug: String!) {
    pages(where: { name: $slug }) {
      nodes {
        title
        content
        testimonialsSection {
          testimonialsTitle
          testimonialsItems {
            testimonialQuote
            testimonialName
            testimonialRole
          }
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
`;async function j(){try{let a=new h.GraphQLClient(process.env.NEXT_PUBLIC_WORDPRESS_API_URL||"https://bluereeftech.com/demo-next-js/graphql"),b=await a.request(e.GET_PAGE_BY_SLUG,{slug:"testimonials"}),c=b.pages?.nodes?.[0];if(!c)return{title:"Testimonials",description:"See what our clients say about us"};return(0,f.generateSeoMetadata)({title:c.title,description:c.content?.substring(0,160),url:"https://yourdomain.com/testimonials",yoastSeo:c.seo})}catch(a){return console.error("Error fetching Yoast SEO data:",a),{title:"Testimonials",description:"See what our clients say about us"}}}async function k(){let a=null,e=null;try{let{data:b}=await d.default.query({query:i,variables:{slug:"testimonials"},errorPolicy:"all",fetchPolicy:"no-cache"});a=b?.pages?.nodes?.[0],e=a?.seo}catch(a){console.error("GraphQL error:",a)}let f=a?.testimonialsSection;return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c.JsonLdScript,{yoastSeo:e}),(0,b.jsxs)("div",{className:"bg-indigo-900 pt-32 pb-16 text-center text-white relative overflow-hidden",children:[(0,b.jsx)("div",{className:"absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"}),(0,b.jsxs)("div",{className:"relative z-10 max-w-4xl mx-auto px-6",children:[(0,b.jsx)("h1",{className:"text-4xl md:text-5xl font-extrabold mb-4",children:f?.testimonialsTitle||"Client Love"}),(0,b.jsx)("p",{className:"text-indigo-200 text-lg",children:"See what our amazing customers have to say about us"})]})]}),(0,b.jsx)("section",{id:"testimonials",className:"py-24 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center",children:(0,b.jsxs)("div",{className:"max-w-6xl mx-auto px-6 w-full",children:[(0,b.jsxs)("div",{className:"text-center mb-16",children:[(0,b.jsx)("span",{className:"text-indigo-600 font-semibold text-sm uppercase tracking-widest",children:"Client Love"}),(0,b.jsx)("h2",{className:"text-4xl font-bold mt-2",children:f?.testimonialsTitle||"What Clients Say"})]}),(0,b.jsx)("div",{className:"grid md:grid-cols-3 gap-8",children:(f?.testimonialsItems||[]).map((a,c)=>(0,b.jsxs)("div",{className:"bg-white p-8 rounded-2xl shadow-sm border border-gray-100",children:[(0,b.jsx)("div",{className:"text-indigo-400 text-4xl mb-4",children:'"'}),(0,b.jsx)("p",{className:"text-gray-600 leading-relaxed mb-6 italic",children:a.testimonialQuote}),(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsx)("div",{className:"w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 font-bold text-lg flex-shrink-0",children:a.testimonialName?.charAt(0)||"?"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"font-bold text-gray-800",children:a.testimonialName}),(0,b.jsx)("div",{className:"text-sm text-gray-400",children:a.testimonialRole})]})]})]},c))})]})})]})}a.s(["default",0,k,"dynamic",0,"force-dynamic","generateMetadata",0,j])},64193,a=>{a.n(a.i(19439))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0nrdgip._.js.map