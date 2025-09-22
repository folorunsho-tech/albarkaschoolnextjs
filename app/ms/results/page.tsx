"use client";
import React from "react";
import { Tabs } from "@mantine/core";
import Fca from "@/components/results/Fca";
import Sca from "@/components/results/Sca";
import Exam from "@/components/results/Exam";

const Results = () => {
	return (
		<Tabs defaultValue='fca' color='teal' keepMounted={false} p={4}>
			<Tabs.List fw={600}>
				<Tabs.Tab value='fca'>1st C.A Test</Tabs.Tab>
				<Tabs.Tab value='sca'>2nd C.A Test</Tabs.Tab>
				<Tabs.Tab value='exam'>Examinations</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value='fca'>
				<Fca />
			</Tabs.Panel>

			<Tabs.Panel value='sca'>
				<Sca />
			</Tabs.Panel>
			<Tabs.Panel value='exam'>
				<Exam />
			</Tabs.Panel>
		</Tabs>
	);
};

export default Results;
