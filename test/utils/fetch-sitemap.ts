import fetch from 'node-fetch';
import parser from 'fast-xml-parser';

export type Url = {
  loc: string;
}

export type Urlset = {
  url: Url[]
}

export type Sitemap = {
  urlset: Urlset
}

export async function fetchSitemap (url: string): Promise<Sitemap> {
  const xml = await (await fetch(url)).text();

  return parser.parse(xml) as Sitemap;
}
