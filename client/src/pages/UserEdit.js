import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import useTitle from "../hooks/useTitle";
import useToastContext from "../hooks/useToastContext";

const ME_QUERY = gql`
  query Query {
    me {
      _id
      name
      username
      img
    }
  }
`;

const EDIT_ME = gql`
  mutation Mutation($name: String!, $img: Upload) {
    editMe(name: $name, img: $img) {
      status
    }
  }
`;

const UserEdit = () => {
  useTitle("Profile");
  const { loading, error, data, refetch } = useQuery(ME_QUERY);
  const [editMe] = useMutation(EDIT_ME);
  const [profileName, setProfileName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const { pushAlert, domain } = useToastContext();

  console.log(data);
  console.log(profileName);
  console.log(profileImg);
  console.log(domain);

  useEffect(() => {
    setProfileName(data?.me.name);
  }, [data]);

  const sumbiteEdit = async () => {
    try {
      const {
        data: {
          editMe: { status },
        },
      } = await editMe({
        variables: {
          name: profileName,
          img: profileImg ? profileImg : null,
        },
      });
      if (status === 200) {
        refetch();
        return pushAlert({
          msg: "Expense were successfully recorded",
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
        <div className="animate-spin w-16 h-16 m-16 rounded-full border-[10px] border-transparent border-b-[10px] border-b-red-800 mx-auto"></div>
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
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="max-w-[600px] border rounded-lg shadow-sm p-4 mx-auto">
          <h2 className="text-2xl font-bold mb-6">Edit profile</h2>
          <div className="text-center mb-8">
            <img
              className="w-[75px] h-[75px] rounded-full mx-auto mb-2"
              src={
                data.me.img
                  ? `${domain}/${data.me.img}`
                  : require("../img/man.png")
              }
              alt="User profile"
            />
            <input
              onChange={(e) => setProfileImg(e.target.files[0])}
              id="file"
              type="file"
            />
            <div className="text-center">
              <label htmlFor="file" className="cursor-pointer text-blue-600">
                Change profile photo
              </label>
            </div>
          </div>
          <div>
            <label className="block relative mb-4 mr-2">
              <input
                required
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="bg-gray-50 w-full h-9 p-2 border rounded border-gray-400"
              />
              <div className="absolute top-[6px] left-2 transition-all duration-200 text-gray-500">
                Name
              </div>
            </label>
            <button
              className="w-full text-white bg-blue-500 hover:bg-blue-600 transition-all py-2 rounded mt-4"
              onClick={() => sumbiteEdit()}
            >
              Sumbit edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
