import RenderIf from '../../../common/components/ui/render-if';
import CatalogDisplay from '../../../common/widget/slider';
import { onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import BookingRecentList from './booking-list';

const BookingMain = () => {
	const [toggle] = onToggleNavHomepageMobile();

	return (
		<RenderIf value={!toggle}>
			<main className='col-start-1 -col-end-1 row-start-2 row-end-2 h-auto'>
				<CatalogDisplay />
			<BookingRecentList/>
			</main>
		</RenderIf>
	);
};

export default BookingMain;
