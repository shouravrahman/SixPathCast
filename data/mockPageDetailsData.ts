import { Facebook, Linkedin, Twitter, Instagram } from "lucide-react";

export const mockPageDetails = {
	id: "1",
	name: "My Awesome Business Page",
	platform: "Facebook",
	followers: 12500,
	category: "E-commerce Website",
};

export const mockAudienceDemographics = {
	age: [
		{ range: "18-24", value: 25 },
		{ range: "25-34", value: 45 },
		{ range: "35-44", value: 20 },
		{ range: "45-54", value: 8 },
		{ range: "55+", value: 2 },
	],
	gender: [
		{ type: "Female", value: 60 },
		{ type: "Male", value: 38 },
		{ type: "Non-binary", value: 2 },
	],
	location: [
		{ city: "New York, USA", value: 30 },
		{ city: "London, UK", value: 20 },
		{ city: "Toronto, CA", value: 15 },
		{ city: "Sydney, AU", value: 10 },
		{ city: "Other", value: 25 },
	],
};

export const mockGrowthInsights = {
	daily: [
		{ date: "2023-07-01", new: 15, unfollows: 2 },
		{ date: "2023-07-02", new: 20, unfollows: 1 },
		{ date: "2023-07-03", new: 12, unfollows: 3 },
		{ date: "2023-07-04", new: 25, unfollows: 0 },
		{ date: "2023-07-05", new: 18, unfollows: 5 },
		{ date: "2023-07-06", new: 22, unfollows: 2 },
		{ date: "2023-07-07", new: 30, unfollows: 1 },
	],
	weekly: [
		{ week: "Week 1", new: 150, unfollows: 10 },
		{ week: "Week 2", new: 175, unfollows: 15 },
		{ week: "Week 3", new: 200, unfollows: 12 },
		{ week: "Week 4", new: 180, unfollows: 20 },
	],
};

export const mockTopPerformingContent = [
	{
		id: "post1",
		type: "Video",
		content: "Our new product launch video is here! 🚀",
		engagement: "1.2k",
		reach: "15k",
		impressions: "25k",
		ctr: "N/A",
		watchTime: "2.5m",
	},
	{
		id: "post2",
		type: "Image",
		content: "A behind-the-scenes look at our team hard at work.",
		engagement: "850",
		reach: "12k",
		impressions: "20k",
		ctr: "N/A",
		watchTime: "N/A",
	},
	{
		id: "post3",
		type: "Link",
		content: "Check out our latest blog post on industry trends.",
		engagement: "500",
		reach: "8k",
		impressions: "15k",
		ctr: "5.2%",
		watchTime: "N/A",
	},
	{
		id: "post4",
		type: "Text",
		content: "Quick update: Our summer sale is now live!",
		engagement: "300",
		reach: "5k",
		impressions: "10k",
		ctr: "N/A",
		watchTime: "N/A",
	},
];

export const mockScheduledPosts = [
	{
		id: "sched1",
		date: new Date(new Date().setDate(new Date().getDate() + 2)),
		content: "Get ready for our upcoming webinar!",
		platform: "Facebook",
	},
	{
		id: "sched2",
		date: new Date(new Date().setDate(new Date().getDate() + 4)),
		content: "Weekly Q&A session with our CEO.",
		platform: "LinkedIn",
	},
	{
		id: "sched3",
		date: new Date(new Date().setDate(new Date().getDate() + 7)),
		content: "New feature announcement next week!",
		platform: "Twitter",
	},
];

export const mockContentRecommendations = [
	{
		id: "rec1",
		suggestion:
			'Post a "behind-the-scenes" video on a Tuesday afternoon for maximum engagement.',
	},
	{
		id: "rec2",
		suggestion:
			'Your audience is highly engaged with content about "sustainability". Create a post on this topic.',
	},
	{
		id: "rec3",
		suggestion:
			"Run a poll to ask your audience what they want to see more of.",
	},
];

export const mockPagesAndGroups = [
	{
		id: "1",
		name: "SixPathCast Official",
		platform: "Facebook",
		type: "Page",
		followers: 128000,
		icon: Facebook,
		isConnected: true,
	},
	{
		id: "2",
		name: "LinkedIn Innovators",
		platform: "LinkedIn",
		type: "Group",
		followers: 75000,
		icon: Linkedin,
		isConnected: true,
	},
	{
		id: "3",
		name: "Twitter Marketing Pros",
		platform: "Twitter",
		type: "Group",
		followers: 42000,
		icon: Twitter,
		isConnected: false,
	},
	{
		id: "4",
		name: "Insta-Growth Hackers",
		platform: "Instagram",
		type: "Page",
		followers: 250000,
		icon: Instagram,
		isConnected: true,
	},
];
