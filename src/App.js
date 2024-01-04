import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

function App() {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/advertisement/get/false');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const postData = {
            animal: {
                name: "mock name",
                rasa: "mock rasa",
                description: "mock description",
                photoUrl: "mock photoUrl",
                found: true,
            },
            state: "false",
            id_user: "adoffbsdi",
            location: "mock location",
        };

        fetch("http://localhost:8080/advertisement/add", {
            method: "POST",
            body: JSON.stringify(postData),
        })

        fetchData();
    }, []);

  return (
      <div className="posts-container">
        {data.map((post) => {
          return (
              <div className="post-card" key={post.id}>
                <div className="button">
                  <div className="delete-btn">${post.id}</div>
                </div>
              </div>
          );
        })}
      </div>
  );
}

export default App;
