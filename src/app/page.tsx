import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import launchLinks from "~/links/data.json";
import { siteMetadata } from "./layout";

interface LaunchLink {
  name: string;
  icon: string;
  description: string;
  href: string;
  tag: string;
  da: number;
  visits: number;
}
const linksData = launchLinks as LaunchLink[];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <section className="mx-auto max-w-4xl py-12 text-center">
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.06em] text-[#171717] sm:text-5xl">{siteMetadata.title}</h1>
        <p className="mt-6 text-lg leading-8 text-[#4d4d4d]">{siteMetadata.description}</p>
      </section>

      <section className="rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_2px_2px_rgba(0,0,0,0.04),0px_8px_8px_-8px_rgba(0,0,0,0.04),0px_0px_0px_1px_#fafafa]">
        <Table className="min-w-230 text-left">
          <TableHeader>
            <TableRow className="border-black/10">
              <TableHead className="px-3 py-3 text-sm font-medium text-[#171717]">Name</TableHead>
              <TableHead className="px-3 py-3 text-sm font-medium text-[#171717]">Type</TableHead>
              <TableHead className="px-3 py-3 text-sm font-medium text-[#171717]">DA</TableHead>
              <TableHead className="px-3 py-3 text-sm font-medium text-[#171717]">Visits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {linksData.map((item) => (
              <TableRow className="border-black/5" key={item.href}>
                <TableCell className="px-3 py-3">
                  <a className="inline-flex items-center gap-2 text-sm font-medium text-[#171717] underline-offset-4 hover:underline" href={item.href} rel="noreferrer" target="_blank">
                    {item.icon ? <img alt={`${item.name} icon`} className="size-4 rounded-sm object-cover" loading="lazy" src={item.icon} /> : null}
                    <span>{item.name}</span>
                  </a>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <span className="inline-flex rounded-full bg-[#ebf5ff] px-2.5 py-0.5 text-xs font-medium text-[#0068d6]">{item.tag}</span>
                </TableCell>
                <TableCell className="px-3 py-3 text-sm text-[#4d4d4d]">{item.da}</TableCell>
                <TableCell className="px-3 py-3 text-sm text-[#4d4d4d]">{item.visits.toLocaleString("en-US")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
