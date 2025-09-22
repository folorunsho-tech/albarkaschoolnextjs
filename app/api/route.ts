// import { nanoid } from "nanoid";
// import prisma from "@/config/prisma";
// export async function GET(request: Request) {
// 	try {
// 		return new Response(JSON.stringify(), {
// 			status: 200,
// 			headers: { "Content-Type": "application/json" },
// 		});
// 	} catch (error) {
// 		console.log(error);

// 		return new Response(JSON.stringify(error), {
// 			status: 500,
// 			headers: { "Content-Type": "application/json" },
// 		});
// 	}
// }

// export async function GET(
// 	request: Request,
// 	{
// 		params,
// 	}: {
// 		params: Promise<{ id: string }>;
// 	}
// ) {
// 	const id = (await params).id;
// 	try {
// 		return new Response(JSON.stringify(account), {
// 			status: 200,
// 			headers: { "Content-Type": "application/json" },
// 		});
// 	} catch (error) {
// 		console.log(error);

// 		return new Response(JSON.stringify(error), {
// 			status: 500,
// 			headers: { "Content-Type": "application/json" },
// 		});
// 	}
// }

// export async function POST(
// 	request: Request,
// 	{
// 		params,
// 	}: {
// 		params: Promise<{ id: string }>;
// 	}
// ) {
// 	const id = (await params).id;
// 	// Parse the request body
// 	const body = await request.json();
// 	const {} = body;
// 	try {
// 		return new Response(JSON.stringify(account), {
// 			status: 200,
// 			headers: { "Content-Type": "application/json" },
// 		});
// 	} catch (error) {
// 		console.log(error);

// 		return new Response(JSON.stringify(error), {
// 			status: 500,
// 			headers: { "Content-Type": "application/json" },
// 		});
// 	}
// }

// export async function POST(request: Request) {
// 	// Parse the request body
// 	const body = await request.json();
// 	const {} = body;
// 	try {
// 		return new Response(JSON.stringify(created), {
// 			status: 201,
// 			headers: { "Content-Type": "application/json" },
// 		});
// 	} catch (error) {
// 		console.log(error);

// 		return new Response(JSON.stringify(error), {
// 			status: 500,
// 			headers: { "Content-Type": "application/json" },
// 		});
// 	}
// }
