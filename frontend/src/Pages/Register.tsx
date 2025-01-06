import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import BlogPicture from "../Assets/blog.png"
import { Link,useNavigate } from 'react-router-dom';
import { useState } from "react";
import GoogleAuth from "../Components/GoogleAuth.tsx";


interface CustomFormData {
  username: string;
  email: string;
  password: string;
}


const Register = () => {

  const [formData, setFormData] = useState<CustomFormData>({
    username: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate()

  const handleChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage("Please Fill In All Fields")
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if(data.success === false){
        return setErrorMessage(data.message)
      }

      setLoading(false)

      if(response.ok){
        navigate('/login')
      }

    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="min-h-[500px] mt-20">

    <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
      {/* ? LEFT SIDE START ? */}
      <div className="text-center flex-1">
        <div className="flex flex-col items-center">
        <img src={BlogPicture} className="w-56 mx-auto" />
        <Link to='/'><p className="text-2xl mt-5 text-blue-700 uppercase">Blog Project</p></Link>
        <p className="text-md mt-5 text-gray-700">You Can Register using your Email or with Google</p>
        </div>
      </div>
      {/* ? LEFT SIDE END ? */}



      {/* ? RIGHT SIDE START ? */}
      <div className="flex-1">

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            <div className="text-center">
            <Label value="Your Username" className="text-blue-600 font-bold text-md"/>
            <TextInput type="text" placeholder="Username" id="username" className="mt-2" onChange={handleChange}/>
            </div>
            
            <div className="text-center">
            <Label value="Your Email" className="text-blue-600 font-bold text-md"/>
            <TextInput type="email" placeholder="Email" id="email" className="mt-2" onChange={handleChange}/>
            </div>

            <div className="text-center">
            <Label value="Your Password" className="text-blue-600 font-bold text-md"/>
            <TextInput type="password" placeholder="Password" id="password" className="mt-2" onChange={handleChange}/>
            </div>

          <Button type="submit" color="blue" outline disabled={loading}>
            {
              loading ? (
                <>
                <Spinner className="w-5 h-5" color="white" size="sm" />
                <span className="pl-3">LOADING</span>
                </>
              ) : 'REGISTER'
            }
          </Button>

            <GoogleAuth/>

          </form>

        <div className="mt-4 text-center text-md">
          <span className="font-semibold">Already Have Account ? &nbsp;</span>
          <Link to='/login' className="text-blue-600 hover:underline">LOGIN</Link>
        </div>

      {errorMessage && (
        <Alert className="mt-5 text-md" color="failure">
          {errorMessage}
        </Alert>
      )}

      </div>
      {/* ? RIGHT SIDE END ? */}
    
    </div>

    </div>
  );
}

export default Register;
