import { Button, tableHeaderStyle, ActionButton, tableCellStyle, StatusBadge } from "../AdminLayout"
import { useState,useEffect  } from 'react';
import axios from 'axios';
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import CommonTable from './Commontable';

export default function BookingsPage() {
  const[bookings,setBookings]=useState([])

  useEffect(()=>{
    const fetchBookings=async () =>{
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/bookings`)
      .then(response=> {setBookings(response.data);
        console.log(response.data)
      })
      .catch(err => {
      console.log("MESSAGE:", err.message);
  });
    };
    fetchBookings();
  },[])
;
const BookingColumns=[
  { key: "booking_id", label: "Booking ID" },
  { key: "username", label: "Customer" },
  { key: "event.event_title", label: "Event",render: (value, row) => row?.event?.event_title || "-" },
  { key: "seats", label: "Tickets" },
  { key: "price", label: "Amount" },
  { key: "status", label: "Status" , render: (value) => <StatusBadge status={value || "Active"} /> }
]

  return (
    <div  className="admintable">
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #252830',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Booking Management</h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <CommonTable columns={BookingColumns}
          data={bookings}
          // actions={(booking) => (
          //   <div style={{ display: 'flex', gap: '8px' }}>
          //     <ActionButton onClick={() => openModal('eventModal', booking)}><MdOutlineModeEdit /></ActionButton>
          //     <ActionButton onClick={() => handleDelete(booking.booking_id)}><MdOutlineDelete /></ActionButton>
          //   </div>
          // )}
          >
        </CommonTable>
      </div>
    </div>
  );
}