import  { useEffect, useRef } from 'react'

const useDebounceRef = (cb:(...args:Array<any>)=>void,delay:number) => {
 
const argsRef = useRef<Array<any>>();
const timeout = useRef<ReturnType<typeof setTimeout>>()


const clearTimer = ()=>{
  if(timeout.current){
    clearTimeout(timeout.current)
  }
}

useEffect(()=>{

  return clearTimer();

},[])

const debounceCallback = (...args:Array<any>) =>{
  argsRef.current = args;

  clearTimer();

  timeout.current = setTimeout(() => {
      if(argsRef.current){
        cb(...argsRef.current);
      }
  }, delay);
}


return debounceCallback;


}

export default useDebounceRef;
