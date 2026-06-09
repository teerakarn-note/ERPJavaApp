'use client'

import { useState,useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { Config } from "../Config"
import Link from "next/link"
import { config } from "process"
import path from "path"

export default function Sidebar(){
    const [username,setUsername] = useState('');
    const router = useRouter();
    const [currentPath,setCurrentPath] = useState('');
    useEffect(()=>{
        fetchData();
        setCurrentPath(localStorage.getItem("currentPath") || (typeof window !== 'undefined' && window.location.pathname) || '');
    },[]);

    const fetchData = async() =>{
        try {
            const token = localStorage.getItem(Config.tokenKey)
            const response = await axios.get(`${Config.apiUrl}/api/users/admin-info`,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.status ===200){
                setUsername(response.data.username);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "ไม่สามารถดึงข้อมูลผู้ใช้มาได้"+error

            })
        }
    }
    const handleLogout = async ()=>{
        try{
            const button = await Swal.fire({
                icon: 'question',
                title: 'ยืนยันลงชื่อออก',
                text : 'คุณแน่ใจออกจากระบบหรือไม่',
                showCancelButton :true,
                showConfirmButton: true

            })
            if(button.isConfirmed){
                localStorage.removeItem(Config.tokenKey);
                router.push('/');
            }
        }catch(error){
            Swal.fire({
                icon:'error',
                title: 'Error',
                text: 'ไม่สามารถลงชื่อออกได้  : '+error
            })
        }
    }
    const navigateAndSetCurrentPaht = (p: string) => {
        const path = p.startsWith('/') ? p : `/${p}`;
        router.push(path);
        setCurrentPath(path);
        try{ localStorage.setItem('currentPath', path); }catch(e){}
    }

    const isActive = (p: string)  => {
        const path = p.startsWith('/') ? p : `/${p}`;
        return currentPath === path ? 'sidebar-nav-link-active' : 'sidebar-nav-link';
    }
    return<>
        <div className="sidebar">
            <div className="sidebar-container">
                <div className="sidebar-title">
                    <h1>
                        <i className="fas fa-leaf mr-3"></i>
                        Spring ERP
                    </h1>
                    <div className="text-lg font-normal mt-3 mb-4">
                        <i className="fas fa-user mr-3"></i>
                        {username}
                    </div>
                    <div className="flex gap-4 m-3 justify-center">
                        <Link href="/erp/user/edit" className="btn-edit">
                            <i className="fas fa-edit mr-2"></i>
                             Edit
                        </Link>
                        <button className="btn-logout" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Logout
                        </button>
                    </div>
                </div>
                <nav>
                    <ul className="sidebar-nav-list">
                        <li className="sidebar-nav-item">
                            <a onClick={()=>navigateAndSetCurrentPaht('erp/dashboard')}
                                className={isActive('/erp/dashboard')}>
                                <i className="fa fa-dashboard mr-2" ></i>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a onClick= {()=> navigateAndSetCurrentPaht('erp/stock')}
                                className={isActive('/erp/stock')}>
                                <i className="fas fa-box-open mr-2"></i>
                                <span>Stock</span>
                            </a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a onClick={()=>navigateAndSetCurrentPaht('/erp/production')} 
                            className={isActive('/erp/production')}>
                                <i className="fas fa-cogs mr-2"></i>
                                <span>การผลิตสินค้า</span>
                            </a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a onClick={()=>navigateAndSetCurrentPaht('/erp/sale')} 
                            className={isActive('/erp/sale')}>
                                <i className="fas fa-money-bill-trend-up mr-2"></i>
                                <span>ขาย</span>
                            </a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a onClick={()=>navigateAndSetCurrentPaht('/erp/account')} 
                            className={isActive('/erp/account')}>
                                <i className="fas fa-file-invoice-dollar mr-2"></i>
                                <span>บัญชี</span>
                            </a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a onClick={()=> navigateAndSetCurrentPaht('/erp/report')} 
                            className={isActive('/erp/report')}>
                                <i className="fas fa-chart-line mr-2"></i>
                                <span>รายงาน</span>
                            </a>
                        </li>
                        <li className="sidebar-nav-item">
                            <a onClick={()=>navigateAndSetCurrentPaht('/erp/user')} 
                            className={isActive('/erp/user')}>
                                <i className="fas fa-user-alt mr-2"></i>
                                <span>ผู้ใช้งาน</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </>
}