import Login from './Components/Login'
import ForgetPass from './Components/ForgetPass'
import {Router,Routes,Route, BrowserRouter} from 'react-router-dom';

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/forget-password' element={<ForgetPass/>}/>
      </Routes>
    </BrowserRouter>
  )
}
