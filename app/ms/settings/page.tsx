"use client";
import React from "react";
import { Tabs, rem } from "@mantine/core";
import {
	IconBooks,
	IconBusinessplan,
	IconBriefcase,
} from "@tabler/icons-react";
import Subjects from "@/components/settings/Subjects";
import FeesGroup from "@/components/settings/FeesGroup";
const Settings = () => {
	const iconStyle = { width: rem(20), height: rem(20) };
	return (
		<Tabs
			className='bg-white'
			color='teal'
			defaultValue='subjects'
			keepMounted={false}
		>
			<Tabs.List>
				<Tabs.Tab
					value='subjects'
					leftSection={<IconBooks style={iconStyle} />}
				>
					Subjects
				</Tabs.Tab>
				<Tabs.Tab
					value='fees_group'
					leftSection={<IconBusinessplan style={iconStyle} />}
				>
					Fees Group
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value='subjects' className='p-2'>
				<Subjects />
			</Tabs.Panel>

			<Tabs.Panel value='fees_group' className='p-2'>
				<FeesGroup />
			</Tabs.Panel>
		</Tabs>
	);
};

export default Settings;
