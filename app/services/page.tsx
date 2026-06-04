import { JsonLdScript } from "@/components/JsonLdScript";
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

const SERVICES_QUERY = gql`
  query ServicesPage($slug: String!) {
    pages(where: { name: $slug }) {
      nodes {
        title
        content
        servicesSection {
          servicesTitle
          servicesSubtitle
          servicesItems {
            serviceIcon
            serviceTitle
            serviceDescription
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
`;

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const gqlClient = new GraphQLClient(
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
        "https://bluereeftech.com/demo-next-js/graphql",
    );

    const data = await gqlClient.request<{ pages: { nodes: Page[] } }>(
      GET_PAGE_BY_SLUG,
      {
        slug: "services",
      },
    );

    const page = data.pages?.nodes?.[0];
    if (!page) {
      return {
        title: "Services",
        description: "View our services",
      };
    }

    return generateSeoMetadata({
      title: page.title,
      description: page.content?.substring(0, 160),
      url: "https://yourdomain.com/services",
      yoastSeo: page.seo,
    });
  } catch (error) {
    console.error("Error fetching Yoast SEO data:", error);
    return {
      title: "Services",
      description: "View our services",
    };
  }
}

export default async function ServicesPage() {
  let page: any = null;
  let yoastData = null;

  try {
    const { data }: any = await client.query({
      query: SERVICES_QUERY,
      variables: { slug: "services" },
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });
    page = data?.pages?.nodes?.[0];
    yoastData = page?.seo;
  } catch (e) {
    console.error("GraphQL error:", e);
  }

  const services = page?.servicesSection;

  return (
    <>
      <JsonLdScript yoastSeo={yoastData} />
      <div className="bg-indigo-900 pt-32 pb-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {services?.servicesTitle || "Our Services"}
          </h1>
          <p className="text-indigo-200 text-lg">
            Discover the wide array of solutions we offer
          </p>
        </div>
      </div>
      <section id="services" className="py-24 bg-gray-50 flex items-center">
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
            {(services?.servicesItems || []).map(
              (
                s: {
                  serviceIcon: string;
                  serviceTitle: string;
                  serviceDescription: string;
                },
                i: number,
              ) => (
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
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
