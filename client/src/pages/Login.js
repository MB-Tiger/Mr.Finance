import React, { useState, useEffect, useRef } from "react";
import useTitle from "../hooks/useTitle";
import { gql, useMutation } from "@apollo/client";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import validate from "../components/validate";
import { Link } from "react-router-dom";
import useToastContext from "../hooks/useToastContext";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const LOGIN_QUERY = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const Login = () => {
  useTitle("Login");
  const [loginQuery] = useMutation(LOGIN_QUERY);
  const [userData, setUserData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const checkBoxRef = useRef();
  const { pushAlert } = useToastContext();

  console.log(userData);

  useEffect(() => {
    if (cookies.get("ut")) return navigate("/dashboard/home");
    checkBoxRef.current.checked = true;
  }, []);
  useEffect(() => {
    setErrors(validate(userData));
  }, [userData, touched]);

  const userLogin = async () => {
    try {
      if (Object.keys(errors).length) {
        setTouched({
          userName: true,
          password: true,
        });
      }
      if (errors.userName && errors.password)
        return pushAlert({
          msg: "Not valid, please check your form",
          type: "error",
          icon: "error",
        });

      const {
        data: {
          login: { token },
        },
      } = await loginQuery({
        variables: { username: userData.userName, password: userData.password },
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
        <h2 className="text-xl font-semibold text-blue-900">Login</h2>
        <label className="block">
          <div className="mb-1">User name</div>
          <input
            className="w-full h-8 bg-gray-100 rounded p-2"
            onChange={(e) =>
              setUserData({ ...userData, userName: e.target.value })
            }
            onFocus={() => setTouched({ ...touched, userName: true })}
            onKeyUp={(e) => (e.key === "Enter" ? userLogin() : null)}
            type="text"
          />
          {errors.userName && touched.userName == true ? (
            <span className="text-red-900 text-xs">{errors.userName}</span>
          ) : null}
        </label>
        <label className="block relative">
          <div className="mb-1">Password</div>
          <input
            className="w-full h-8 bg-gray-100 rounded p-2 pr-8"
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            onFocus={() => setTouched({ ...touched, password: true })}
            onKeyUp={(e) => (e.key === "Enter" ? userLogin() : null)}
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
            type="checkbox"
            ref={checkBoxRef}
          />
          <span className="mb-1">Remember me</span>
        </label>

        <button
          type="submit"
          className="w-full bg-red-500 transition-all hover:bg-red-600 mx-auto rounded text-white py-1"
          onClick={() => userLogin()}
          onKeyUp={(e) => (e.key === "Enter" ? userLogin() : null)}
        >
          Login
        </button>

        <div className="flex justify-between items-baseline mt-3">
          <span className="text-sm">Don't have an Account?</span>
          <Link to={"/signup"}>
            <button className="py-1 px-2 rounded transition-all hover:bg-[#0082FD] hover:text-white duration-200">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
