import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      translationKey: z.string(),
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      author: z.string(),
      heroImage: image().optional(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      translationKey: z.string(),
      title: z.string(),
      description: z.string(),
      heroImage: image().optional(),
    }),
});

export const collections = { blog, pages };
