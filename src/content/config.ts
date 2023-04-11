import { defineCollection, z } from "astro:content";

const articlesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    publishedAt: z.date(),
  }),
});

export const collections = <const>{
  articles: articlesCollection,
};
