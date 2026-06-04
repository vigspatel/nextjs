import { JsonLdScript } from "@/components/JsonLdScript";
import client from "@/lib/apolloClient";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Page } from "@/lib/types";
import { gql } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import { Metadata } from "next";
import ContactForm from "./ContactForm";

const CONTACT_QUERY = gql`
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
        slug: "contact",
      },
    );

    const page = data.pages?.nodes?.[0];
    if (!page) {
      return {
        title: "Contact Us",
        description: "Get in touch with us",
      };
    }

    return generateSeoMetadata({
      title: page.title,
      description: page.content?.substring(0, 160),
      url: "https://yourdomain.com/contact",
      yoastSeo: page.seo,
    });
  } catch (error) {
    console.error("Error fetching Yoast SEO data:", error);
    return {
      title: "Contact Us",
      description: "Get in touch with us",
    };
  }
}

export default async function ContactPage() {
  let page: Page | null = null;
  let yoastData: Page["seo"] | undefined = undefined;

  try {
    const result = await client.query({
      query: CONTACT_QUERY,
      variables: { slug: "contact" },
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });

    const data = result?.data as
      | {
          pages?: { nodes?: Page[] };
        }
      | undefined;

    page = (data?.pages?.nodes?.[0] ?? null) as Page | null;

    yoastData = page?.seo;
  } catch (error: unknown) {
    console.error("GraphQL error:", error);
  }

  const contact = (
    page as unknown as {
      contactSection?: {
        contactTitle?: string;
        contactSubtitle?: string;
        contactEmail?: string;
        contactPhone?: string;
        contactAddress?: string;
      };
    }
  )?.contactSection;

  return (
    <>
      <JsonLdScript yoastSeo={yoastData} />
      <div className="bg-indigo-900 pt-32 pb-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {contact?.contactTitle || "Get In Touch"}
          </h1>
          <p className="text-indigo-200 text-lg">
            We'd love to hear from you and answer your questions
          </p>
        </div>
      </div>
      <section id="contact" className="py-24 bg-white flex items-center">
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
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
