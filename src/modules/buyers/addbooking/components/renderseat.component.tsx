import React from 'react'
import RenderIf from '../../../../common/components/ui/render-if'
import ImageCircleRound from '../../../../common/components/ui/avatar.component';

type SeatProps = {
	seatNumber: number | string;
	onSeatReserve:()=> void;
};



const RenderSeat: React.FC<SeatProps> = ({seatNumber,onSeatReserve}) => {
const seatCondition: number = seatNumber as unknown as number;
const seatLabel: string = seatNumber as unknown as string;
	
	return (
		<div>
			<RenderIf value={seatCondition !== 0}>
				<div className='flex justify-center items-center my-4'>
					<ImageCircleRound className='w-10 h-10 p-6' label={seatLabel} />
				</div>
			</RenderIf>
			<div className='w-full h-[2.5rem] borderGray text-navy font-[500] text-center py-2 cursor-pointer hover:bg-accent hover:text-white' onClick={onSeatReserve}>
				Choose seat
			</div>
		</div>
	);
};

export default RenderSeat
