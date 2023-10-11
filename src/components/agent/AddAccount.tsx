import { useState } from "react";
import Modal from "../Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { User } from "@prisma/client";

const AddAccount = (props: {user?: User}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    website: '',
    username: '',
    password: '',
    ipLocation: '',
    creditLine: 0,
    maxWin: 0,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddAccount = (e: any) => {
    e.preventDefault();

    fetch("/api/accounts/add", {
      method: "POST",
      body: JSON.stringify({
        accountData: formData,
        user: props.user
      })
    })

    // Clear the form
    setFormData({
      website: '',
      username: '',
      password: '',
      ipLocation: '',
      creditLine: 0,
      maxWin: 0,
    });

    closeModal();
  };

  return (
    <div className="flex items-center justify-center w-full">
      <button
        className="w-full py-1 text-gray-100"
        onClick={openModal}
      >
        <FontAwesomeIcon icon={faPlus} size={"lg"} />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Account">
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleAddAccount} className="bg-white p-4 rounded">
            <div className="mb-4">
              <label htmlFor="website" className="block text-gray-700 font-semibold">
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="website" className="block text-gray-700 font-semibold">
                UserName
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
              <label htmlFor="website" className="block text-gray-700 font-semibold">
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="website" className="block text-gray-700 font-semibold">
                IP Address
              </label>
              <input
                type="text"
                id="ipLocation"
                name="ipLocation"
                value={formData.ipLocation}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="website" className="block text-gray-700 font-semibold">
                Credit Line
              </label>
              <input
                type="number"
                id="creditLine"
                name="creditLine"
                value={formData.creditLine}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="website" className="block text-gray-700 font-semibold">
                Max Win
              </label>
              <input
                type="number"
                id="maxWin"
                name="maxWin"
                value={formData.maxWin}
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
                Add Account
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default AddAccount;