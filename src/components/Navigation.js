import React, {useState, useEffect} from "react"

function Dashboard(){
  const [testing, setTesting]=useState('... fetching data')


  useEffect( () => {
    fetch('http://localhost:5000/api/v1/sampleapi/')
    .then(
      (rsp)=>rsp.json()
    )
    .then(
      (data) => {
        setTesting(data)
        console.log(data)
      }
    )
    .catch((error)=> console.log(error))

  }, [])


  return(
    <>
      <div className="row text-light">
        <div className="col">
          <h2>Debugger Application</h2>
        </div>
      </div>

      <div className="text-light">
        <h1>Hello Amaechi</h1>

        {
          (typeof testing.members==='undefined') ? (
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            testing.members.map( (value,key) => (
              <p key={key}>{value} is in location {key}</p>
            ))
          )
        }

      </div>
    </>
  )
}


export default Dashboard