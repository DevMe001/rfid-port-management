import { FormikProps } from 'formik';

export interface FormData {
	vehicle_photo?: any;
	vehicle_name: string;
	vehicle_price: string;
}

interface FileInputProps {
	fieldName:string;
	onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({ fieldName,onChange }) => {
	return <input type='file' id='photo' name={fieldName} className='hidden' accept='image/*' onChange={onChange} />;
};

export default FileInput;
