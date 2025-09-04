export interface AnalyticsDataPoint {
	date: string;
	value: number;
}

export interface PageGroupAnalytics {
	id: string; // Corresponds to PageOrGroup.id
	followerGrowth: AnalyticsDataPoint[];
	engagementRate: AnalyticsDataPoint[];
	postReach: AnalyticsDataPoint[];
	impressions: AnalyticsDataPoint[];
}

export const mockAnalyticsData: PageGroupAnalytics[] = [
	{
		id: "fb-page-1", // SixPathCast HQ
		followerGrowth: [
			{ date: "2024-07-01", value: 12000 },
			{ date: "2024-07-08", value: 12150 },
			{ date: "2024-07-15", value: 12300 },
			{ date: "2024-07-22", value: 12500 },
			{ date: "2024-07-29", value: 12800 },
		],
		engagementRate: [
			{ date: "2024-07-01", value: 3.2 },
			{ date: "2024-07-08", value: 3.5 },
			{ date: "2024-07-15", value: 3.1 },
			{ date: "2024-07-22", value: 3.8 },
			{ date: "2024-07-29", value: 4.0 },
		],
		postReach: [
			{ date: "2024-07-01", value: 5000 },
			{ date: "2024-07-08", value: 5200 },
			{ date: "2024-07-15", value: 4800 },
			{ date: "2024-07-22", value: 5500 },
			{ date: "2024-07-29", value: 6000 },
		],
		impressions: [
			{ date: "2024-07-01", value: 15000 },
			{ date: "2024-07-08", value: 16000 },
			{ date: "2024-07-15", value: 14500 },
			{ date: "2024-07-22", value: 17000 },
			{ date: "2024-07-29", value: 18500 },
		],
	},
	{
		id: "li-page-1", // SixPathCast Inc.
		followerGrowth: [
			{ date: "2024-07-01", value: 33000 },
			{ date: "2024-07-08", value: 33200 },
			{ date: "2024-07-15", value: 33500 },
			{ date: "2024-07-22", value: 33800 },
			{ date: "2024-07-29", value: 34000 },
		],
		engagementRate: [
			{ date: "2024-07-01", value: 2.5 },
			{ date: "2024-07-08", value: 2.7 },
			{ date: "2024-07-15", value: 2.4 },
			{ date: "2024-07-22", value: 2.8 },
			{ date: "2024-07-29", value: 2.9 },
		],
		postReach: [
			{ date: "2024-07-01", value: 10000 },
			{ date: "2024-07-08", value: 10500 },
			{ date: "2024-07-15", value: 9800 },
			{ date: "2024-07-22", value: 11000 },
			{ date: "2024-07-29", value: 11500 },
		],
		impressions: [
			{ date: "2024-07-01", value: 30000 },
			{ date: "2024-07-08", value: 31000 },
			{ date: "2024-07-15", value: 29500 },
			{ date: "2024-07-22", value: 32000 },
			{ date: "2024-07-29", value: 33500 },
		],
	},
	{
		id: "fb-group-1", // Social Media Ninjas
		followerGrowth: [
			{ date: "2024-07-01", value: 2000 },
			{ date: "2024-07-08", value: 2050 },
			{ date: "2024-07-15", value: 2150 },
			{ date: "2024-07-22", value: 2200 },
			{ date: "2024-07-29", value: 2300 },
		],
		engagementRate: [
			{ date: "2024-07-01", value: 5.0 },
			{ date: "2024-07-08", value: 5.2 },
			{ date: "2024-07-15", value: 4.8 },
			{ date: "2024-07-22", value: 5.5 },
			{ date: "2024-07-29", value: 5.8 },
		],
		postReach: [
			{ date: "2024-07-01", value: 1000 },
			{ date: "2024-07-08", value: 1100 },
			{ date: "2024-07-15", value: 950 },
			{ date: "2024-07-22", value: 1200 },
			{ date: "2024-07-29", value: 1300 },
		],
		impressions: [
			{ date: "2024-07-01", value: 3000 },
			{ date: "2024-07-08", value: 3200 },
			{ date: "2024-07-15", value: 2800 },
			{ date: "2024-07-22", value: 3500 },
			{ date: "2024-07-29", value: 3800 },
		],
	},
];
