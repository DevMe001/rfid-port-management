import React, { useCallback, useEffect, useState } from "react";
import { Account, PersonalInformation, Vehicles } from "../../../../api-query/types";
import {  useDeleteVehicleMutation } from "../../../../api-query/vehicle-api";
import CustomButton from "../../../../common/components/ui/button.componetnt";
import { DashboardHeader } from "../../../../common/components/ui/main.ui.component";
import RenderIf from "../../../../common/components/ui/render-if";
import PopupModal from "../../../../common/widget/modal/popup.,modal";
import { onVehicleModal } from "../../../../utils/hooks/globa.state";
import useDebounceRef from "../../../../utils/hooks/useDebounce";
import usePagination from "../../../../utils/hooks/usePagination";
import Breadcrumbs from "../../component/Breadcrumbs";
import SearchInput from "../../component/Search";
import TableRender from "../../component/Table";
import withAdminWrapper from "../../component/admin-wrapper";
import { useGetFilterUserPersonalMutation, useGetPersonalInfromationQuery } from "../../../../api-query/personal-details.api";
import KebabMenu from "../../component/KebabDropdown";
import PaginationRender from "../../component/Pagination";
import { useLocation } from "react-router-dom";
import { isEmpty } from "lodash";


const AddNewVehicle = ()=>{

	const [vehicleModal, setVehcile] = onVehicleModal();

		const onCloseModal = useCallback(() => {
			setVehcile(false);
			document.body.style.overflow = '';
		}, []);

	return (
		<RenderIf value={vehicleModal}>
			<PopupModal maxWidth='max-w-full' onClose={onCloseModal}>
				<div className='p-2'>
					Vehicle form
			
				</div>
			</PopupModal>
		</RenderIf>
	);
}


const AddVehicleRender = React.memo(AddNewVehicle);



const PersonalDetails:React.FC = () => {


const personalUserParams = useLocation();

let params = personalUserParams?.pathname.split('/')[3] ?? '';








	const header = ['Full name','Age','Birthdate','Gender','Nationality','Mobile Number', 'Action']; 

	const { data: personalInfoRecord } = useGetPersonalInfromationQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true, skip: false });

const [getFilterUserPersonal] = useGetFilterUserPersonalMutation();


	const { paginatedData, handlePagination, currentPage, totalPages, setData } = usePagination<PersonalInformation>(personalInfoRecord as unknown as PersonalInformation[], 10);





	const getPersonalInfo = useCallback(async () => {
		const res = await getFilterUserPersonal(params);
		if ('data' in res) {
			console.log(res.data);

			setData(res.data.data as unknown as PersonalInformation[]);
		}
	}, [getFilterUserPersonal, params, setData]);

	useEffect(() => {
		function init() {
			if (!isEmpty(params)) {
				getPersonalInfo();
			}
		}

		init();
	}, [params, getPersonalInfo]);







	const [deleteVehicle] = useDeleteVehicleMutation();

	const onDeleteVehicle = async (id: string) => {

		console.log(id);
		 await deleteVehicle(id);
	};




	
  
	const body: (string | JSX.Element)[][] = paginatedData?.map((row) => [
		<span>
			{row.firstname} &nbsp; {row.lastname}
		</span>,
		String(row.age),
		String(row.birthdate),
		String(row.gender),
		String(row.nationality),
		String(row.mobileNumber),
		<KebabMenu list={[{ label: 'View' }, { label: 'Edit' }, { label: 'Delete', onClick: () => onDeleteVehicle(row.account_id as string) }]} />,
	]);


const [filter, setFilter] = useState<string>('');
const [vehicleModal, setVehcile] = onVehicleModal();

	
	
const onFilterQuery = useDebounceRef((e: React.ChangeEvent<HTMLInputElement>) => {
	const value = e.target.value;
	setFilter(value);
}, 200);

const onSubmitHandler = async () => {
	// const filterQuery: any = await filterRfidQuery(filter);
	// setData(filterQuery.data.data);

	console.log(filter);
};

// handle for add vehile icon
const onAddVehicleToggle = useCallback(() => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
	document.body.style.overflow = 'hidden';
	setVehcile(!vehicleModal);
}, []);





	return (
		<>
			<div className='relative main !bg-lite'>
				<DashboardHeader />
				<Breadcrumbs group='Setting' activeLink='Personal information' />
				<div className='mt-10  w-[95%] lg:w-[90%] mx-auto'>
					<SearchInput onSearch={onFilterQuery} onSubmit={onSubmitHandler} />
					<TableRender header={header} body={body} />
					<PaginationRender prev={() => handlePagination('prev')} next={() => handlePagination('next')} currentPage={currentPage} totalPage={totalPages} />

					<div className='flex justify-end pr-5 mt-10'>
						<CustomButton onClick={onAddVehicleToggle} label={<p className='text-3xl'>+</p>} className='rounded-full w-[4rem] h-[4rem] bg-accent text-white !outline-none !border-none hover:bg-white hover:text-navy' />
					</div>
				</div>
			</div>
			<AddVehicleRender />
		</>
	);
}

export default withAdminWrapper(PersonalDetails);
