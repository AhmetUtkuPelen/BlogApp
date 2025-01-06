import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../FireBase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  interface PostFormData {
    title?: string;
    category?: string;
    image?: string;
    content?: string;
  }

  const [file, setFile] = useState<File | null>(null);
  const [imageUpload, setImageUpload] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    category: "",
    image: "",
    content: "",
  });
  const [popError, setPopError] = useState<string | boolean>(false);

  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const formRef = useRef<HTMLFormElement>(null);

  // ? HANDLE IMAGE UPLOAD ? \\
  const HandleImageUpload = async () => {
    try {
      if (!file) return;
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUpload(Math.round(progress).toString());
        },
        (error) => {
          console.error("Upload error:", error);
          setImageUpload(null); // Reset on error
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUpload(null); // Reset after successful upload
          setFormData((prev) =>
            prev ? { ...prev, image: url } : { image: url }
          );
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      setImageUpload(null); // Reset on error
      setImageUploadError("An Error Occured While Uploading Image");
    }
  };
  // ? HANDLE IMAGE UPLOAD ? \\

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Debug: Log the form data being sent
    console.log("Sending formData:", formData);

    if (
      !formData?.title ||
      !formData?.category ||
      !formData?.content ||
      !formData?.image
    ) {
      setPopError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/users/createPost`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Debug: Log the raw response
      const responseText = await response.text();
      console.log("Raw server response:", responseText);

      if (!response.ok) {
        setPopError(responseText || "Failed to create post");
        return;
      }

      // Only try to parse JSON if we got a successful response
      const data = JSON.parse(responseText);
      setPopError(false);
      navigate(`/post/${data.post.slug}`);
    } catch (error) {
      console.error("Error:", error);
      setPopError("An error occurred while creating the post");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-[calc(90vh-100px)]">
      {/* ? CREATE POST ? */}
      <h1 className="text-2xl font-bold text-center my-7">CREATE A POST</h1>

      {/* ? FORM START ? */}
      <form
        ref={formRef}
        className="flex flex-col gap-4"
        onSubmit={handleSubmitForm}
      >
        {/* ? TITLE AND CATEGORY START ? */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            className="flex-1"
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            id="category"
            required
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="nodejs">Node.js</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="django">Django</option>
            <option value="fastapi">Fast API</option>
            <option value="djangorest">Django Rest</option>
          </Select>
        </div>
        {/* ? TITLE AND CATEGORY END ? */}

        {/* ? IMAGE INPUT START ? */}
        <div className="flex gap-4 items-center justify-between border-4 border-blue-500 border-dotted p-3">
          <FileInput
            id="image"
            accept="image/*"
            className="flex-1"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button
            type="submit"
            color="blue"
            onClick={HandleImageUpload}
            disabled={!!imageUpload}
          >
            {imageUpload ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={Number(imageUpload)}
                  text={`${imageUpload || 0}%`}
                />
              </div>
            ) : (
              "UPLOAD IMAGE"
            )}
          </Button>
        </div>
        {/* IMAGE INPUT END */}

        {imageUploadError && (
          <Alert className="text-red-500" color="failure">
            {imageUploadError}
          </Alert>
        )}
        {formData?.image && (
          <img
            src={formData.image}
            alt="uploaded"
            className="w-full h-96 object-cover"
          />
        )}

        {/* ? TEXT INPUT START ? */}
        <div className="flex flex-col gap-4">
          <ReactQuill
            className="bg-white h-[250px] mb-12"
            theme="snow"
            placeholder="Write Your Post Here..."
            modules={modules}
            formats={formats}
            onChange={(e) => setFormData({ ...formData, content: e })}
          />
        </div>
        {/* ? TEXT INPUT END ? */}

        <Button type="submit" color="blue" className="mt-6">
          CREATE POST
        </Button>
        {popError && (
          <Alert className="text-red-500 mt-5" color="failure">
            {popError}
          </Alert>
        )}
      </form>

      {/* ? FORM END ? */}
    </div>
  );
};

export default CreatePost;
