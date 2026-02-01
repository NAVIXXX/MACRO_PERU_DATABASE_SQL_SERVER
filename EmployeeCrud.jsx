import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { wait } from '@testing-library/user-event/dist/utils';

const EmployeeCrud = () => {

  const [employees, setEmployees] = useState([]);

  const [employee, setEmployee] = useState({
    EmployeeName: "",
    MobileNumber: "",
    Department: "",
    Salary: ""
  });

  const [editing, setEditing] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const API_URL = 'http://localhost:5000/api/employees';

  useEffect(() => {
    fetchEmployees();
  },[]);

  const fetchEmployees = async () => {
    try{
        const response = await axios.get(API_URL);
        console.log(response);
        setEmployees(response.data.empData);
        setEmployeeId(response.data.empData.EmployeeID);
        }    catch(error)  {
        console.log(error);
    }
  };

  const editEmployee = async (EmployeeID)=>{
    try{
        const response = await axios.get(`${API_URL}/${EmployeeID}`);
        console.log(response);
        setEmployees(response.data.empData);
        setEmployeeId(response.data.empData.EmployeeID);
        setEditing(true);
    } catch(error){
        
    }

  }

  const deleteEmployee = async (id)=>{
    if(window.confirm("Seguro que deseas eliminar este usuario?")){
        try{
            await axios.delete(`${API_URL}/${id}`);
            toast.success("Se eliminó al empleado correctamente");
            fetchEmployees();
        }
        catch(error)
        {
            toast.error(error);
        }
  }  
  };

  const handleInputChange = (e) =>{
    const {name,value} =e.target;
    setEmployee({...employee,[name]:value});
  }

  const handleAddAndUpdate = async () =>{
    try{

        if(editing){
            axios.put(`${API_URL}/${employeeId}`, employee);
            toast.success("empleado actualizado satisfactoraimente")
        }
        else{
            axios.post(API_URL, employee);
            toast.success("empleado actualizado satisfactoraimente")
        }
        fetchEmployees();
        setEditing(false);
        setEmployee({
            EmployeeName: "",
            MobileNumber: "",
            Department: "",
            Salary: "",

        });
    }
    catch(error){
        console.log(error);
    }
  }
  return (
    <div className='container mt-5'>
        <ToastContainer/>
        <button
            className='btn btn-primary mb-2'
            data-bs-toggle="modal"
            data-bs-target="#employeeModal"
            onclick={()=> setEditing(false)}
            >
                añadir nuevo empleado 
            </button>
        <h1>EMPLOYEE CRUD TUTORIAL</h1>
        <table className='table table-bordered'>
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Mobile Number</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((emp)=>(
                    <tr key={emp.EmployeeId}>
                        <td>{emp.EmployeeName}</td>
                        <td>{emp.MobileNumber}</td>
                        <td>{emp.Department}</td>
                        <td>{emp.Salary}</td>
                        <td>
                            <button className='btn btn-warning me-2'
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                            onClick={()=> editEmployee(emp.EmployeeID)}
                            >
                                EDIT
                            </button>
                            <button className='btn btn-danger'
                            onClick={()=> deleteEmployee(emp.EmployeeID)}
                            >
                                Delete
                                </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

                {/* Modal Code */}
<div
  className="modal fade"
  id="employeeModal"
  tabIndex="-1"
  aria-labelledby="employeeModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="employeeModalLabel">
          {editing ? "Edit Employee" : "Add Employee"}
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <div className="modal-body"></div>
      <input type="text"
      name="EmployeeName" placeholder='Enter name'
      className='form-control mb-3'
      value={employee.EmployeeName}
      onChange={handleInputChange}/>
      <input type="text"
      name="MobileNumber" placeholder='Enter Mobile Number'
      className='form-control mb-3'
      value={employee.MobileNumber}
      onChange={handleInputChange}/>
      <input type="text"
      name="Department" placeholder='Enter Department'
      className='form-control mb-3'
      value={employee.Department}
      onChange={handleInputChange}/>
      <input type="text"
      name="Salary" placeholder='Enter Salary'
      className='form-control mb-3'
      value={employee.Salary}
      onChange={handleInputChange}/>

      <div className="modal-footer">
        <button
    type="button"
    className="btn btn-secondary"
    data-bs-dismiss="modal"
  >
    Close
  </button>

  <button
    type="button"
    className="btn btn-primary"
    onClick={handleAddAndUpdate}
  >
    Save changes
  </button>
      </div>
    </div>
  </div>
</div>



    </div>
  );
};



export default EmployeeCrud;
