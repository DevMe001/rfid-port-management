import { isEmpty } from 'lodash'
import React, { ComponentProps } from 'react'
import { CgRemoveR } from 'react-icons/cg'
import { MdPostAdd } from 'react-icons/md'
import CustomButton from '../../../../common/components/ui/button.componetnt'
import InputFieldForm from '../../../../common/components/ui/field-form'
import RenderIf from '../../../../common/components/ui/render-if'
import RenderSeat from './renderseat.component'
import { useGetBookingVehicleTypeQuery } from '../../../../api-query/schedule-list.api'
import { Interpolation, Theme } from '@emotion/react'


type PassengerFormProps = {
	passengerType: string;
	indexLabel: number | string;
	identifyAs: string;
	seatNumber: string;
	onSeatChosen: () => void;
	vehicleCondition: boolean;
	onPassengerVehicleAdd: () => void;
	onPassengerVehicleRemove: () => void;
	onDateGetAge: React.FormEventHandler<HTMLLabelElement> & React.ChangeEventHandler<HTMLInputElement>;
	css?: Interpolation<Theme>;
} & ComponentProps<'div'>;

const PassengerForm: React.FC<PassengerFormProps> = ({ passengerType,indexLabel, identifyAs, seatNumber, onSeatChosen, vehicleCondition, onPassengerVehicleAdd, onPassengerVehicleRemove,onDateGetAge, ...divProps }) => {
	
	const { data: vehiclesAvailable } = useGetBookingVehicleTypeQuery({}, { pollingInterval: 5000, refetchOnMountOrArgChange: true, skip: false });





	return (
		<div className='flex flex-col gap-5 border border-1 borderGray w-8/12 mx-auto p-10 rounded my-5 shadow-md' {...divProps}>
			<h2 className='text-center text-navy font-medium'>
				{passengerType} {Number(indexLabel) > 1 ? Number(indexLabel) + 1 : ''}
			</h2>

			<InputFieldForm labelName='First Name' identifyAs={identifyAs} fieldName='firstname' placeholder={`First Name`} />
			<InputFieldForm labelName='Last Name' identifyAs={identifyAs} fieldName='lastname' placeholder={`Last Name`} />
			<InputFieldForm inputAssign='select' labelName='Gender' identifyAs={identifyAs} fieldName='gender' placeholder={`Gender`} type='number'>
				<option value=''>Select gender</option>
				<option value='male'>Male</option>
				<option value='female'>Female</option>
			</InputFieldForm>

			<InputFieldForm labelName='Birthdate' identifyAs={identifyAs} fieldName='birthdate' onChange={onDateGetAge} type='date' />

			<InputFieldForm readOnly labelName='Age' identifyAs={identifyAs} fieldName='age' placeholder={`Age`} type='number' />

			<InputFieldForm type='hidden' identifyAs={identifyAs} fieldName='seatPosition' />
			<InputFieldForm type='hidden' identifyAs={identifyAs} fieldName='fare_type' value={passengerType} />
			<InputFieldForm type='hidden' identifyAs={identifyAs} fieldName='seatNumber' />

			<RenderSeat seatNumber={Number(seatNumber) as number} onSeatReserve={onSeatChosen} />

			{/* vehicle */}
			<RenderIf value={passengerType != 'Child' && passengerType != 'Infant' && passengerType != 'Pwd'}>
				<label htmlFor='addVehicle' className='text-navy font-medium'>
					Add vehicle (Optional)
				</label>
				<hr />
			</RenderIf>
			<RenderIf value={(!vehicleCondition as boolean) && passengerType != 'Child' && passengerType != 'Infant' && passengerType != 'Pwd'}>
				<div id='addVehicle' className='flex justify-end'>
					<CustomButton onClick={onPassengerVehicleAdd} label={<MdPostAdd size={20} />} className='bg-accent text-white py-2 px-5' />
				</div>
			</RenderIf>

			<RenderIf value={vehicleCondition as boolean}>
				<div id='removeVehicle' className='flex justify-end'>
					<CustomButton onClick={onPassengerVehicleRemove} label={<CgRemoveR size={20} />} className='bg-accent text-white py-2 px-5' />
				</div>
			</RenderIf>

			<RenderIf value={(vehicleCondition as boolean) && passengerType != 'Child' && passengerType != 'Infant' && passengerType != 'Pwd'}>
				{!isEmpty(vehiclesAvailable) && (
					<>
						{' '}
						<InputFieldForm labelName='Vehicle Available' inputAssign='select' identifyAs={identifyAs} fieldName='vehicleChosen.vehicletype_id'>
							<option value=''>Select vehicle</option>
							{vehiclesAvailable?.map((vehicle) => (
								<option key={vehicle.vehicletype_id} value={`${vehicle.vehicletype_id},${vehicle.vehicletype_name},${vehicle.carrier_fee}`}>
									{vehicle.vehicletype_name} &nbsp; (₱{vehicle.carrier_fee})
								</option>
							))}
						</InputFieldForm>
					</>
				)}

				<InputFieldForm labelName='Owner Name' inputClassName='uppercase' identifyAs={identifyAs} fieldName={'vehicleChosen.owner_name'} placeholder='Owner Name' type='text' />

				<InputFieldForm labelName='Plate Number' inputClassName='uppercase' identifyAs={identifyAs} fieldName={'vehicleChosen.plate_number'} placeholder='Plate Number' type='text' />
			</RenderIf>
		</div>
	);
};

const PassengerFormDetails = React.memo(PassengerForm);

export default PassengerFormDetails;

