import { useState } from "react";
import Modal from "../Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { User } from "@prisma/client";

const EditUser = (props: {baseUrl: string, user: User, setRefreshKey: any}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    name: props.user.name,
    username: props.user.username,
    risk: props.user.risk_percentage,
    gabeWay: props.user.gabe_way || ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditAccount = (e: any) => {
    e.preventDefault();

    fetch(props.baseUrl + "/api/user/edit", {
      method: "POST",
      body: JSON.stringify({
        userId: props.user.id,
        userData: formData,
      })
    })

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey +1)
    }, 1000)

    // Clear the form
    setFormData({
      name: '',
      username: '',
      risk: 0,
      gabeWay: 0,
    })

    closeModal();
  };

  return (
    <div className="flex items-center pr-2">
      <button
        className="text-blue-200"
        onClick={openModal}
      >
        <FontAwesomeIcon icon={faPenToSquare} size={"lg"} />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit User">
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleEditAccount} className="bg-white p-4 rounded">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-semibold">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="risk" className="block text-gray-700 font-semibold">
                Risk
              </label>
              <input
                type="text"
                id="risk"
                name="risk"
                value={formData.risk}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="gabeWay" className="block text-gray-700 font-semibold">
                Gabe Way
              </label>
              <input
                type="text"
                id="gabeWay"
                name="gabeWay"
                value={formData.gabeWay}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-gray-100 rounded hover:bg-blue-600"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default EditUser;