
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from "../AdminLayout";
import { useState, useEffect } from "react";
import axios from "axios";
export default function AnalyticsPage() {
  const stats = [
    { label: 'Conversion Rate', value: '68.2%', change: '↑ 5.2% vs last month', positive: true, icon: '📈', color: '#ff2c55' },
    { label: 'Avg Ticket Price', value: '$125', change: '↑ 8.7% vs last month', positive: true, icon: '💵', color: '#ff00ff' },
    { label: 'Satisfaction', value: '4.8', change: '↑ 0.3 vs last month', positive: true, icon: '⭐', color: '#00d9ff' },
    { label: 'Active Users', value: '8,234', change: '↑ 18.5% vs last month', positive: true, icon: '🔥', color: '#ffb800' }
  ];
  const [categoryData, setCategoryData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const COLORS = ["#ff2c55", "#00d9ff", "#ff00ff", "#ffb800", "#22c55e"];

useEffect(() => {
  async function loadData() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/analytics`);
      setCategoryData(res.data.categories || []);
      setRevenueData(res.data.revenue || []);
      console.log(res.data.revenue)
      setUserGrowthData(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  }
  loadData();
}, []);


  return (
    <>
      {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div> */}

      <div style={{
        background: '#141619',
        border: '1px solid #252830',
        borderRadius: '12px',
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #252830' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Revenue & Bookings</h2>
        </div>
        <div style={{ height: '300px', background: '#0a0b0d', borderRadius: '8px', padding: '16px', margin: '24px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252830" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#141619', border: '1px solid #252830' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#ff2c55" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={{
          background: '#141619',
          border: '1px solid #252830',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #252830' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Event Categories</h2>
          </div>
          <div style={{ height: '300px', background: '#0a0b0d', borderRadius: '8px', padding: '16px', margin: '24px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#141619', border: '1px solid #252830'}} labelStyle={{ color:'#fff' }}  itemStyle={{ color:'#fff' }}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{
          background: '#141619',
          border: '1px solid #252830',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #252830' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>User Growth</h2>
          </div>
          <div style={{ height: '300px', background: '#0a0b0d', borderRadius: '8px', padding: '16px', margin: '24px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252830" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ background: '#141619', border: '1px solid #252830' }} />
                <Legend />
                <Bar dataKey="users" fill="#00d9ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
