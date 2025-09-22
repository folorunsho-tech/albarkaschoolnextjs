"use client";
import React from "react";
import { Tabs } from "@mantine/core";
import StudentPromo from "@/components/promotions/Student";
import StudentDemo from "@/components/demotions/Student";

const StudentsPromotions = () => {
	return (
		<Tabs defaultValue='promotions' color='teal' keepMounted={false} p={4}>
			<Tabs.List fw={600}>
				<Tabs.Tab value='promotions'>Promotions</Tabs.Tab>
				<Tabs.Tab value='demotions'>Demotions</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value='promotions'>
				<StudentPromo />
			</Tabs.Panel>

			<Tabs.Panel value='demotions'>
				<StudentDemo />
			</Tabs.Panel>
		</Tabs>
	);
};

export default StudentsPromotions;
