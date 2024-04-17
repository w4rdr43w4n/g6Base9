import React, { useRef, useEffect, ReactNode  } from 'react';
import "@/components/editor/toolbar.css"
interface ModalProps {
 role?:string;

 children: ReactNode;
}

const Savemodal: React.FC<ModalProps> = ({children ,role}) => {
 
 return (
    <div id='modal' className={role}>
      {children}
    </div>
 );
};

export default Savemodal;
