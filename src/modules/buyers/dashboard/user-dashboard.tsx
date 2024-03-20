import Footer from '../../onboarding-flow/layout/homepage-footer-md';
import Headers from '../../onboarding-flow/layout/homepage-headers';
import DashboardUser from './main';

const BuyerDashboard = () => {
  return (
		<div className='relative grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 max-w-[90rem] mx-auto h-screen sm:h-[100%]' style={{ gridTemplateRows: '10vh repeat(2,1fr) 10vh' }}>
			<Headers />
			<DashboardUser />
			<Footer />
		</div>
	);
}

export default BuyerDashboard
