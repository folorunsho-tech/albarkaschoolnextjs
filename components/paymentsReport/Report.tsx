"use client";
import PaymentsFilter from "@/components/filters/PaymentFilter";
import PaymentLoader from "@/components/PaymentLoader";
import { usePostNormal } from "@/hooks/useQueries";
import { useState } from "react";

const Report = () => {
	const { post, loading } = usePostNormal();
	const [queryData, setQueryData] = useState<any[]>([]);

	return (
		<main className='bg-white p-2 divide-y-4'>
			<section className='flex justify-between p-3'>
				<PaymentLoader
					link='/payments'
					post={post}
					// loadCriteria='Sex'
					setQueryData={setQueryData}
				/>
			</section>

			<PaymentsFilter data={queryData} loading={loading} />
		</main>
	);
};

export default Report;
