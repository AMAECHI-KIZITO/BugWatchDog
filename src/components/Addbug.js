import React, {useState, useEffect} from "react"

function Addbug(){
    const [bugname, setBugname]=useState(null)
    const [bugDescription, setBugSummary]=useState(null)
    return(
        <>
            <div className="row dashboardlinks">

                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="bugName" style={{color:"gold"}}>Annoying Bug Name</label>
                                    <input type='text' className="form-control py-3" name="bugName" id="bugName" placeholder="Enter bug name"/>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="bugdescription" style={{color:"gold"}}>Bug Description</label>
                                    <textarea className='form-control' name='bugdescription'></textarea>
                                </div>

                                <div>
                                    <button className="btn" id="btnCreateBug" style={{backgroundColor:"gold"}}>Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Addbug