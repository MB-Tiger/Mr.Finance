import React from "react";

const CreateTagModal = (props) => {
  const {
    setIsCreateTagModal,
    isCreateTagModal,
    setTagDetail,
    tagDetail,
    addTag,
  } = props;

  return (
    <>
      {isCreateTagModal ? (
        <div
          onClick={() => setIsCreateTagModal(false)}
          className="w-full min-h-screen fixed top-0 left-0 bg-black bg-opacity-50 cursor-not-allowed z-[60]"
        ></div>
      ) : null}
      {isCreateTagModal ? (
        <div className="fixed md:w-[500px] sm:w-[440px] w-[285px] h-[240px] p-4 shadow-sm bg-gray-50 border rounded-lg top-32 left-1/2 -translate-x-1/2 overflow-y-auto z-[61] modal">
          <h3 className="text-xl font-medium text-blue-900 mb-5">Create tag</h3>
          <label className="block relative mb-4">
            <input
              required
              type="text"
              value={tagDetail.name}
              onChange={(e) =>
                setTagDetail({ ...tagDetail, name: e.target.value })
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
              type="color"
              value={tagDetail.color}
              onChange={(e) =>
                setTagDetail({ ...tagDetail, color: e.target.value })
              }
              className="bg-gray-50 cursor-pointer"
            />
          </label>
          <button
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition-all text-white lg:font-medium rounded mt-6"
            onClick={() => addTag()}
          >
            Add tag
          </button>
        </div>
      ) : null}
    </>
  );
};

export default CreateTagModal;
