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

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: ({ image }) =>
    z.object({
      translationKey: z.string(),
      name: z.string(),
      role: z.string(),
      photo: image().optional(),
      displayOrder: z.number().default(0),
      specializations: z.array(z.string()).default([]),
      socials: z
        .object({
          linkedin: z.string().url().optional(),
          github: z.string().url().optional(),
          website: z.string().url().optional(),
        })
        .default({}),
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

export const collections = { blog, team, pages };
