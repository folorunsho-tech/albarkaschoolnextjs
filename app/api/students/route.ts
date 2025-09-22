import prisma from "@/config/prisma";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
	try {
		const students = await prisma.students.findMany({
			where: {
				active: true,
			},
			include: {
				curr_class: true,
			},
		});
		return new Response(JSON.stringify(students), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.log(error);

		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const {
		date_of_birth,
		date_of_admission,
		sex,
		religion,
		admission_term,
		admission_session,
		admission_class,
		curr_class_id,
		school_section,
		admission_no,
		first_name,
		last_name,
		address,
		state_of_origin,
		lga,
		guardian_name,
		guardian_telephone,
		curr_session,
	} = body;
	try {
		const found = await prisma.students.findUnique({
			where: {
				admission_no: admission_no,
			},
		});
		if (found) {
			return new Response(JSON.stringify("already exist"), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			const created = await prisma.students.create({
				data: {
					id: nanoid(7),
					date_of_admission: new Date(date_of_admission),
					sex,
					religion,
					admission_term,
					admission_session,
					admission_class,
					curr_class_id,
					school_section,
					admission_no,
					first_name,
					last_name,
					address,
					state_of_origin,
					lga,
					guardian_name,
					guardian_telephone,
					date_of_birth: new Date(date_of_birth),
				},
			});
			const connectHistory = await prisma.classhistory.create({
				data: {
					student_id: created?.id,
					class_id: created?.curr_class_id,
					session: curr_session,
				},
			});
			return new Response(JSON.stringify({ created, connectHistory }), {
				status: 201,
				headers: { "Content-Type": "application/json" },
			});
		}
	} catch (error) {
		console.log(error);

		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
