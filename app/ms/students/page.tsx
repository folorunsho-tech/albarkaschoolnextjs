"use client";
import React from "react";
import { Tabs } from "@mantine/core";
import Active from "@/components/students/ActiveStudents";
import Disengaged from "@/components/students/DisengagedStudents";

const Students = () => {
	return (
		<Tabs defaultValue='active' color='teal' keepMounted={false} p={4}>
			<Tabs.List fw={600}>
				<Tabs.Tab value='active'>Active Students</Tabs.Tab>
				<Tabs.Tab value='disengaged'>Disengaged Students</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value='active'>
				<Active />
			</Tabs.Panel>

			<Tabs.Panel value='disengaged'>
				<Disengaged />
			</Tabs.Panel>
		</Tabs>
	);
};

export default Students;
