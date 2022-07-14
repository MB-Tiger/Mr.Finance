import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import useToastContext from "../hooks/useToastContext";
import { BiSearchAlt2 } from "react-icons/bi";
import CreateTagModal from "../components/CreateTagModal";
import EditTagModal from "../components/EditTagModal";
import { BiEdit } from "react-icons/bi";
import useTitle from "../hooks/useTitle";

const CREATE_TAG = gql`
  mutation Mutation($data: tagInfo!) {
    create_tag(data: $data) {
      status
    }
  }
`;

const EDIT_TAG = gql`
  mutation Mutation($id: ID!, $data: tagInfo!) {
    edit_tag(_id: $id, data: $data) {
      status
    }
  }
`;

const TAGS_LIST = gql`
  query Query {
    getMyTags {
      _id
      name
      color
    }
  }
`;

const TagsList = () => {
  useTitle("Tags");
  const [createTag] = useMutation(CREATE_TAG);
  const [editTag] = useMutation(EDIT_TAG);
  const { loading, error, data, refetch } = useQuery(TAGS_LIST);
  const [tagDetail, setTagDetail] = useState({});
  const [editTagDetail, setEditTagDetail] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [isCreateTagModal, setIsCreateTagModal] = useState(false);
  const [isEditTagModal, setIsEditTagModal] = useState(false);
  const { pushAlert } = useToastContext();

  // console.log(tagDetail);
  console.log(data);
  console.log(editTagDetail);

  const openEditModal = (_id) => {
    const unique = data?.getMyTags.findIndex((myTag) => myTag._id === _id);
    setEditTagDetail(data?.getMyTags[unique]);
    setIsEditTagModal(true);
  };

  const addTag = async () => {
    try {
      const {
        data: {
          create_tag: { status },
        },
      } = await createTag({
        variables: {
          data: {
            name: tagDetail.name,
            color: tagDetail.color,
          },
        },
      });
      if (status === 200) {
        refetch();
        setTagDetail({});
        setIsCreateTagModal(false);
        return pushAlert({
          msg: "Tag were successfully added",
          type: "success",
          icon: "success",
        });
      } else {
        return pushAlert({
          msg: "Not valid, please check your form",
          type: "error",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      return pushAlert({
        msg: "Not valid, please check your form",
        type: "error",
        icon: "error",
      });
    }
  };

  const editMyTag = async () => {
    try {
      const {
        data: {
          edit_tag: { status },
        },
      } = await editTag({
        variables: {
          id: editTagDetail._id,
          data: {
            color: editTagDetail.color,
            name: editTagDetail.name,
          },
        },
      });
      if (status === 200) {
        refetch();
        setIsEditTagModal(false);
        return pushAlert({
          msg: "Tag were successfully changed",
          type: "success",
          icon: "success",
        });
      } else {
        return pushAlert({
          msg: "Not valid, please check your form",
          type: "error",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      return pushAlert({
        msg: "Not valid, please check your form",
        type: "error",
        icon: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-spin w-16 h-16 m-16 rounded-full border-[10px] border-transparent border-b-[10px] border-b-red-800 bg-rose-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="w-full min-h-screen">
        <div className="text-xl font-semibold">Error!</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-8">
      <CreateTagModal
        setIsCreateTagModal={setIsCreateTagModal}
        isCreateTagModal={isCreateTagModal}
        setTagDetail={setTagDetail}
        tagDetail={tagDetail}
        addTag={addTag}
      />
      <EditTagModal
        isEditTagModal={isEditTagModal}
        setIsEditTagModal={setIsEditTagModal}
        editTagDetail={editTagDetail}
        setEditTagDetail={setEditTagDetail}
        editMyTag={editMyTag}
      />
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="md:text-3xl text-2xl font-bold">Tags list</h2>
          <button
            onClick={() => setIsCreateTagModal(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white sm:px-5 px-4 sm:py-2 py-1 rounded md:font-medium"
          >
            Add tag
          </button>
        </div>
        <div className="w-full bg-white relative rounded-lg shadow-sm p-4 mb-6">
          <input
            type="search"
            value={searchInput}
            placeholder="Search tag"
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-12 border rounded-lg focus:outline-blue-600 py-2 pl-9 pr-2"
          />
          <BiSearchAlt2 className="absolute top-1/2 -translate-y-1/2 ml-3 text-lg" />
        </div>
        {data?.getMyTags.length ? (
          <div className="w-full shadow-sm overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 font-medium">Tag</th>
                  <th className="py-3 font-medium">Name</th>
                  <th className="py-3 font-medium">Color</th>
                  <th className="py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {data?.getMyTags
                  .filter((myTag) =>
                    myTag.name.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .map((tag, i) => (
                    <tr key={tag._id}>
                      <td className="py-4 md:text-base text-sm">#{i + 1}</td>
                      <td className="py-4 md:text-base text-sm">{tag.name}</td>
                      <td className="py-3 px-1 md:text-base text-sm">
                        <div
                          className={`md:max-w-[75px] max-w-[50px] text-white py-3 rounded-full mx-auto`}
                          style={{ backgroundColor: tag.color }}
                        ></div>
                      </td>
                      <td className="py-4 md:text-base">
                        <BiEdit
                          onClick={() => openEditModal(tag._id)}
                          className="md:text-xl text-lg text-blue-900 cursor-pointer mx-auto"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full">
            <img
              className="w-[600px] mx-auto"
              src={require("../img/empty-concept.png")}
              alt="empty concept"
            />
            <div className="mt-4 text-lg text-center">
              There are currently no orders
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsList;
