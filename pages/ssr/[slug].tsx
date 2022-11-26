import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import sanityClient from "@sanity/client";

// Configure Sanity client
const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  // Since we are using getServerSideProps, using the CDN will save us money.
  // ⚠️ Using the CDN will require the dataset to be public.
  useCdn: true,
});

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ slug: string }>
) {
  // Get the slug from the URL
  if (!ctx.params?.slug) {
    // If there is no slug, show a 404 page
    return {
      notFound: true,
    };
  }
  // Fetch page data from Sanity.
  const page = await client.fetch(
    // Since dataset is private, we don't need to check for published documents.
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug: ctx.params.slug }
  );
  // Return the page data as props
  return {
    props: {
      page,
    },
  };
}

export default function Page(
  // Infer page props type from the return value of getServerSideProps
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <main>
      <h1>{props.page.title}</h1>
    </main>
  );
}