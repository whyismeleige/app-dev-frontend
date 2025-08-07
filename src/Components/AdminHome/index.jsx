import styles from './index.module.css';
import Scraping from '../Scraping';
import Issues from '../Issues';
import DataChange from '../DataChange';
import { Route,Routes,Outlet } from 'react-router-dom';
import AdminBar from '../AdminNavbar';

export default function AdminHome(){
    return(
        <>
            <Routes>
                <Route path='/' element={<><AdminBar/><Outlet/></>}>
                    <Route path='scraping' element={<Scraping/>}></Route>
                    <Route path='issues' element={<Issues/>}></Route>
                    <Route path='data-change' element={<DataChange/>}></Route>
                </Route>
            </Routes>
        </>
    )
}