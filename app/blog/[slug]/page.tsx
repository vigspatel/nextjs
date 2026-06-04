import { JsonLdScript } from "@/components/JsonLdScript";
import { GET_POST_BY_SLUG } from "@/lib/queries";
import { generateSeoMetadata } from "@/lib/seo";
import { Post } from "@/lib/types";
import { GraphQLClient } from "graphql-request";
import { Metadata } from "next";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    "https://bluereeftech.com/demo-next-js/graphql",
);

// Generate metadata for this page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const data = await client.request<{ posts: { nodes: Post[] } }>(
    GET_POST_BY_SLUG,
    {
      slug,
    },
  );

  const post = data.posts?.nodes?.[0];
  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return generateSeoMetadata({
    title: post.title,
    description: post.excerpt || post.content?.substring(0, 160),
    url: `https://bluereeftech.com/demo-next-js/blog/${post.slug}`,
    image: post.featuredImage?.node.sourceUrl,
    yoastSeo: post.seo,
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const data = await client.request<{ posts: { nodes: Post[] } }>(
    GET_POST_BY_SLUG,
    {
      slug,
    },
  );

  const post = data.posts?.nodes?.[0];
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <JsonLdScript yoastSeo={post.seo} />

      <article className="max-w-2xl mx-auto px-4 py-12">
        {post.featuredImage && (
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText}
            className="w-full h-auto mb-8 rounded-lg"
          />
        )}

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        {post.author && (
          <div className="text-gray-600 mb-4">
            By {post.author.node.name}
            {post.date && (
              <> on {new Date(post.date).toLocaleDateString("en-US")}</>
            )}
          </div>
        )}

        {post.excerpt && (
          <div className="text-lg text-gray-700 mb-8 italic">
            {post.excerpt}
          </div>
        )}

        {post.content && (
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </article>
    </>
  );
}
