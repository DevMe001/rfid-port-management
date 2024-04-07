import { isEmpty } from "lodash";
import moment from "moment";

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


export function dateFormatted(date: string) {
	const elapsedTime: number = moment().diff(date, 'milliseconds');

	// Convert milliseconds to a human-readable format
	const duration: moment.Duration = moment.duration(elapsedTime);

	return duration.humanize();
}



export default displayFullName;