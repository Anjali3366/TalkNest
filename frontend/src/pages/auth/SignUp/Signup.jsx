import { useState } from "react";
import { Link } from "react-router-dom";

export const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
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
      email: "",
      username: "",
      fullname: "",
      password: "",
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" h-full  w-full  flex  justify-center items-center gap-3.5 min-h-screen"
      >
        <div className="logo basic-1/3  ">
          <img className="max-w-96" src="./whiteLogo.svg" alt="Logo" />
        </div>
        <div className=" ml-2 basic-1/3 flex  flex-col justify-evenly gap-4">
          <h1 className=" text-3xl font-extrabold ">Join today.</h1>
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
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              type="email"
              placeholder="mail@site.com"
              value={formData.email}
              name="email"
              onChange={handleOnChange}
              required
            />
          </label>
          <div className="validator-hint hidden">Enter valid email address</div>

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
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232a3 3 0 114.243 4.243l-8.485 8.485a2 2 0 01-.878.515l-4.243 1.06 1.06-4.243a2 2 0 01.515-.878l8.485-8.485z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7l1 1"
              />
            </svg>

            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleOnChange}
              required
              placeholder="Full Name"
              pattern="[A-Za-z][A-Za-z\s\-']{1,29}"
              minLength="2"
              maxLength="30"
              title="Only letters, spaces, hyphens, or apostrophes"
            />
          </label>

          <p className="validator-hint hidden">
            Must be 2 to 30 characters
            <br />
            containing only letters, spaces, hyphens, or apostrophes
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
          <button className="btn btn-info rounded-4xl">Sign up</button>

          <p className="text-[0.9rem]">Already have an account ? </p>
          <button className="btn rounded-4xl text-blue-400">
            <Link to="/login">Sign in</Link>
          </button>
        </div>
      </form>
    </>
  );
};
