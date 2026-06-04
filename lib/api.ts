const REST_API =
  process.env.NEXT_PUBLIC_WORDPRESS_REST_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/graphql\/?$/, "") ||
  "https://bluereeftech.com/demo-next-js";

export async function getHomePage() {
  const res = await fetch(`${REST_API}/wp-json/wp/v2/pages?slug=home&acf_format=standard`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Array.isArray(data) ? data[0] : null;
}

export async function getPageYoastData(slug: string) {
  const res = await fetch(`${REST_API}/wp-json/wp/v2/pages?slug=${slug}&_fields=title,content,yoast_head_json`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Array.isArray(data) ? data[0] : null;
}