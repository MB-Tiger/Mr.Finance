import React from "react";

const EditTagModal = (props) => {
  const {
    isEditTagModal,
    setIsEditTagModal,
    editTagDetail,
    setEditTagDetail,
    editMyTag,
  } = props;

  return (
    <>
      {isEditTagModal ? (
        <div
          onClick={() => setIsEditTagModal(false)}
          className="w-full min-h-screen fixed top-0 left-0 bg-black bg-opacity-50 cursor-not-allowed z-[60]"
        ></div>
      ) : null}
      {isEditTagModal ? (
        <div className="fixed md:w-[500px] sm:w-[440px] w-[285px] h-[240px] p-4 shadow-sm bg-gray-50 border rounded-lg top-32 left-1/2 -translate-x-1/2 z-[61] modal">
          <h3 className="text-xl font-medium text-blue-900 mb-5">Edit tag</h3>
          <label className="block relative mb-4">
            <input
              required
              type="text"
              value={editTagDetail.name}
              onChange={(e) =>
                setEditTagDetail({ ...editTagDetail, name: e.target.value })
              }
              className="bg-gray-50 w-full h-9 p-2 border rounded border-gray-400"
            />
            <div className="absolute top-[6px] left-2 transition-all duration-200 text-gray-500">
              Name
            </div>
          </label>
          <label className="flex space-x-2">
            <p className="font-medium">Pick color</p>
            <input
              className="bg-gray-50 cursor-pointer"
              value={editTagDetail.color}
              onChange={(e) =>
                setEditTagDetail({ ...editTagDetail, color: e.target.value })
              }
              type="color"
            />
          </label>
          <button
            onClick={() => editMyTag()}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition-all text-white lg:font-medium rounded mt-6"
          >
            Sumbit Changes
          </button>
        </div>
      ) : null}
    </>
  );
};

export default EditTagModal;
