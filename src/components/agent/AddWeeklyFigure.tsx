import { useState } from "react";
import Modal from "../Modal";

const AddWeeklyFigure = (props: {baseUrl: string, account?: any, selectedStartOfWeek: Date, setRefreshKey: any}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    amount: 0,
    operation: ''
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

    fetch(props.baseUrl + "/api/figure/add", {
      method: "POST",
      body: JSON.stringify({
        account: props.account,
        figureData: formData,
        date: props.selectedStartOfWeek
      })
    })

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey +1)
    }, 1000)

    // Clear the form
    setFormData({
      amount: 0,
      operation: ''
    });

    closeModal();
  };

  return (
    <div>
      <button
        className="ml-5 px-2 text-gray-100 bg-blue-400 hover:bg-blue-500 rounded"
        onClick={openModal}
      >
        Add
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Weekly Figure">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleAddAccount} className="bg-white p-4 rounded">
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700 font-semibold">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="website" className="mb-2 block text-xl text-gray-700 font-semibold">
                Operation
              </label>
              <div className="flex flex-row items-center">
                <input
                  type="radio"
                  id="creditOperation"
                  name="operation"
                  value="credit"
                  onChange={handleChange}
                  className="mr-3 text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                />
                <label htmlFor="creditOperation" className="block text-gray-700 font-semibold">
                  Credit (+)
                </label>
              </div>
              <div className="flex flex-row items-center">
                <input
                  type="radio"
                  id="debitOperation"
                  name="operation"
                  value="debit"
                  onChange={handleChange}
                  className="mr-3 text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                />
                <label htmlFor="debitOperation" className="block text-gray-700 font-semibold">
                  Debit (-)
                </label>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-gray-100 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default AddWeeklyFigure;