import { useOutletContext } from 'react-router-dom';
import { Button,formInputStyle,FormGroup,ModalOverlay,modalCloseStyle, filterStyle, tableHeaderStyle, ActionButton, tableCellStyle, StatusBadge } from "../AdminLayout"
import { useState,useEffect  } from 'react';
import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import CommonTable from './Commontable';




export default function UsersPage() {
  const outlet = useOutletContext() || {};
  const { openModal = () => {}, showToast = () => {},refresh,setRefresh } = outlet;
  const[users,setUsers]=useState([])
  useEffect(()=>{
    const fetchUsers=async () =>{
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/users`)
      .then(response=> {setUsers(response.data);
        console.log(response.data)
      })
      .catch(err => {
      console.log("MESSAGE:", err.message);
  });
    };
    fetchUsers();
  },[refresh])


const handleDelete=async (user_id)=>{
  try{
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/admin/DeleteUser/${user_id}/`,{
        withCredentials: 'include',
      });
      setRefresh(prev=>prev+1);
  }
  catch(error){
    console.log(error);

  }

}
const userColumns = [
  { key: "username", label: "Name" },
  { key: "email", label: "Email" },
  { key: "userrole", label: "Role" },

  {
    key: "created_on",
    label: "Joined",
    render: (value) =>
      new Date(value).toLocaleString("en-GB") 
  },

  {
    key: "status",
    label: "Status",
    render: (value) => <StatusBadge status={value || "Active"} />
  }
];


  return (
    <div className="admintable">
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #252830',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>User Management</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button primary onClick={() => openModal('userModal')}>+ Add User</Button>
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #252830', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <select style={filterStyle}>
          <option>All Roles</option>
          <option>Superadmin</option>
          <option>Staff</option>
          <option>User</option>
        </select>
        <select style={filterStyle}>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <input type="text" placeholder="Search users..." style={filterStyle} />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <CommonTable columns={userColumns}
          data={users}
          actions={(user) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <ActionButton onClick={() => openModal('userModal', user)}><MdOutlineModeEdit /></ActionButton>
              <ActionButton onClick={() => handleDelete(user.id)}><MdOutlineDelete /></ActionButton>
            </div>
          )}>
        </CommonTable>
          
      </div>
      <div style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      </div>
    </div>
  );
}



export function UserModal({ show, onClose, showToast,selectedUser,setRefresh }) {
const [userdata,setUserData] = useState([
  { username: '', email: '', userrole: '', password: '' }
]);
const isEdit = !!selectedUser;


useEffect(()=>{
  if (selectedUser){
    setUserData({
     username:selectedUser.username??"" ,
     email:selectedUser.email?? '', 
     userrole:selectedUser.userrole?? '', 
     password:'' 
    })
     
  }
  else{
    setUserData({
      username: '',
      email: '', 
      userrole: '', 
      password: ''
    })
  }

},[show,selectedUser]);

  const formreset=()=>{
    setUserData({ username: '', email: '', userrole: '', password: '' });
  }

const handleSubmit=async ()=>{
  try{
    const formdata=new FormData();
    Object.entries(userdata).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    if(!isEdit){
      formdata.append("user_id",setUserData.userid)
    }

    const csrfResponse = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/get-csrf-token/`,
      { withCredentials: 'include' }
    );
    const csrfToken = csrfResponse.data.csrfToken;

    if (isEdit) 
      {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/users/${selectedUser.id}`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
        withCredentials: 'include'

        });

        }
    else{
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/admin/users`, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrfToken,
      },
      withCredentials: 'include'

      });
    }
  formreset();
  onClose();
  setRefresh(prev => prev + 1);
  showToast('User created!', 'success'); 
  }
  catch(error){
    console.error("Error creating user:", error);
  }
}
const togglePassword = () => {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
  };
  if (!show) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ padding: '24px', borderBottom: '1px solid #252830', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Add New User</h3>
        <button onClick={onClose} style={modalCloseStyle}>×</button>
      </div>
      <div style={{ padding: '24px' }}>
        <FormGroup label="Full Name">
          <input type="text" placeholder="Enter full name" style={formInputStyle} value={userdata.username} onChange={e=>setUserData({...userdata,username:e.target.value})}/>
        </FormGroup>
        <FormGroup label="Email">
          <input type="email" placeholder="user@example.com" style={formInputStyle} value={userdata.email} onChange={e=>setUserData({...userdata,email:e.target.value})} />
        </FormGroup>
        <FormGroup label="Password">
          <div style={{position:"relative"}}>
          <input type="password" id="password" placeholder="Enter password" style={formInputStyle} value={userdata.password} onChange={e=>setUserData({...userdata,password:e.target.value})} />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePassword}
            aria-label="Toggle password visibility"
          >
            👁
          </button>
          </div>
        </FormGroup>
        <FormGroup label="Role">
          <select style={formInputStyle} value={userdata.userrole} onChange={e=>setUserData({...userdata,userrole:e.target.value})}>
            <option>Standard User</option>
            <option>Superadmin</option>
          </select>
        </FormGroup>
      </div>
      <div style={{ padding: '24px', borderTop: '1px solid #252830', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button secondary onClick={onClose}>Cancel</Button>
        <Button primary onClick={handleSubmit}>{isEdit? "Update":"Create"}</Button>
      </div>
    </ModalOverlay>
  );
}

