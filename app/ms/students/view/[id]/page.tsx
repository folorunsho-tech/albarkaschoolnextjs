"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFetchSingle } from "@/hooks/useQueries";
import {
	LoadingOverlay,
	Card,
	ScrollArea,
	Text,
	Badge,
	Group,
	Avatar,
	Image,
	Divider,
	Tabs,
	Button,
} from "@mantine/core";
import moment from "moment";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import StudentsPromotions from "@/components/views/StudentsPromotions";
import StudentsDemotion from "@/components/views/StudentsDemotion";

const ViewStudent = () => {
	const { loading, fetch } = useFetchSingle();
	const [student, setStudent] = useState<any>({});
	const router = useRouter();
	const { id }: { id: string } = useParams();

	useEffect(() => {
		async function getStudent() {
			const { data } = await fetch(`/students/${id}`);
			setStudent(data);
		}
		getStudent();
	}, []);

	return (
		<section className='space-y-1 p-3 py-1'>
			<Button
				leftSection={
					<IconArrowNarrowLeft
						size={25}
						onClick={() => {
							router.back();
						}}
					/>
				}
				onClick={() => {
					router.back();
				}}
			>
				Go back
			</Button>
			<section className='relative flex flex-wrap gap-4 w-full'>
				<Card
					shadow='sm'
					padding='lg'
					radius='md'
					withBorder
					className='w-full lg:w-1/4 h-[20rem] bg-white relative space-y-6'
				>
					<Card.Section className='bg-indigo-700 h-20 '>
						<Avatar
							className='absolute left-20 top-8 border border-indigo-500'
							size={80}
							src={student?.student_passport}
							alt=''
						/>
					</Card.Section>
					<Group>
						<Text className='mx-auto mt-3 font-semibold'>
							{student?.first_name} {student?.last_name}
						</Text>
						<div className='flex items-center justify-between gap-2 w-full'>
							<Text c='dimmed' size='sm'>
								Admission No
							</Text>
							<Text c='bold' size='sm'>
								{student?.admission_no}
							</Text>
						</div>
						<div className='flex items-center justify-between gap-2 w-full'>
							<Text c='dimmed' size='sm'>
								Admission status
							</Text>
							<Badge color={student?.active ? "teal" : "red"}>
								{student?.active ? "Active" : "Inactive"}
							</Badge>
						</div>

						<div className='flex items-center justify-between gap-2 w-full'>
							<Text c='dimmed' size='sm'>
								Class
							</Text>
							<Text c='bold' size='sm'>
								{student?.curr_class?.name}
							</Text>
						</div>
					</Group>
				</Card>
				<Tabs
					className='w-full'
					color='teal'
					defaultValue='info'
					keepMounted={false}
				>
					<Tabs.List justify='justify-betwenn'>
						<Tabs.Tab value='info'>Personal info</Tabs.Tab>
						{/* <Tabs.Tab value='payments'>Payments history</Tabs.Tab> */}
						<Tabs.Tab value='promotions'>Promotion history</Tabs.Tab>
						<Tabs.Tab value='demotions'>Demotion history</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value='info'>
						<ScrollArea
							h={650}
							className='w-full bg-white rounded-sm px-3 py-4 shadow-sm'
						>
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Date of admission
								</Text>
								<Text c='bold' size='sm'>
									{moment(student?.date_of_admission).format("MMMM Do YYYY")}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Admission class
								</Text>
								<Text c='bold' size='sm'>
									{student?.admission_class}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Admission term
								</Text>
								<Text c='bold' size='sm'>
									{student?.admission_term}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Admission session
								</Text>
								<Text c='bold' size='sm'>
									{student?.admission_session}
								</Text>
							</div>
							<Divider my='sm' />

							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Subjects taken
								</Text>
								<Text c='bold' size='sm' w={800} className='italic'>
									{student?.curr_class?.subjects?.map((sub: any) => (
										<span key={sub.id}>{sub.name}, </span>
									))}
								</Text>
							</div>
							<Divider my='sm' />

							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Date of birth
								</Text>
								<Text c='bold' size='sm'>
									{moment(student?.date_of_birth).format("MMMM Do YYYY")}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Age
								</Text>
								<Text c='bold' size='sm'>
									{moment(student?.date_of_birth).fromNow(true)}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Sex
								</Text>
								<Text c='bold' size='sm'>
									{student?.sex}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Religion
								</Text>
								<Text c='bold' size='sm'>
									{student?.religion}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									State of origin
								</Text>
								<Text c='bold' size='sm'>
									{student?.state_of_origin}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									LGA
								</Text>
								<Text c='bold' size='sm'>
									{student?.lga}
								</Text>
							</div>
							<Divider my='sm' />
							<div className='flex items-center justify-between gap-2 w-full'>
								<Text c='dimmed' size='sm'>
									Address
								</Text>
								<Text c='bold' size='sm'>
									{student?.address}
								</Text>
							</div>

							<Divider my='sm' />
							<section className='pb-1'>
								<Text size='lg'>Guardian Info</Text>
								<div className='flex mt-3 gap-6'>
									<Image
										radius='md'
										src={student?.guardian_passport}
										h={120}
										w={110}
									/>
									<div className='w-full'>
										<div className='flex items-center justify-between gap-2 w-full'>
											<Text c='dimmed' size='sm'>
												Name
											</Text>
											<Text c='bold' size='sm'>
												{student?.guardian_name}
											</Text>
										</div>
										<Divider my='sm' />
										<div className='flex items-center justify-between gap-2 w-full'>
											<Text c='dimmed' size='sm'>
												Telephone
											</Text>
											<Text c='bold' size='sm'>
												{student?.guardian_telephone}
											</Text>
										</div>
									</div>
								</div>
							</section>
						</ScrollArea>
					</Tabs.Panel>

					<Tabs.Panel value='promotions' className='bg-white p-2'>
						<StudentsPromotions id={id} />
					</Tabs.Panel>
					<Tabs.Panel value='demotions' className='bg-white p-2'>
						<StudentsDemotion id={id} />
					</Tabs.Panel>
				</Tabs>
				<LoadingOverlay visible={loading} />
			</section>
		</section>
	);
};

export default ViewStudent;
