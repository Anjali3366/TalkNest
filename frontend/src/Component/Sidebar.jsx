import { IoMdHome } from "react-icons/io"; // home
import { IoNotifications } from "react-icons/io5"; // notification
import { FaUserAlt } from "react-icons/fa"; // profile

export const SideBar = () => {
  return (
    <>
      <div className="w-40">
        <div className=" ml-4 mt-4 w-22 ">
          <img src="./whitetalknest.svg" />
        </div>
        <div className=" ">
          <table className="table ">
            <tbody>
              {" "}
              <tr>
                <td>
                  <div className="flex items-center text-xl ">
                    <IoMdHome className="m-1 size-7" />
                    Home
                  </div>
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <td>
                  <div className="flex items-center text-xl">
                    <IoNotifications className="m-1 size-7" />
                    Notifications
                  </div>
                </td>
              </tr>
              {/* row 3 */}
              <tr>
                <td>
                  <div className="flex items-center text-xl">
                    <FaUserAlt className="m-1 size-7" />
                    Profile
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
