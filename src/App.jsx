import Login from './Components/Login'
import ForgetPass from './Components/ForgetPass'
import VerifyEmail from './Components/VerifyEmail';

import {Router,Routes,Route, BrowserRouter} from 'react-router-dom';

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/forget-password' element={<ForgetPass/>}/>
        <Route path='/verify-email' element={<VerifyEmail/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
