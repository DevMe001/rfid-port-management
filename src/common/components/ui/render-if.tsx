import React from 'react'

type Props = {
  value:string | boolean | number | Record<string,any> | [];
  children:React.ReactNode
}

const RenderIf: React.FC<Props> = ({ value, children }) => {
  if(value){
    return children;
  }else{
    return null;
  }
};

export default RenderIf
