import { JsonLdScript } from "@/components/JsonLdScript";
import client from "@/lib/apolloClient";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Page } from "@/lib/types";
import { gql } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import { Metadata } from "next";
import Image from "next/image";

const ABOUT_QUERY = gql`
  query AboutPage($slug: String!) {
    pages(where: { name: $slug }) {
      nodes {
        title
        content
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
          pdfEmbedder
          videoEmbedder
          docEmbedder
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
        slug: "about",
      },
    );

    const page = data.pages?.nodes?.[0];
    if (!page) {
      return {
        title: "About Us",
        description: "Learn more about our company",
      };
    }

    return generateSeoMetadata({
      title: page.title,
      description: page.content?.substring(0, 160),
      url: "https://yourdomain.com/about",
      yoastSeo: page.seo,
    });
  } catch (error) {
    console.error("Error fetching Yoast SEO data:", error);
    return {
      title: "About Us",
      description: "Learn more about our company",
    };
  }
}
const getYoutubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};
export default async function AboutPage() {
  let page: any = null;
  let yoastData = null;

  try {
    const { data }: any = await client.query({
      query: ABOUT_QUERY,
      variables: { slug: "about" },
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });
    page = data?.pages?.nodes?.[0];
    yoastData = page?.seo;
  } catch (e) {
    console.error("GraphQL error:", e);
  }

  const about = page?.aboutSection;
  console.log("ABOUT DATA:", about);
  return (
    <>
      <JsonLdScript yoastSeo={yoastData} />

      {/* Hero Section */}
      <div className="bg-indigo-900 pt-32 pb-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {about?.aboutTitle || "About Us"}
          </h1>

          <p className="text-indigo-200 text-lg">
            Learn more about our mission and story
          </p>
        </div>
      </div>

      {/* About Section */}
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
                {about.aboutStats.map(
                  (
                    stat: {
                      statNumber: string;
                      statLabel: string;
                    },
                    i: number,
                  ) => (
                    <div key={i} className="border-l-4 border-indigo-500 pl-4">
                      <div className="text-3xl font-extrabold text-indigo-600">
                        {stat.statNumber}
                      </div>

                      <div className="text-gray-500 text-sm mt-1">
                        {stat.statLabel}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {about?.aboutImage?.node?.sourceUrl ? (
            <div className="relative rounded-2xl h-96 w-full overflow-hidden shadow-lg border border-gray-100">
              <Image
                src={about.aboutImage.node.sourceUrl}
                alt={
                  about.aboutImage.node.altText ||
                  about?.aboutTitle ||
                  "About Us"
                }
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

      {/* Video Section */}
      {about?.videoEmbedder && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Video</h2>

            <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
              <iframe
                src={getYoutubeEmbedUrl(about.videoEmbedder)}
                title="About Video"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* PDF Section */}
      {about?.pdfEmbedder && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">PDF Document</h2>

            <iframe
              src={about.pdfEmbedder}
              title="PDF Document"
              width="100%"
              height="800"
              className="border rounded-xl shadow-sm"
            />

            <div className="mt-4">
              <a
                href={about.pdfEmbedder}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Open PDF in New Tab
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Word Document Section */}
      {about?.docEmbedder && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Word Document</h2>

            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                about.docEmbedder,
              )}`}
              title="Word Document"
              width="100%"
              height="800"
              className="border rounded-xl shadow-sm"
            />

            <div className="mt-4">
              <a
                href={about.docEmbedder}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Download Word Document
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
