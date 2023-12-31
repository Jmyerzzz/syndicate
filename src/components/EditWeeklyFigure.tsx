import { useState } from "react";
import Modal from "./Modal";

const EditWeeklyFigure = (props: {
  baseUrl: string;
  account?: any;
  weeklyFigure: any;
  selectedStartOfWeek: Date;
  setRefreshKey: any;
  setCellUpdating: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    amount: props.weeklyFigure.amount,
    operation: "",
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
    props.setCellUpdating(true);

    fetch(props.baseUrl + "/api/figure/edit", {
      method: "POST",
      body: JSON.stringify({
        account: props.account,
        figureData: formData,
        figureId: props.weeklyFigure.id,
        date: props.selectedStartOfWeek,
      }),
    }).then(() =>
      setTimeout(() => {
        props.setCellUpdating(false);
      }, 1200)
    );

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey + 1);
    }, 1000);

    // Clear the form
    setFormData({
      amount: 0,
      operation: "",
    });

    closeModal();
  };

  const setNoAction = () => {
    props.setCellUpdating(true);

    fetch(props.baseUrl + "/api/figure/edit", {
      method: "POST",
      body: JSON.stringify({
        account: props.account,
        figureData: {
          amount: 0,
          operation: "",
        },
        figureId: props.weeklyFigure.id,
        action: !props.weeklyFigure.action,
        date: props.selectedStartOfWeek,
      }),
    }).then(() =>
      setTimeout(() => {
        props.setCellUpdating(false);
      }, 1200)
    );

    setTimeout(() => {
      props.setRefreshKey((oldKey: number) => oldKey + 1);
    }, 1000);

    closeModal();
  };

  return (
    <div>
      <button
        className="ml-2 px-2 w-[47px] text-zinc-100 bg-blue-400 hover:bg-blue-500 rounded"
        onClick={openModal}
      >
        Edit
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Weekly Figure"
      >
        <div className="max-w-md mx-auto">
          <form onSubmit={handleAddAccount} className="bg-white p-4 rounded">
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="block text-zinc-700 font-semibold"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                onKeyDown={(event) => {
                  if (/\+|-/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="website"
                className="mb-2 block text-xl text-zinc-700 font-semibold"
              >
                Operation
              </label>
              <div className="flex flex-row items-center">
                <input
                  type="radio"
                  id="creditOperation"
                  name="operation"
                  value="credit"
                  onChange={handleChange}
                  className="mr-3 text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:cursor-pointer"
                />
                <label
                  htmlFor="creditOperation"
                  className="block text-zinc-700 font-semibold hover:cursor-pointer"
                >
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
                  className="mr-3 text-zinc-500 border border-zinc-300 rounded-md p-2 focus:outline-none focus:border-blue-500 hover:cursor-pointer"
                />
                <label
                  htmlFor="debitOperation"
                  className="block text-zinc-700 font-semibold hover:cursor-pointer"
                >
                  Debit (-)
                </label>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-zinc-100 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </form>
          <div className="p-4">
            <button
              onClick={() => setNoAction()}
              className="px-4 py-2 bg-red-500 text-zinc-100 rounded hover:bg-red-600"
            >
              {props.weeklyFigure.action ? "No Action" : "Action"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditWeeklyFigure;
