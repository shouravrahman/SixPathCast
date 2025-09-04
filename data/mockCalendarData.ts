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
		scheduleDate: new Date(
			new Date().setDate(new Date().getDate() + 2)
		).toISOString(),
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
		scheduleDate: new Date(
			new Date().setDate(new Date().getDate() - 2)
		).toISOString(),
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
		scheduleDate: new Date(
			new Date().setDate(new Date().getDate() - 5)
		).toISOString(),
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
		scheduleDate: new Date(
			new Date().setDate(new Date().getDate() - 10)
		).toISOString(),
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
		scheduleDate: new Date(
			new Date().setDate(new Date().getDate() - 7)
		).toISOString(),
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
		scheduleDate: new Date(
			new Date().setDate(new Date().getDate() - 4)
		).toISOString(),
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
		scheduleDate: new Date(
			new Date().setDate(new Date().getDate() - 3)
		).toISOString(),
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
		scheduleDate: new Date(
			new Date().setDate(new Date().getDate() + 5)
		).toISOString(),
		creationType: "bulk",
		likes: 800,
		comments: 100,
		shares: 120,
		targetId: "li-page-2", // B2B SaaS Leaders
	},
];
