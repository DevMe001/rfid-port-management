import React from 'react'
import RenderIf from '../../../common/components/ui/render-if';
import FooterMd from '../../onboarding-flow/layout/homepage-footer-md';
import FooterXS from '../../onboarding-flow/layout/homepage-footer-sm';
import { onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import Headers from '../../onboarding-flow/layout/homepage-headers';
import BookingById from './bookingById';

const BuyerBookingById = () => {


  
		const [toggle] = onToggleNavHomepageMobile();

  return (
		<div className='relative grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 max-w-[90rem] mx-auto h-screen sm:h-[100%]' style={{ gridTemplateRows: '10vh auto 10vh' }}>
			<Headers />
			<BookingById />
			<RenderIf value={!toggle}>
				<FooterMd />
				<FooterXS />
			</RenderIf>
		</div>
	);
}

export default BuyerBookingById;
