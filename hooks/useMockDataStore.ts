import { create } from "zustand";

const initialPlatforms = [
	{
		id: "twitter",
		name: "Twitter",
		icon: "𝕏",
		color: "bg-black",
		limit: 280,
		postTypes: [
			{ id: "post", name: "Post" },
			{ id: "thread", name: "Thread" },
			{ id: "poll", name: "Poll" },
		],
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: "in",
		color: "bg-blue-700",
		limit: 3000,
		postTypes: [
			{ id: "post", name: "Post" },
			{ id: "article", name: "Article" },
			{ id: "carousel", name: "Carousel" },
			{ id: "video", name: "Video" },
		],
	},
	{
		id: "facebook",
		name: "Facebook",
		icon: "f",
		color: "  ",
		limit: 63206,
		postTypes: [
			{ id: "post", name: "Post" },
			{ id: "story", name: "Story" },
			{ id: "reel", name: "Reel" },
		],
	},
	{
		id: "youtube",
		name: "YouTube",
		icon: "▶",
		color: "bg-red-600",
		limit: 5000,
		postTypes: [
			{ id: "video", name: "Video" },
			{ id: "short", name: "Short" },
			{ id: "live", name: "Live Stream" },
		],
	},
	{
		id: "tiktok",
		name: "TikTok",
		icon: "♪",
		color: "bg-black",
		limit: 2200,
		postTypes: [
			{ id: "video", name: "Video" },
			{ id: "live", name: "Live" },
		],
	},
	{
		id: "pinterest",
		name: "Pinterest",
		icon: "P",
		color: "bg-red-500",
		limit: 500,
		postTypes: [
			{ id: "pin", name: "Pin" },
			{ id: "story", name: "Story Pin" },
		],
	},
];

const initialPagesAndGroups = [
	{
		id: "fb-page-1",
		name: "SixPathCast HQ",
		platform: "Facebook",
		type: "Page",
		followers: 15000,
		isEnabled: true,
		avatarUrl: "/path-to-avatar/cr-hq.png",
	},
	{
		id: "fb-page-2",
		name: "AI Innovators Circle",
		platform: "Facebook",
		type: "Page",
		followers: 5000,
		isEnabled: true,
		avatarUrl: "/path-to-avatar/ai-innovators.png",
	},
	{
		id: "fb-group-1",
		name: "Social Media Ninjas",
		platform: "Facebook",
		type: "Group",
		followers: 2500,
		isEnabled: true,
		avatarUrl: "/path-to-avatar/sm-ninjas.png",
	},
	{
		id: "li-page-1",
		name: "SixPathCast Inc.",
		platform: "LinkedIn",
		type: "Page",
		followers: 50000,
		isEnabled: true,
		avatarUrl: "/path-to-avatar/cr-inc.png",
	},
	{
		id: "li-page-2",
		name: "B2B SaaS Leaders",
		platform: "LinkedIn",
		type: "Page",
		followers: 10000,
		isEnabled: true,
		avatarUrl: "/path-to-avatar/b2b-saas.png",
	},
];

const processPlatforms = (platforms, pagesAndGroups) => {
	const platformsWithProfiles = platforms.map((p) => {
		const hasPagesOrGroups = pagesAndGroups.some(
			(pg) => pg.platform.toLowerCase() === p.name.toLowerCase()
		);
		if (hasPagesOrGroups) {
			return {
				...p,
				pagesAndGroups: [
					{
						id: `${p.id}-profile`,
						name: "Personal Profile",
						platform: p.name,
						type: "Profile",
						followers: 0,
						isEnabled: true,
						avatarUrl: "",
					},
					...pagesAndGroups.filter(
						(pg) =>
							pg.platform.toLowerCase() === p.name.toLowerCase()
					),
				],
			};
		}
		return p;
	});

	return platformsWithProfiles.map((p) => {
		if (!p.pagesAndGroups) {
			return {
				...p,
				pagesAndGroups: [],
			};
		}
		return p;
	});
};

const useMockDataStore = create((set) => ({
	platforms: initialPlatforms,
	pagesAndGroups: initialPagesAndGroups,
	platformsWithPagesAndGroups: processPlatforms(
		initialPlatforms,
		initialPagesAndGroups
	),
	campaigns: [
		{
			id: 1,
			name: "SaaS Development Services",
			description:
				"Promote my custom SaaS development services to attract enterprise clients",
			target_audience: "CTOs, Tech Leaders, Startup Founders",
			content_pillars: [
				"Coding Timelapse",
				"Client Testimonials",
				"Case Studies",
				"Technical Insights",
			],
		},
		{
			id: 2,
			name: "Personal SaaS Product",
			description:
				"Market my own SaaS product to potential customers and investors",
			target_audience:
				"Small Business Owners, Entrepreneurs, Freelancers",
			content_pillars: [
				"Product Updates",
				"User Stories",
				"Feature Demos",
				"Industry Insights",
			],
		},
	],
	aiModels: [
		{
			id: "gpt-4-turbo",
			name: "GPT-4 Turbo",
			provider: "OpenAI",
			cost: "$0.01/1K tokens",
			speed: "Fast",
			quality: "Excellent",
		},
		{
			id: "claude-3-opus",
			name: "Claude 3 Opus",
			provider: "Anthropic",
			cost: "$0.015/1K tokens",
			speed: "Medium",
			quality: "Excellent",
		},
	],
	tones: [
		"Professional",
		"Casual",
		"Humorous",
		"Educational",
		"Inspirational",
		"Conversational",
	],
}));

export default useMockDataStore;
