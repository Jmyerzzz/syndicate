import { useState } from "react";
import Modal from "../Modal";

const UpdateAdjustments = (props: {baseUrl: string, account?: any, weeklyFigureId: string, currentAmount: number, selectedStartOfWeek: Date, setRefreshKey: any}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    amount: undefined,
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

    fetch(props.baseUrl + "/api/adjustment", {
      method: "POST",
      body: JSON.stringify({
        weeklyFigureId: props.weeklyFigureId,
        adjustmentData: formData,
        date: props.selectedStartOfWeek
      })
    })

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey +1)
    }, 1000)

    // Clear the form
    setFormData({
      amount: undefined,
      operation: ''
    });

    closeModal();
  };

  const markStiffed = (weeklyFigureId: string, stiffed: boolean) => {
    fetch("/api/figure/stiffed", {
      method: "POST",
      body: JSON.stringify({
        weeklyFigureId: weeklyFigureId,
        stiffed: stiffed
      })
    })

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey +1)
    }, 1000)

    closeModal();
  }

  return (
    <div>
      <button
        className="ml-5 px-2 text-gray-100 bg-blue-400 hover:bg-blue-500 rounded"
        onClick={openModal}
      >
        Update
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Update Adjustments">
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleAddAccount} className="bg-white">
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
            <div className="flex flex-row justify-between mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-gray-100 rounded hover:bg-blue-600"
              >
                Update
              </button>
              <button type="button" onClick={() => markStiffed(props.weeklyFigureId, true)} className="px-4 py-2 bg-red-500 text-gray-100 rounded hover:bg-red-600">
                Stiffed
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default UpdateAdjustments;