import withSnackbar from "../../../common/components/notistack";
import DashboardMain from "../../../common/components/ui/main.ui.component"
import Navigation from "../../../common/components/ui/navigation.ui.component"
import Chatbot from "../../buyers/chatbot";

const NavigationwithSnackbar = withSnackbar(Navigation);



const Dasboard = () => {
  return (
		<div className='container-fluid'>
			<NavigationwithSnackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} />
			<DashboardMain />
			<Chatbot />
		</div>
	);
}

export default Dasboard