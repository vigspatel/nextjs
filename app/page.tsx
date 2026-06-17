import { getPageYoastData } from "@/lib/api";
import client from "@/lib/apolloClient";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Page } from "@/lib/types";
import { gql } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import {
  BarChart,
  Gauge,
  Laptop,
  Layout,
  Lightbulb,
  Megaphone,
  Paintbrush,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Target,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface YoastHeadJson {
  title?: string;
  description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: { url?: string } | Array<{ url?: string }>;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: { url?: string };
  canonical?: string;
  schema?: unknown;
}

interface YoastRestPage {
  title?: string;
  content?: string;
  yoast_head_json?: YoastHeadJson;
}

// IconRender component
const IconRender = ({ name }: { name?: string }) => {
  const normalized = name?.toLowerCase()?.trim() || "";

  if (normalized.includes("seo") || normalized.includes("search"))
    return <Search className="w-8 h-8" />;
  if (
    normalized.includes("performance") ||
    normalized.includes("speed") ||
    normalized.includes("fast")
  )
    return <Gauge className="w-8 h-8" />;
  if (
    normalized.includes("strategy") ||
    normalized.includes("target") ||
    normalized.includes("goal")
  )
    return <Target className="w-8 h-8" />;
  if (
    normalized.includes("ui") ||
    normalized.includes("ux") ||
    normalized.includes("design") ||
    normalized.includes("paint")
  )
    return <Paintbrush className="w-8 h-8" />;
  if (
    normalized.includes("mobile") ||
    normalized.includes("app") ||
    normalized.includes("phone")
  )
    return <Smartphone className="w-8 h-8" />;
  if (normalized.includes("web") || normalized.includes("globe"))
    return <Laptop className="w-8 h-8" />;
  if (
    normalized.includes("digital") ||
    normalized.includes("idea") ||
    normalized.includes("consult")
  )
    return <Lightbulb className="w-8 h-8" />;
  if (normalized.includes("marketing") || normalized.includes("social"))
    return <Megaphone className="w-8 h-8" />;
  if (normalized.includes("data") || normalized.includes("chart"))
    return <BarChart className="w-8 h-8" />;
  if (normalized.includes("rocket") || normalized.includes("launch"))
    return <Rocket className="w-8 h-8" />;
  if (
    normalized.includes("secure") ||
    normalized.includes("shield") ||
    normalized.includes("protect")
  )
    return <ShieldCheck className="w-8 h-8" />;
  if (normalized.includes("setting") || normalized.includes("system"))
    return <Settings className="w-8 h-8" />;

  if (name && name.length <= 4)
    return <span className="text-3xl leading-none inline-block">{name}</span>;

  return <Layout className="w-8 h-8" />;
};

const HOME_QUERY = gql`
  query HomePage {
    page(id: "/", idType: URI) {
      heroSection {
        heroHeading
        heroSubheading
        heroButtonText
        heroButtonUrl
        heroBackgroundImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      aboutSection {
        aboutTitle
        aboutContent
        aboutStats {
          statNumber
          statLabel
        }
        aboutImage {
          node {
            sourceUrl
            altText
          }
        }
      }
      servicesSection {
        servicesTitle
        servicesSubtitle
        servicesItems {
          serviceIcon
          serviceTitle
          serviceDescription
        }
      }
      portfolioSection {
        portfolioTitle
        portfolioItems {
          portfolioProjectTitle
          portfolioCategory
          portfolioUrl
          portfolioImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      testimonialsSection {
        testimonialsTitle
        testimonialsItems {
          testimonialQuote
          testimonialName
          testimonialRole
        }
      }
      contactSection {
        contactTitle
        contactSubtitle
        contactEmail
        contactPhone
        contactAddress
      }
    }
  }
`;

export const dynamic = "force-dynamic";

// Generate dynamic SEO metadata from Yoast data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const gqlClient = new GraphQLClient(
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
        "https://bluereeftech.com/demo-next-js/graphql",
    );

    const data = await gqlClient.request<{ pages: { nodes: Page[] } }>(
      GET_PAGE_BY_SLUG,
      {
        slug: "home",
      },
    );

    const page = data.pages?.nodes?.[0];
    if (page) {
      return generateSeoMetadata({
        title: page.title,
        description: page.content?.substring(0, 160),
        url: "https://bluereeftech.com/demo-next-js",
        yoastSeo: page.seo,
      });
    }
  } catch (error) {
    console.warn(
      "GraphQL metadata fetch failed; falling back to REST Yoast metadata.",
      error,
    );
  }

  try {
    const restPage = (await getPageYoastData("home")) as YoastRestPage | null;
    const yoastHeadJson = restPage?.yoast_head_json;

    if (yoastHeadJson) {
      const yoastSeo = {
        title: yoastHeadJson.title,
        metaDesc: yoastHeadJson.description,
        metaKeywords: yoastHeadJson.keywords,
        opengraphTitle: yoastHeadJson.og_title,
        opengraphDescription: yoastHeadJson.og_description,
        opengraphImage: yoastHeadJson.og_image
          ? {
              sourceUrl: Array.isArray(yoastHeadJson.og_image)
                ? yoastHeadJson.og_image[0]?.url
                : yoastHeadJson.og_image.url,
            }
          : undefined,
        twitterTitle: yoastHeadJson.twitter_title,
        twitterDescription: yoastHeadJson.twitter_description,
        twitterImage: yoastHeadJson.twitter_image
          ? { sourceUrl: yoastHeadJson.twitter_image.url }
          : undefined,
        canonical: yoastHeadJson.canonical,
        schema: yoastHeadJson.schema
          ? {
              raw:
                typeof yoastHeadJson.schema === "string"
                  ? yoastHeadJson.schema
                  : JSON.stringify(yoastHeadJson.schema),
            }
          : undefined,
      };

      return generateSeoMetadata({
        title: restPage.title || "Home",
        description:
          restPage.content?.substring(0, 160) || "Welcome to our website",
        url: "https://bluereeftech.com/demo-next-js",
        yoastSeo,
      });
    }
  } catch (error) {
    console.warn("REST Yoast metadata fetch failed", error);
  }

  return {
    title: "Home",
    description: "Welcome to our website",
  };
}

export default async function Home() {
  let page = null;

  try {
    const { data }: any = await client.query({
      query: HOME_QUERY,
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });
    page = data?.page;
  } catch (e) {
    console.error("GraphQL error:", e);
  }

  const hero = page?.heroSection;
  const about = page?.aboutSection;
  const services = page?.servicesSection;
  const portfolio = page?.portfolioSection;
  const testimonials = page?.testimonialsSection;
  const contact = page?.contactSection;
  console.log("ABOUT DATA:", about);
  return (
    <>
      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative min-h-[calc(100vh-72px)] flex flex-grow items-center justify-center text-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden"
      >
        {hero?.heroBackgroundImage?.node?.sourceUrl && (
          <Image
            src={hero.heroBackgroundImage.node.sourceUrl}
            alt={hero.heroBackgroundImage.node.altText || "Hero"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center absolute inset-0 z-0 opacity-50 mix-blend-screen"
          />
        )}
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            {hero?.heroHeading || "Welcome to Our Website"}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed">
            {hero?.heroSubheading || "We build amazing digital experiences"}
          </p>
          {hero?.heroButtonText && (
            <Link
              href={hero.heroButtonUrl?.replace(/^#/, "/") || "/contact"}
              className="inline-block bg-white text-indigo-600 font-bold px-8 py-4 rounded-full text-lg hover:bg-indigo-50 transition-colors shadow-lg"
            >
              {hero.heroButtonText}
            </Link>
          )}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
              Who We Are
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-6 leading-tight">
              {about?.aboutTitle || "About Us"}
            </h2>
            <div
              className="text-gray-600 leading-relaxed text-lg prose"
              dangerouslySetInnerHTML={{
                __html: about?.aboutContent || "Tell your story here.",
              }}
            />
            {about?.aboutStats?.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mt-10">
                {about.aboutStats.map((stat: any, i: number) => (
                  <div key={i} className="border-l-4 border-indigo-500 pl-4">
                    <div className="text-3xl font-extrabold text-indigo-600">
                      {stat.statNumber}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {stat.statLabel}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {about?.aboutImage?.node?.sourceUrl ? (
            <div className="relative rounded-2xl h-96 w-full overflow-hidden shadow-lg border border-gray-100">
              <Image
                src={about.aboutImage.node.sourceUrl}
                alt={about.aboutImage.node.altText || "About"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl h-96 w-full flex items-center justify-center text-indigo-300 text-6xl">
              🏢
            </div>
          )}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
              What We Do
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-4">
              {services?.servicesTitle || "Our Services"}
            </h2>
            {services?.servicesSubtitle && (
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                {services.servicesSubtitle}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(services?.servicesItems || []).map((s: any, i: number) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
              >
                <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 transition-colors duration-300 text-indigo-600 group-hover:text-white">
                  <IconRender name={s.serviceIcon || s.serviceTitle} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">
                  {s.serviceTitle}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {s.serviceDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
              Our Work
            </span>
            <h2 className="text-4xl font-bold mt-2">
              {portfolio?.portfolioTitle || "Portfolio"}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(portfolio?.portfolioItems || []).map((item: any, i: number) => (
              <a
                key={i}
                href={item.portfolioUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
              >
                {item.portfolioImage?.node?.sourceUrl ? (
                  <div className="relative h-56 w-full">
                    <Image
                      src={item.portfolioImage.node.sourceUrl}
                      alt={item.portfolioImage.node.altText || "Project"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-300 text-5xl">
                    🖼️
                  </div>
                )}
                <div className="p-6">
                  <span className="text-xs text-indigo-500 font-semibold uppercase tracking-widest">
                    {item.portfolioCategory}
                  </span>
                  <h3 className="text-lg font-bold mt-1 group-hover:text-indigo-600 transition-colors">
                    {item.portfolioProjectTitle}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50"
      >
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
              Client Love
            </span>
            <h2 className="text-4xl font-bold mt-2">
              {testimonials?.testimonialsTitle || "What Clients Say"}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(testimonials?.testimonialsItems || []).map(
              (t: any, i: number) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="text-indigo-400 text-4xl mb-4">"</div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">
                    {t.testimonialQuote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 font-bold text-lg flex-shrink-0">
                      {t.testimonialName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">
                        {t.testimonialName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t.testimonialRole}
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">
              Reach Out
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-4">
              {contact?.contactTitle || "Get In Touch"}
            </h2>
            {contact?.contactSubtitle && (
              <p className="text-gray-500 text-lg">{contact.contactSubtitle}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              {contact?.contactEmail && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Email</div>
                    <a
                      href={`mailto:${contact.contactEmail}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {contact.contactEmail}
                    </a>
                  </div>
                </div>
              )}
              {contact?.contactPhone && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Phone</div>
                    <a
                      href={`tel:${contact.contactPhone}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {contact.contactPhone}
                    </a>
                  </div>
                </div>
              )}
              {contact?.contactAddress && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700">Address</div>
                    <p className="text-gray-500">{contact.contactAddress}</p>
                  </div>
                </div>
              )}
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
