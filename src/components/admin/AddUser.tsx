import { useState } from "react";
import Modal from "../Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserForm from "../UserForm";

const AddUser = (props: { setRefreshKey: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <button className="w-full py-1 text-slate-100" onClick={openModal}>
        <FontAwesomeIcon icon={faPlus} size={"lg"} />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Account">
        <UserForm
          title={"Sign Up"}
          action={"/api/signup"}
          setRefreshKey={props.setRefreshKey}
        />
      </Modal>
    </div>
  );
};

export default AddUser;
