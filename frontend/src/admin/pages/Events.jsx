import { useOutletContext } from 'react-router-dom';
import { useState,useEffect  } from 'react';
import axios from 'axios';
import { Button,formInputStyle,FormGroup,ModalOverlay,modalCloseStyle, filterStyle, tableHeaderStyle, ActionButton, tableCellStyle, StatusBadge } from "../AdminLayout"
import "../AdminDashboard.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import CommonTable from './Commontable';

export default function EventsPage() {
  const[events,setEvents]=useState([])
  const outlet = useOutletContext() || {};
  const { openModal = () => {},refresh,setRefresh } = outlet;
  useEffect(()=>{
    const fetchEvents=async () =>{
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events`)
      .then(response=> {setEvents(response.data);console.log(response.data)})
    };
    fetchEvents();
  },[refresh])



const handleDelete=async (event_id)=>{
  try{
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/DeleteEvent/${event_id}/`,{
        withCredentials: 'include',
      });
      setRefresh(prev=>prev+1);
  }
  catch(error){
    console.log(error);

  }

}

const EventColumns=[
  { key: "event_title", label: "Event Name" },
  { key: "event_category", label: "Category" },
  { key: "event_scheduled_date", label: "Date",render:(value)=>new Date(value).toLocaleString("en-GB")  },
  { key: "event_location", label: "Location" },
  { key: "event_total_seats", label: "Capacity" },
  { key: "status", label: "Status" , render: (value) => <StatusBadge status={value || "Active"} /> }
];
  return (
    <div className="admintable">
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #252830',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Event Management</h2>
        <Button primary onClick={() => openModal('eventModal',null)}>Create Event</Button>
      </div>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #252830', display: 'flex', gap: '12px' }}>
        <select style={filterStyle}>
          <option>All Categories</option>
          <option>Music</option>
          <option>Conference</option>
          <option>Art</option>
        </select>
        <select style={filterStyle}>
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <CommonTable columns={EventColumns}
          data={events}
          actions={(event) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <ActionButton onClick={() => openModal('eventModal', event)}><MdOutlineModeEdit /></ActionButton>
              <ActionButton onClick={() => handleDelete(event.event_id)}><MdOutlineDelete /></ActionButton>
            </div>
          )}>
        </CommonTable>
      </div>
    </div>
  );
}

export function EventModal({ show, onClose, showToast, selectedEvent,setRefresh }) {
  const [eventData, setEventData] = useState({
    event_title: "",
    event_description: "",
    event_scheduled_date: "",
    event_total_seats: "",
    event_price: "",
    event_location: "",
    event_category: ""
});
const isEdit = !!selectedEvent;

useEffect(() => {
    if (selectedEvent) {
      setEventData({
        event_title: selectedEvent.event_title ?? "",
        event_description: selectedEvent.event_description ?? "",
        event_scheduled_date: selectedEvent.event_scheduled_date
          ? new Date(selectedEvent.event_scheduled_date)
          : null,
        event_total_seats: selectedEvent.event_total_seats ?? "",
        event_price: selectedEvent.event_price ?? "",
        event_location: selectedEvent.event_location ?? "",
        event_category: selectedEvent.event_category ?? "",
        event_image: null
      });
    } else {
      setEventData({
        event_title: "",
        event_description: "",
        event_scheduled_date: null,
        event_total_seats: "",
        event_price: "",
        event_location: "",
        event_category: "",
        event_image: null
      });
    }
  }, [show, selectedEvent]);
  
const formreset=()=>{
setEventData({
      event_title: "",
      event_description: "",
      event_scheduled_date: null,
      event_total_seats: "",
      event_price: "",
      event_location: "",
      event_category: ""
    });
}
const handleSubmit = async () => {
  try {

    // build FormData
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (key === "event_scheduled_date" && value) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    });

    if (isEdit) {
      formData.append("event_id", selectedEvent.event_id);
    }

    const csrfResponse = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/get-csrf-token/`,
      { withCredentials: 'include' }
    );
    const csrfToken = csrfResponse.data.csrfToken;

    if (isEdit) {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/CreateEvent/${selectedEvent.event_id}/`,
        formData,
        {
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: 'include',
        }
      );
      showToast("Event updated successfully!", "success");
    } else {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/CreateEvent`,
        formData,
        {
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: 'include',
        }
      );
      showToast("Event created successfully!", "success");
    }

    // reset form
    formreset();
    setRefresh(prev => prev + 1);
    onClose();

  } catch (error) {
    console.log(error);
  }
};
  if (!show) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ padding: '24px', borderBottom: '1px solid #252830', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{isEdit?"Update Event":"Create Event"}</h3>
        <button onClick={onClose} style={modalCloseStyle}>×</button>
      </div>
      <div style={{ padding: '24px' }}>
        <FormGroup label="Event Name">
          <input type="text" placeholder="Enter event name" style={formInputStyle} 
          value={eventData.event_title} onChange={e=>setEventData({...eventData,event_title:e.target.value})}/>
        </FormGroup>
        <FormGroup label="Description">
          <textarea placeholder="Event description..." style={{ ...formInputStyle, resize: 'vertical', minHeight: '100px' }} 
          value={eventData.event_description} onChange={e=>setEventData({...eventData,event_description:e.target.value})} />
        </FormGroup>
        <FormGroup label="Date & Time">
          <DatePicker
              selected={eventData.event_scheduled_date}
              onChange={(date) => setEventData({ ...eventData, event_scheduled_date: date })}
              showTimeSelect
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              minDate={new Date()}
              placeholderText="Select event date & time"
              className="datepicker-input"
            />        
        </FormGroup>
        <FormGroup label="Total Seats">
          <input type="number" style={formInputStyle}
          value={eventData.event_total_seats} onChange={e => setEventData({ ...eventData, event_total_seats: e.target.value })} />
        </FormGroup>
        <FormGroup label="Ticket Price">
          <input type="number" style={formInputStyle} 
          value={eventData.event_price} onChange={e => setEventData({ ...eventData, event_price: e.target.value })} />
        </FormGroup>
        <FormGroup label="event location">
          <input type="text" style={formInputStyle} 
          value={eventData.event_location} onChange={e => setEventData({ ...eventData, event_location: e.target.value })}/>
        </FormGroup>
        <FormGroup label="event Category">
          <select id="fruit-select" name="fruit"  style={formInputStyle} value={eventData.event_category}
          onChange={e => setEventData({ ...eventData, event_category: e.target.value })}>
            <option value="">--Please choose an option--</option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cherry">Cherry</option>
            <option value="date">Date</option>
          </select>       
        </FormGroup>
         <FormGroup label="event Image">
          <input type="file" style={formInputStyle} 
          accept='image/*' onChange={e => setEventData({ ...eventData, event_image: e.target.files[0] })}/>
        </FormGroup>
      </div>
      <div style={{ padding: '24px', borderTop: '1px solid #252830', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button secondary onClick={onClose}>Cancel</Button>
        <Button primary onClick={handleSubmit}>{isEdit ?"Update":"Create"}</Button>
      </div>
    </ModalOverlay>
  );
}

