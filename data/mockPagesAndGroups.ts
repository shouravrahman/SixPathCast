export interface PageOrGroup {
	id: string;
	name: string;
	platform: "Facebook" | "LinkedIn";
	type: "Page" | "Group";
	followers: number;
	isEnabled: boolean;
	avatarUrl: string;
}

export const mockPagesAndGroups: PageOrGroup[] = [
	{
		id: "fb-page-1",
		name: "SixPathCast HQ",
		platform: "Facebook",
		type: "Page",
		followers: 12800,
		isEnabled: true,
		avatarUrl: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
	},
	{
		id: "fb-page-2",
		name: "AI Innovators Circle",
		platform: "Facebook",
		type: "Page",
		followers: 5432,
		isEnabled: true,
		avatarUrl: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
	},
	{
		id: "fb-group-1",
		name: "Social Media Ninjas",
		platform: "Facebook",
		type: "Group",
		followers: 2300,
		isEnabled: false,
		avatarUrl: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
	},
	{
		id: "li-page-1",
		name: "SixPathCast Inc.",
		platform: "LinkedIn",
		type: "Page",
		followers: 34000,
		isEnabled: true,
		avatarUrl: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
	},
	{
		id: "li-page-2",
		name: "B2B SaaS Leaders",
		platform: "LinkedIn",
		type: "Page",
		followers: 9800,
		isEnabled: true,
		avatarUrl: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
	},
];
