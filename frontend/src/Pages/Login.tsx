import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import BlogPicture from "../Assets/blog.png"
import { Link,useNavigate } from 'react-router-dom';
import { useState } from "react";
import { signInFailure , signInStart , signInSuccess } from "../../Redux/Slices/UserSlice";
import { useDispatch,useSelector } from "react-redux";
import { RootState } from '../../Redux/Store';
import GoogleAuth from "../Components/GoogleAuth.tsx";
import { toast } from "react-toastify";



interface CustomFormData {
  username: string;
  email: string;
  password: string;
}


const Login = () => {

  const [formData, setFormData] = useState<CustomFormData>({
    username: '',
    email: '',
    password: ''
  });
  
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);

  const { loading, error: errorMessage } = useSelector((state: RootState) => state.user) as { loading: boolean, error: string | null };

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
  
      console.log('Response:', res.status);  // Add this log
  
      if (!res.ok) {
        const errorData = await res.json();
        dispatch(signInFailure(errorData.message));
        return toast.error(errorData.message);
      }
  
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      dispatch(signInFailure('Something went wrong'));
      toast.error('Something went wrong');
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
        <p className="text-md mt-5 text-gray-700">You Can Login using your Email or with Google</p>
        </div>
      </div>
      {/* ? LEFT SIDE END ? */}



      {/* ? RIGHT SIDE START ? */}
      <div className="flex-1">

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        
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
              ) : 'LOGIN'
            }
          </Button>

            <GoogleAuth/>

          </form>

        <div className="mt-4 text-center text-md">
          <span className="font-semibold">Have No Account ? &nbsp;</span>
          <Link to='/register' className="text-blue-600 hover:underline">REGISTER</Link>
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

export default Login;