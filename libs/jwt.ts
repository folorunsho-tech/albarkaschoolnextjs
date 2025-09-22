import { SignJWT, JWTPayload, jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
const secret = new TextEncoder().encode(process.env.JWT_SECRET); // must be a string

export async function verifyToken(req: NextRequest) {
	const token = req.cookies.get("token")?.value;
	if (!token)
		return new NextResponse(JSON.stringify({ error: "Access denied" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch (error) {
		return new Response(JSON.stringify({ error: "Invalid token" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}
}

export async function generateToken(payload: JWTPayload) {
	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("10h") // 10 hour expiry
		.sign(secret);

	return token;
}
