import { JsonLdScript } from "@/components/JsonLdScript";
import client from "@/lib/apolloClient";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Page } from "@/lib/types";
import { gql } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import { Metadata } from "next";
import Image from "next/image";

const PORTFOLIO_QUERY = gql`
  query PortfolioPage($slug: String!) {
    pages(where: { name: $slug }) {
      nodes {
        title
        content
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
        slug: "portfolio",
      },
    );

    const page = data.pages?.nodes?.[0];
    if (!page) {
      return {
        title: "Portfolio",
        description: "View our latest work",
      };
    }

    return generateSeoMetadata({
      title: page.title,
      description: page.content?.substring(0, 160),
      url: "https://yourdomain.com/portfolio",
      yoastSeo: page.seo,
    });
  } catch (error) {
    console.error("Error fetching Yoast SEO data:", error);
    return {
      title: "Portfolio",
      description: "View our latest work",
    };
  }
}

export default async function PortfolioPage() {
  let page: any = null;
  let yoastData = null;

  try {
    const { data }: any = await client.query({
      query: PORTFOLIO_QUERY,
      variables: { slug: "portfolio" },
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });
    page = data?.pages?.nodes?.[0];
    yoastData = page?.seo;
  } catch (e) {
    console.error("GraphQL error:", e);
  }

  const portfolio = page?.portfolioSection;

  return (
    <>
      <JsonLdScript yoastSeo={yoastData} />
      <div className="bg-indigo-900 pt-32 pb-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {portfolio?.portfolioTitle || "Portfolio"}
          </h1>
          <p className="text-indigo-200 text-lg">
            Explore our latest projects and successes
          </p>
        </div>
      </div>
      <section id="portfolio" className="py-24 bg-white flex items-center">
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
            {(portfolio?.portfolioItems || []).map(
              (
                item: {
                  portfolioProjectTitle: string;
                  portfolioCategory: string;
                  portfolioUrl: string;
                  portfolioImage?: {
                    node: { sourceUrl: string; altText: string };
                  };
                },
                i: number,
              ) => (
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
                        alt={
                          item.portfolioImage.node.altText ||
                          item.portfolioProjectTitle
                        }
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
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
