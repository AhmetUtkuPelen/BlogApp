import {Button} from "flowbite-react";
import {AiFillGoogleCircle} from "react-icons/ai";
import {GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth";
import { app } from "../FireBase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../Redux/Slices/UserSlice";
import { useNavigate } from "react-router-dom";




const GoogleAuth = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const auth = getAuth(app);

    const HandleGoogleAuth = async () : Promise<void> => {
      const authProvider = new GoogleAuthProvider();
      authProvider.setCustomParameters({prompt:'select_account'});
      try {
        const resultsGoogle = await signInWithPopup(auth,authProvider);
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/google`,{
          method:'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({
            name:resultsGoogle.user.displayName,
            email:resultsGoogle.user.email,
            photoUrl:resultsGoogle.user.photoURL
          }),
        })
        const data = await response.json();
        if(response.ok){
          dispatch(signInSuccess(data))
          navigate('/')
        }
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <Button type='button' color='blue' onClick={HandleGoogleAuth}><AiFillGoogleCircle className='w-5 h-5'/>&nbsp;LOGIN WITH GOOGLE</Button>
  )
}

export default GoogleAuth