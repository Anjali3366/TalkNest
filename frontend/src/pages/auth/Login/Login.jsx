import { useState } from "react";
import { Link } from "react-router-dom";
export const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleOnChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((preVal) => {
      return { ...preVal, [name]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    setFormData({
      username: "",
      password: "",
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" h-auto w-auto  flex  justify-center items-center gap-3.5 min-h-screen"
      >
        <div className="logo basic-1/3  ">
          <img className="max-w-96" src="./whiteLogo.svg" alt="Logo" />
        </div>
        <div className=" ml-2 basic-1/3 flex  flex-col justify-evenly gap-4">
          <h1 className=" text-3xl font-extrabold ">Let's go.</h1>

          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              className="max-w-64"
              type="input"
              name="username"
              value={formData.username}
              onChange={handleOnChange}
              required
              placeholder="Username"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
            />
          </label>
          <p className="validator-hint hidden">
            Must be 3 to 30 characters
            <br />
            containing only letters, numbers or dash
          </p>

          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleOnChange}
              required
              placeholder="Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />
          </label>
          <p className="validator-hint hidden">
            Must be more than 8 characters, including
            <br />
            At least one number
            <br />
            At least one lowercase letter
            <br />
            At least one uppercase letter
          </p>
          <button className="btn btn-info rounded-4xl">Login</button>

          <p className="text-[0.9rem]">Don't have an account ? </p>

          <button className="btn rounded-4xl text-blue-400">
            {" "}
            <Link to="/signup">Sign up </Link>
          </button>
        </div>
      </form>
    </>
  );
};
