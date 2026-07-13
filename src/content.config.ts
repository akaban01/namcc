import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const jumuah = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: 'src/content/jumuah' }),
	schema: z.object({
		order: z.number(),
		label: z.string(),
		time: z.string(),
		khateeb: z.string(),
		topic: z.string(),
	}),
});

const events = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: 'src/content/events' }),
	schema: z.object({
		title: z.string(),
		category: z.enum(['General', 'Youth', 'Sisters', 'Ramadan', 'Brothers']),
		date: z.coerce.date(),
		time: z.string().optional(),
		image: z.string().optional(),
		summary: z.string(),
		link: z.string().optional(),
		featured: z.boolean().default(false),
	}),
});

const imams = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: 'src/content/imams' }),
	schema: z.object({
		name: z.string(),
		title: z.string(),
		photo: z.string().optional(),
		availability: z.string().optional(),
		order: z.number().default(0),
		body: z.string().optional(),
	}),
});

const services = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: 'src/content/services' }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		icon: z.string().optional(),
		image: z.string().optional(),
		summary: z.string(),
		order: z.number().default(0),
		category: z.enum(['Supportive Services', 'Life Events', 'Other']).default('Other'),
		body: z.string().optional(),
	}),
});

const announcements = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: 'src/content/announcements' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		image: z.string().optional(),
		summary: z.string(),
		body: z.string().optional(),
		link: z.string().optional(),
	}),
});

const pages = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/pages' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		heroImage: z.string().optional(),
	}),
});

export const collections = {
	jumuah,
	events,
	imams,
	services,
	announcements,
	pages,
};
