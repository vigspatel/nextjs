import { JsonLdScript } from "@/components/JsonLdScript";
import client from "@/lib/apolloClient";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Page } from "@/lib/types";
import { gql } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import { Metadata } from "next";

const TESTIMONIALS_QUERY = gql`
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
        slug: "testimonials",
      },
    );

    const page = data.pages?.nodes?.[0];
    if (!page) {
      return {
        title: "Testimonials",
        description: "See what our clients say about us",
      };
    }

    return generateSeoMetadata({
      title: page.title,
      description: page.content?.substring(0, 160),
      url: "https://yourdomain.com/testimonials",
      yoastSeo: page.seo,
    });
  } catch (error) {
    console.error("Error fetching Yoast SEO data:", error);
    return {
      title: "Testimonials",
      description: "See what our clients say about us",
    };
  }
}

export default async function TestimonialsPage() {
  let page: any = null;
  let yoastData = null;

  try {
    const { data }: any = await client.query({
      query: TESTIMONIALS_QUERY,
      variables: { slug: "testimonials" },
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });
    page = data?.pages?.nodes?.[0];
    yoastData = page?.seo;
  } catch (e) {
    console.error("GraphQL error:", e);
  }

  const testimonials = page?.testimonialsSection;

  return (
    <>
      <JsonLdScript yoastSeo={yoastData} />
      <div className="bg-indigo-900 pt-32 pb-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {testimonials?.testimonialsTitle || "Client Love"}
          </h1>
          <p className="text-indigo-200 text-lg">
            See what our amazing customers have to say about us
          </p>
        </div>
      </div>
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center"
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
              (
                t: {
                  testimonialQuote: string;
                  testimonialName: string;
                  testimonialRole: string;
                },
                i: number,
              ) => (
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
    </>
  );
}
