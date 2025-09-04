import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { email, password } = await request.json();
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 401 });
	}
	console.log("logged in");
	return NextResponse.json(
		{ message: "Logged in successfully" },
		{ status: 200 }
	);
}
