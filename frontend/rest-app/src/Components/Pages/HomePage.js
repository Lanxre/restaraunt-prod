import React, { useEffect, useState } from "react";
import './HomePage.css'
import Loader from "../Loader/Loader";

function HomePage() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData]  = useState([])
  useEffect(() => {
      setTimeout(() => {
          fetch('https://jsonplaceholder.typicode.com/posts?_page=1&_limit=5').
          then(res => res.json()).then(json => setData(json))
          setLoading(false)
      }, 3000);
  })
  return isLoading ?  (<div className="loader"><Loader/></div>) : (
    <div className="page">
        <p className="text-styled">Список последних новостей</p>
        {data.map(elem => (
            <p className = "content">{elem.body}</p>
        ))}
    </div>
  )
}

export default HomePage;