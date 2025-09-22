import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button, ActionIcon } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconMenu, IconMenu2 } from "@tabler/icons-react";

const FlyOutMenu = ({ menu }: { menu: any[] }) => {
	const url = usePathname();
	const currPath = url.split("/");
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<Drawer opened={opened} onClose={close} size='xs'>
				<Link
					className='flex text-sm gap-3 items-center transition duration-300 ease-in-out data-[active]:font-semibold text-gray-700 data-[active]:bg-blue-200 data-[active]:text-blue-500 hover:bg-gray-100 hover:text-black hover:font-semibold p-3 '
					data-active={`/ms` === url || undefined}
					href={`/ms`}
					onClick={close}
				>
					<IconHome stroke={1.5} />
					<span>Home</span>
				</Link>
				{menu.map(
					(item: any) =>
						item?.shown && (
							<Link
								className='flex text-sm gap-3 items-center transition duration-300 ease-in-out data-[active]:font-semibold text-gray-700 data-[active]:bg-blue-200 data-[active]:text-blue-500 hover:bg-gray-100 hover:text-black hover:font-semibold p-3 '
								data-active={
									item?.link.toLowerCase() === currPath[2] || undefined
								}
								href={`/ms/${item?.link}`}
								key={item?.label}
								onClick={close}
							>
								<item.icon className='' stroke={1.5} />
								<span>{item?.label}</span>
							</Link>
						)
				)}
			</Drawer>

			<ActionIcon variant='filled' onClick={open} aria-label='open menu'>
				<IconMenu2 stroke={1.5} />
			</ActionIcon>
		</>
	);
};

export default FlyOutMenu;
