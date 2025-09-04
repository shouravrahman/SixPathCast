// Mock data for the application

export const campaigns = [
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
		target_audience: "Small Business Owners, Entrepreneurs, Freelancers",
		content_pillars: [
			"Product Updates",
			"User Stories",
			"Feature Demos",
			"Industry Insights",
		],
	},
	{
		id: 3,
		name: "Building in Public - AI Tool",
		description:
			"Document the journey of building my AI tool publicly to build audience",
		target_audience: "Developers, AI Enthusiasts, Indie Hackers",
		content_pillars: [
			"Progress Updates",
			"Technical Challenges",
			"Lessons Learned",
			"Community Feedback",
		],
	},
];

export const aiModels = [
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
	{
		id: "gpt-3.5-turbo",
		name: "GPT-3.5 Turbo",
		provider: "OpenAI",
		cost: "$0.001/1K tokens",
		speed: "Very Fast",
		quality: "Good",
	},
	{
		id: "claude-3-sonnet",
		name: "Claude 3 Sonnet",
		provider: "Anthropic",
		cost: "$0.003/1K tokens",
		speed: "Fast",
		quality: "Very Good",
	},
];

export const platforms = [
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

export const tones = [
	"Professional",
	"Casual",
	"Humorous",
	"Educational",
	"Inspirational",
	"Conversational",
];

export const generateMockContent = (
	platformId: string,
	postType: string,
	topic: string,
	brief: string
) => {
	const platform = platforms.find((p) => p.id === platformId);
	const wordCount = Math.floor(Math.random() * 50) + 100;
	const readingTime = Math.ceil(wordCount / 200);

	return {
		platformId,
		postType,
		topic,
		text: `🚀 ${topic}\n\n${
			brief || "Generated content based on your campaign and brand voice."
		}\n\nWhat's your experience with this? Share your thoughts! 👇`,
		hashtags: ["#AI", "#Productivity", "#Innovation"],
		engagement_prediction: Math.floor(Math.random() * 50) + 50,
		best_time: "2:00 PM",
		model_used: "gpt-4-turbo",
		generated_at: new Date().toISOString(),
		stats: {
			wordCount,
			characterCount: Math.floor(Math.random() * platform?.limit || 280),
			readingTime,
			hashtagCount: 3,

			mentionCount: Math.floor(Math.random() * 3),
		},
	};
};

export const mediaItems = [
	{
		id: 1,
		type: "image",
		url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		name: "Code on a screen",
		tags: ["code", "development", "tech"],
	},
	{
		id: 2,
		type: "image",
		url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		name: "Analytics dashboard",
		tags: ["data", "analytics", "business"],
	},
	{
		id: 3,
		type: "video",
		url: "https://videos.pexels.com/video-files/3214533/3214533-hd_1920_1080_25fps.mp4",
		name: "Team meeting",
		tags: ["team", "collaboration", "office"],
	},
];

export const leadMagnets = [
	{
		id: 1,
		title: "The Ultimate Guide to SaaS Development",
		description:
			"A comprehensive guide covering everything you need to know about building a successful SaaS product.",
		type: "E-book",
		downloads: 1200,
	},
	{
		id: 2,
		title: "10-Point Checklist for a Successful Product Launch",
		description:
			"A handy checklist to ensure you cover all your bases for a smooth product launch.",
		type: "Checklist",
		downloads: 850,
	},
];

export const posts = [
	{
		id: 1,
		topic: "AI in Software Development",
		platform: "LinkedIn",
		content:
			"AI is revolutionizing software development, from automated testing to AI-powered code completion. Are you leveraging AI in your development workflow? #AI #SoftwareDevelopment #FutureOfCode",
		status: "draft",
		scheduleDate: null,
		creationType: "bulk",
		likes: 0,
		comments: 0,
		shares: 0,
		targetId: null, // Personal profile
	},
	{
		id: 2,
		topic: "The Rise of Vertical SaaS",
		platform: "Twitter",
		content:
			"Vertical SaaS is eating the world. Niche-specific solutions are proving to be more effective than one-size-fits-all platforms. What's your favorite vertical SaaS? #SaaS #VerticalSaaS #Business",
		status: "scheduled",
		scheduleDate: "2024-08-22T14:00:00Z",
		creationType: "bulk",
		likes: 0,
		comments: 0,
		shares: 0,
		targetId: null, // Personal profile
	},
	{
		id: 3,
		topic: "Building a Personal Brand as a Developer",
		platform: "Facebook",
		content:
			"As a developer, your personal brand is as important as your code. Sharing your knowledge, contributing to open source, and engaging with the community can open up amazing opportunities. #Developer #PersonalBranding #Community",
		status: "draft",
		scheduleDate: null,
		creationType: "bulk",
		likes: 0,
		comments: 0,
		shares: 0,
		targetId: null, // Personal profile
	},
	{
		id: 4,
		platform: "Twitter",
		topic: "New SaaS Product Launch",
		content:
			"Just launched my new SaaS product! 🎉 Check it out and let me know what you think. #SaaS #IndieHacker",
		scheduleDate: "2024-07-20T10:00:00Z",
		status: "published",
		creationType: "single",
		likes: 150,
		comments: 25,
		shares: 10,
		targetId: null, // Personal profile
	},
	{
		id: 5,
		platform: "LinkedIn",
		topic: "Client Case Study",
		content:
			"Excited to share a case study on how we helped a client increase their ROI by 300% with our custom software solution. #SoftwareDevelopment #CaseStudy",
		scheduleDate: "2024-07-18T15:30:00Z",
		status: "published",
		creationType: "single",
		likes: 250,
		comments: 45,
		shares: 30,
		targetId: null, // Personal profile
	},
	// Posts for specific pages/groups
	{
		id: 6,
		topic: "New Feature Announcement",
		platform: "Facebook",
		content:
			"Excited to announce a new feature on SixPathCast! Check it out now. #ContentRasengan #NewFeature",
		status: "published",
		scheduleDate: "2024-08-01T10:00:00Z",
		creationType: "single",
		likes: 500,
		comments: 80,
		shares: 120,
		targetId: "fb-page-1", // SixPathCast HQ
	},
	{
		id: 7,
		topic: "Weekly AI News Digest",
		platform: "Facebook",
		content:
			"Stay updated with the latest in AI! This week's digest covers new models and ethical AI discussions. #AINews #AIInnovators",
		status: "published",
		scheduleDate: "2024-08-05T15:00:00Z",
		creationType: "bulk",
		likes: 300,
		comments: 40,
		shares: 50,
		targetId: "fb-page-2", // AI Innovators Circle
	},
	{
		id: 8,
		topic: "Community Discussion: Best Social Media Tools",
		platform: "Facebook",
		content:
			"What are your go-to social media management tools? Share your favorites and why! #SocialMedia #Community",
		status: "published",
		scheduleDate: "2024-08-10T11:00:00Z",
		creationType: "single",
		likes: 150,
		comments: 60,
		shares: 20,
		targetId: "fb-group-1", // Social Media Ninjas
	},
	{
		id: 9,
		topic: "Thought Leadership: Future of B2B Marketing",
		platform: "LinkedIn",
		content:
			"The landscape of B2B marketing is evolving rapidly. Here are our predictions for the next 5 years. #B2BMarketing #FutureTrends",
		status: "published",
		scheduleDate: "2024-08-12T09:00:00Z",
		creationType: "single",
		likes: 1200,
		comments: 150,
		shares: 200,
		targetId: "li-page-1", // SixPathCast Inc.
	},
	{
		id: 10,
		topic: "SaaS Growth Strategies",
		platform: "LinkedIn",
		content:
			"Scaling a SaaS business requires unique strategies. Join our webinar next week to learn more! #SaaSGrowth #BusinessStrategy",
		status: "scheduled",
		scheduleDate: "2024-08-25T14:00:00Z",
		creationType: "bulk",
		likes: 800,
		comments: 100,
		shares: 120,
		targetId: "li-page-2", // B2B SaaS Leaders
	},
];
