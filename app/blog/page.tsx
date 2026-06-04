import { GET_ALL_POSTS, GET_PAGE_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Page } from "@/lib/types";
import client from "@/lib/wordpress";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await client.request<{ pages: { nodes: Page[] } }>(
      GET_PAGE_BY_SLUG,
      {
        slug: "blog",
      },
    );

    const page = data.pages?.nodes?.[0];
    if (page) {
      return generateSeoMetadata({
        title: page.title,
        description:
          page.seo?.metaDesc ||
          page.content?.substring(0, 160) ||
          "Read our latest articles and insights",

        url: "https://bluereeftech.com/demo-next-js/blog",
        yoastSeo: page.seo,
      });
    }
  } catch (error) {
    console.warn("Unable to load blog page SEO metadata", error);
  }

  return generateSeoMetadata({
    title: "Blog",
    description: "Read our latest articles and insights",
    url: "https://bluereeftech.com/demo-next-js/blog",
    yoastSeo: {
      metaDesc:
        "Read our latest articles and insights about web development, design, and digital marketing.",
      opengraphTitle: "Our Blog",
      opengraphDescription:
        "Read our latest articles and insights about web development, design, and digital marketing.",
    },
  });
}

export default async function BlogPage() {
  let posts: any[] = [];

  try {
    const data = await client.request(GET_ALL_POSTS);
    posts = data?.posts?.nodes || [];
  } catch (err) {
    // Prevent build failures when the remote GraphQL endpoint is unreachable
    // Log the error server-side and render an empty list so the build can continue.
    // Vercel / build logs will show the underlying issue.

    console.error("Failed to fetch posts for blog page:", err);
    posts = [];
  }

  return (
    <main>
      {posts.map((post: any) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  );
}
