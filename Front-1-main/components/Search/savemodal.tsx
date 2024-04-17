import React, { useRef, useEffect, ReactNode  } from 'react';

interface ModalProps {
 onClose: () => void;
 children: ReactNode;
}

const Savemodal: React.FC<ModalProps> = ({ onClose, children }) => {

 return (
    <div className="modal">
      {children}
      <button onClick={onClose}>Cancel</button>
    </div>
 );
};

export default Savemodal;
