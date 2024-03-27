import { isEmpty } from "lodash";

function displayFullName(firstname?:string,midlename?:string,lastname?:string){
	
	let fullName = '';
	
	if(!isEmpty(firstname)){
			fullName += firstname + ' ' ?? '';
	}
	if(!isEmpty(midlename)){
			fullName += midlename + ' ' ?? '';
	}
	if(!isEmpty(lastname)){
		fullName += lastname + ' ' ?? '';
	}

	return fullName;
}



export default displayFullName;