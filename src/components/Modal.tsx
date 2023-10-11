import { ReactElement, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";


const Modal = (props: { isOpen: boolean, onClose: () => void, title: string, children: ReactElement }) => {
  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (props.isOpen && e.target.classList.contains('modal-overlay')) {
        props.onClose();
      }
    };

    // Attach the event listener when the modal is open
    if (props.isOpen) {
      window.addEventListener('click', handleOutsideClick);
    }

    // Remove the event listener when the modal is closed or the component unmounts
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [props.isOpen, props.onClose]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${props.isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50 modal-overlay"></div>
      <div className="bg-white rounded-lg w-80 z-50">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-xl font-semibold text-gray-700">{props.title}</h2>
          <button
            className="text-gray-700"
            onClick={props.onClose}
          >
            <FontAwesomeIcon icon={faX} size={"lg"} />
          </button>
        </div>
        <div className="p-4">{props.children}</div>
      </div>
    </div>
  );
};

export default Modal;