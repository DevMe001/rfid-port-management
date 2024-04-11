import React from 'react'
import Chatbot from '../../buyers/chatbot';
import withSnackbar from '../../../common/components/notistack';
import Navigation from '../../../common/components/ui/navigation.ui.component';


const NavigationwithSnackbar = withSnackbar(Navigation);

type Wrapper = {
  children?:React.ReactNode
}

const AdminWrapper: React.FC<Wrapper> = ({ children }) => {
	return (
		<div className='container-fluid'>
			<NavigationwithSnackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} />
			{children}
			<Chatbot />
		</div>
	);
};



const withAdminWrapper = <P extends object>(WrappedComponent: React.ComponentType<P & Wrapper>) => {
	const WithAdminWrapper: React.FC<P & Wrapper> = (props) => (
		<AdminWrapper>
			<WrappedComponent {...props} />
		</AdminWrapper>
	);

	return WithAdminWrapper;
};


export default withAdminWrapper;