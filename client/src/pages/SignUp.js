import React, { useState, useEffect } from "react";
import useTitle from "../hooks/useTitle";
import { gql, useMutation } from "@apollo/client";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import validate from "../components/validate";
import { Link } from "react-router-dom";
import useToastContext from "../hooks/useToastContext";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const SIGNUP_QUERY = gql`
  mutation Signup($name: String!, $username: String!, $password: String!) {
    signup(name: $name, username: $username, password: $password) {
      token
    }
  }
`;

const SignUp = () => {
  useTitle("Sign up");
  const [signUp] = useMutation(SIGNUP_QUERY);
  const [userData, setUserData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { pushAlert } = useToastContext();

  console.log(userData);

  useEffect(() => {
    if (cookies.get("ut")) return navigate("/dashboard/home");
  }, []);
  useEffect(() => {
    setErrors(validate(userData));
  }, [userData, touched]);

  const submitUser = async () => {
    try {
      if (Object.keys(errors).length) {
        setTouched({
          name: true,
          userName: true,
          password: true,
          isAccepted: true,
        });
        return pushAlert({
          msg: "Not valid, please check your form",
          type: "error",
          icon: "error",
        });
      }

      const {
        data: {
          signup: { token },
        },
      } = await signUp({
        variables: {
          name: userData.name,
          username: userData.userName,
          password: userData.password,
        },
      });
      cookies.set("ut", token);
      console.log(cookies);
      return navigate("/dashboard/home");
    } catch (error) {
      console.log(error);
      return pushAlert({
        msg: "Not valid, please check your form",
        type: "error",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-custom bg-cover px-4 py-8">
      <div className="max-w-sm min-h-[400px] bg-white rounded shadow mx-auto p-8 space-y-5">
        <h2 className="text-xl font-semibold text-blue-900">Sign Up</h2>
        <label className="block">
          <div className="mb-1">User name</div>
          <input
            className="w-full h-8 bg-gray-100 rounded p-2"
            onChange={(e) =>
              setUserData({ ...userData, userName: e.target.value })
            }
            onFocus={() => setTouched({ ...touched, userName: true })}
            onKeyUp={(e) => (e.key === "Enter" ? submitUser() : null)}
            type="text"
          />
          {errors.userName && touched.userName == true ? (
            <span className="text-red-900 text-xs">{errors.userName}</span>
          ) : null}
        </label>
        <label className="block">
          <div className="mb-1">Name</div>
          <input
            className="w-full h-8 bg-gray-100 rounded p-2"
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            onFocus={() => setTouched({ ...touched, name: true })}
            onKeyUp={(e) => (e.key === "Enter" ? submitUser() : null)}
            type="text"
          />
          {errors.name && touched.name == true ? (
            <span className="text-red-900 text-xs">{errors.name}</span>
          ) : null}
        </label>
        <label className="block relative">
          <div className="mb-1">Password</div>
          <input
            className="w-full h-8 bg-gray-100 rounded p-2"
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            onFocus={() => setTouched({ ...touched, password: true })}
            onKeyUp={(e) => (e.key === "Enter" ? submitUser() : null)}
            type={passwordShown ? "text" : "password"}
          />
          <span className="absolute right-2 bottom-[6px] cursor-pointer">
            {passwordShown ? (
              <IoEyeOffOutline
                className="text-xl text-black"
                onClick={() => setPasswordShown(false)}
              />
            ) : (
              <IoEyeOutline
                className="text-xl text-black"
                onClick={() => setPasswordShown(true)}
              />
            )}
          </span>
          {errors.password && touched.password == true ? (
            <span className="text-red-900 text-xs">{errors.password}</span>
          ) : null}
        </label>
        <label className="block mb-10 space-x-1">
          <input
            className="align-middle cursor-pointer"
            onChange={(e) =>
              setUserData({ ...userData, isAccepted: e.target.checked })
            }
            onFocus={() => setTouched({ ...touched, isAccepted: true })}
            onKeyUp={(e) => (e.key === "Enter" ? submitUser() : null)}
            type="checkbox"
          />
          <span className="mb-1">I accept the terms of privacy policy</span>
          {errors.isAccepted && touched.isAccepted == true ? (
            <div className="text-red-900 text-xs">{errors.isAccepted}</div>
          ) : null}
        </label>
        <button
          type="submit"
          className="w-full bg-red-500 transition-all hover:bg-red-600 mx-auto rounded text-white py-1"
          onClick={() => submitUser()}
          onKeyUp={(e) => (e.key === "Enter" ? submitUser() : null)}
        >
          Sign Up
        </button>
        <div className="flex justify-between items-baseline mt-3">
          <span className="text-sm">Already have an Account?</span>
          <Link to={"/"}>
            <button className="py-1 px-2 rounded transition-all hover:bg-[#0082FD] hover:text-white duration-200">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
