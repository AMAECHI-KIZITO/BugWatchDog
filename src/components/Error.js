import React from "react"
import {Link} from "react-router-dom"


function Error(){
    return(
        <>
            
            <div>
                <h1>Error 404</h1>
                <p>Page not found</p>
            </div>

            <div>
                <Link to='/' className="btn btn-success btn-sm">Back to Home</Link>
            </div>
        </>
    )
}

export default Error