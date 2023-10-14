import { useState } from "react";
import Modal from "../Modal";

const UpdateAdjustments = (props: {baseUrl: string, account?: any, weeklyFigure: any, setRefreshKey: any}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    amount: undefined,
    operation: '',
    zero_out: false
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
        weeklyFigure: props.weeklyFigure,
        adjustmentData: formData,
      })
    })

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey +1)
    }, 1000)

    // Clear the form
    setFormData({
      amount: undefined,
      operation: '',
      zero_out: false
    });

    closeModal();
  };

  const zeroOut = (weeklyFigure: any) => {
    let adjustmentSum = 0;
    weeklyFigure.adjustments.map((adjustment: any) => {
      adjustmentSum += adjustment.amount;
    })
    fetch(props.baseUrl + "/api/adjustment", {
      method: "POST",
      body: JSON.stringify({
        weeklyFigure: weeklyFigure,
        adjustmentData: {
          amount: weeklyFigure.amount - adjustmentSum,
          operation: weeklyFigure.amount > 0 ? "credit" : "debit",
          zero_out: true,
        }
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
                  className="mr-3 text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:cursor-pointer"
                />
                <label htmlFor="creditOperation" className="block text-gray-700 font-semibold hover:cursor-pointer">
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
                  className="mr-3 text-gray-500 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:cursor-pointer"
                />
                <label htmlFor="debitOperation" className="block text-gray-700 font-semibold hover:cursor-pointer">
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
              <button type="button" onClick={() => zeroOut(props.weeklyFigure)} className="px-4 py-2 bg-red-500 text-gray-100 rounded hover:bg-red-600">
                Zero Out
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default UpdateAdjustments;