import React, { useEffect, useState } from 'react'
import Header from './Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer/Footer'
import axios from "axios"


function Layout() {
  const [today, setToday] = useState(new Date().getDay());
  const [subs, setSubs] = useState(false);
  const [user, setUser] = useState(null);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const res = await axios.get(`${apiUrl}/user`, {
          withCredentials: true
        });
      
        setUser(res.data);
        setSubs(res.data.subscribed);
        console.log(res.data);
        console.log(res.data.subscribed);
        
                

      } catch (err) {
        // console.log("eeeee");
        
        if (err.response?.status === 401) {
        } else {
          console.error("Unexpected error:", err);
        }
      } finally {
        // setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setToday(new Date().getDay());
    }, 60 * 1000); // every 1 minute

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (user != null && !subs) {
      axios.delete(`${apiUrl}/subs`, { withCredentials: true })
        .then(res => {
          // console.log("All items are deleted");
        })
        .catch(err => {
          console.log("error iin delete after subs");
          console.log(err);
        })
    }
  }, [today])

  useEffect(() => {
    let intervalId = null;

    axios.get(`${apiUrl}/subs`, { withCredentials: true })
      .then(res => {
        console.log("Subs in frontend get layout");

        if (res.data.doe == null) return;

        const target = new Date(res.data.doe);
        // console.log(target);

        const updateOnce = () => {
          const now = new Date();
          const diffMs = target - now;
          if (diffMs <= 0) {

            axios.delete(`${apiUrl}/subs`, { withCredentials: true })
              .then(res => {
                console.log("All items are deleted");
              })
              .catch(err => {
                console.log("error iin delete after subs");
                console.log(err);
              })

            axios.post(`${apiUrl}/subs`, { chk: false }, { withCredentials: true })
              .then(res => {
                window.location.reload();
              }
              ).catch(err => {

                console.log(err);
              })

            // console.log("done in Layout");

            clearInterval(intervalId);
            // window.location.reload();
            return;
          }


        };

        updateOnce(); // set initial values right away

        intervalId = setInterval(updateOnce, 1000);
      })
      .catch(err => {
        console.error("Failed to fetch subscription date:", err);
      });

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  //

  return (
    <div>

      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
