import { type LaunchLink, LaunchLinksDataTable } from "~/components/launch-links-data-table";
import launchLinks from "~/links/data.json";
import { siteMetadata } from "./layout";

const linksData = launchLinks as LaunchLink[];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <section className="mx-auto max-w-4xl py-12 text-center">
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.06em] text-[#171717] sm:text-5xl">{siteMetadata.title}</h1>
        <p className="mt-6 text-lg leading-8 text-[#4d4d4d]">{siteMetadata.description}</p>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_2px_2px_rgba(0,0,0,0.04),0px_8px_8px_-8px_rgba(0,0,0,0.04),0px_0px_0px_1px_#fafafa]">
        <LaunchLinksDataTable data={linksData} />
      </section>
    </main>
  );
}
