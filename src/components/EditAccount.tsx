import { useState } from "react";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const EditAccount = (props: {
  baseUrl: string;
  account: any;
  setRefreshKey: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    website: props.account.website,
    bookie: props.account.bookie,
    referral: props.account.referral,
    username: props.account.username,
    password: props.account.password,
    ipLocation: props.account.ip_location,
    creditLine: props.account.credit_line,
    maxWin: props.account.max_win,
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

    fetch(props.baseUrl + "/api/accounts/edit", {
      method: "POST",
      body: JSON.stringify({
        accountId: props.account.id,
        accountData: formData,
      }),
    });

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey + 1);
    }, 1000);

    // Clear the form
    setFormData({
      website: "",
      bookie: "",
      referral: "",
      username: "",
      password: "",
      ipLocation: "",
      creditLine: 0,
      maxWin: 0,
    });

    closeModal();
  };

  const deleteAccount = async () => {
    if (deleteConfirmed) {
      fetch(props.baseUrl + "/api/accounts/delete", {
        method: "POST",
        body: JSON.stringify({
          accountId: props.account.id,
        }),
      });

      setTimeout(() => {
        props.setRefreshKey((oldKey: number) => oldKey + 1);
      }, 1000);

      closeModal();
    } else {
      alert("Click 'Delete Account' again to confirm delete");
      setDeleteConfirmed(true);
    }
  };

  return (
    <div className="flex items-center ml-2">
      <button
        className="invisible group-hover:visible transition ease-in-out opacity-0 group-hover:opacity-100 duration-400 text-blue-300"
        onClick={openModal}
      >
        <FontAwesomeIcon icon={faPenToSquare} size={"lg"} />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Account">
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleEditAccount} className="bg-white p-4 rounded">
            <div className="mb-4">
              <label
                htmlFor="website"
                className="block text-zinc-700 font-semibold"
              >
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="bookie"
                className="block text-zinc-700 font-semibold"
              >
                Bookie
              </label>
              <input
                type="text"
                id="bookie"
                name="bookie"
                value={formData.bookie}
                onChange={handleChange}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="referral"
                className="block text-zinc-700 font-semibold"
              >
                Referral
              </label>
              <input
                type="text"
                id="referral"
                name="referral"
                value={formData.referral}
                onChange={handleChange}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-zinc-700 font-semibold"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-zinc-700 font-semibold"
              >
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="ipLocation"
                className="block text-zinc-700 font-semibold"
              >
                IP Address
              </label>
              <input
                type="text"
                id="ipLocation"
                name="ipLocation"
                value={formData.ipLocation}
                onChange={handleChange}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="creditLine"
                className="block text-zinc-700 font-semibold"
              >
                Credit Line
              </label>
              <input
                type="number"
                id="creditLine"
                name="creditLine"
                value={formData.creditLine}
                onChange={handleChange}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="maxWin"
                className="block text-zinc-700 font-semibold"
              >
                Max Win
              </label>
              <input
                type="number"
                id="maxWin"
                name="maxWin"
                value={formData.maxWin}
                onChange={handleChange}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-zinc-100 rounded hover:bg-blue-600"
              >
                Update Account
              </button>
            </div>
          </form>
          <div className="p-4">
            <button
              onClick={() => deleteAccount()}
              className="px-4 py-2 bg-red-500 text-zinc-100 rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditAccount;
