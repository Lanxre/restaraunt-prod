import React, { useEffect, useState } from "react";
import './HomePage.css'
import Loader from "../Loader/Loader";

const month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']


function HomePage() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData]  = useState([])
  useEffect(() => {
      setTimeout(() => {
          fetch('http://localhost:8000/api/news').
          then(res => res.json()).then(json => setData(json))
          setLoading(false)
      }, 3000);
  })
  return isLoading ?  (<div className="loader"><Loader/></div>) : (
    <div className="page">
        <p className="text-styled">Список последних новостей</p>
        {data.map(news => (
            <p className = "content">{parseInt(news.date.split('-')[0])} {month[parseInt(news.date.split('-')[1])]} {news.date.split('-')[2]} г. {news.article}</p>
        ))}
    </div>
  )
}

export default HomePage;