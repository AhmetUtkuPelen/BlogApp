import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store.ts";
import { Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../FireBase.tsx";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  deleteUserStart,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../Redux/Slices/UserSlice.ts";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { signOutSuccess } from "../Redux/Slices/UserSlice.ts";

const DashBoardProfile = () => {
  interface FormData {
    username?: string;
    email?: string;
    password?: string;
    profilePicture?: string;
  }

  const { currentUser } = useSelector((state: RootState) => state.user);

  const [image, setImage] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    profilePicture: currentUser?.profilePicture || "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const dispatch = useDispatch();

  const filePickerRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      setImage(file[0]);
      setImageFileUrl(URL.createObjectURL(file[0]));
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage(image);
    }
  }, [image]);

  // ? UPLOAD IMAGE ? \\
  const uploadImage = async (image: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    // ? Add userID to path ? \\
    const storageRef = ref(
      storage,
      `profilePictures/${currentUser?._id}/${fileName}`
    );
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
    });
    uploadTask
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageFileUrl(url);
          setFormData({ ...formData, profilePicture: url });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // ? UPLOAD IMAGE ? \\

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  // ? UPDATE USER BY SUBMITTING FORM ? \\
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser?._id) {
      return toast.error("User not found");
    }

    try {
      dispatch(updateStart());

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/users/update/${
          currentUser._id
        }`,
        formData,
        {
          withCredentials: true, // Important for sending cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(updateSuccess(response.data));
      toast.success("Profile updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Update failed";
        console.error("Auth error:", error.response?.data);
        dispatch(updateFailure(message));
        toast.error(message);
      } else {
        dispatch(updateFailure("Something went wrong"));
        toast.error("Something went wrong");
      }
    }
  };
  // ? UPDATE USER BY SUBMITTING FORM ? \\

  // ? DELETE USER ? \\
  const UserHandleDelete = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/users/delete/${
          currentUser?._id
        }`,
        { withCredentials: true }
      );
      toast.success("Account deleted successfully");
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(
        deleteUserFailure(
          error instanceof Error ? error.message : "Something went wrong"
        )
      );
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };
  // ? DELETE USER ? \\

  // ? LOGOUT USER ? \\
  const UserHandleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/logout`, {
        withCredentials: true,
      });

      // Dispatch before navigation
      dispatch(signOutSuccess());

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Force reload and redirect
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };
  // ? LOGOUT USER ? \\

  return (
    <div className="max-w-screen mx-auto p-3 w-full">
      <h1 className={`text-center font-semibold text-3xl`}>PROFILE</h1>
      <form
        className="flex flex-col cursor-pointer mt-4 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="w-32 h-32 self-center"
          onClick={() => filePickerRef.current?.click()}
        >
          {}
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            alt={`Profile-Picture`}
            className="rounded-full h-full w-full border-8 border-[lightgray] object-cover"
          />
        </div>

        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser?.username}
          placeholder="Username"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          defaultValue={currentUser?.email}
          placeholder="Email"
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button type="submit" color="blue" outline>
          UPDATE
        </Button>

        {currentUser?.isAdmin && (
          <Link to="/createPost">
            <Button type="button" className="mt-4 w-full" color="blue">
              CREATE POST
            </Button>
          </Link>
        )}
      </form>

      <div className={`text-red-500 cursor-pointer flex justify-between mt-5`}>
        <span onClick={() => setShowModal(true)}>Delete Account</span>
        <span onClick={UserHandleLogout}>Log Out</span>
      </div>

      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <FaPersonCircleQuestion className="text-4xl text-red-500 dark:text-white mb-4 mx-auto" />
              <h3 className="mb-5 text-center text-lg text-blue-500">
                ? You Sure You Want To Delete Your Account ?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={UserHandleDelete}>
                  DELETE
                </Button>
                <Button color="blue" onClick={() => setShowModal(false)}>
                  CANCEL
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DashBoardProfile;
