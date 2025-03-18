import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/planner/`); // change later
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [])

  const test = 0;

  return (
    <div>
      <h1>Hello World {test}</h1>
      <button>Test</button>
    </div>
  )
}

export default App

