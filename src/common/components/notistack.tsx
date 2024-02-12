import { SnackbarProvider, SnackbarProviderProps, SnackbarOrigin, BaseVariant } from 'notistack';
import { ComponentType } from 'react';

interface WithSnackbarProps {
  // Add any props you want to pass to the wrapped component
  anchorOrigin?: SnackbarOrigin;
  autoHideDuration?: number;
  variant?: BaseVariant;
}

// Define the higher-order component
const withSnackbar = <P extends WithSnackbarProps>(WrappedComponent: ComponentType<P>): React.FC<P & SnackbarProviderProps> => {
  const WithSnackbar: React.FC<P & SnackbarProviderProps> = ({ anchorOrigin, autoHideDuration, variant, ...rest }) => {
    return (
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={anchorOrigin}
        autoHideDuration={autoHideDuration}
        variant={variant}
      >
        <WrappedComponent {...(rest as P)} />
      </SnackbarProvider>
    );
  };

  return WithSnackbar;
};

export default withSnackbar;
