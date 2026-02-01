const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {sql, poolPromise} = require('./db.js')

const app = express();
app.use(bodyParser.json());
app.use(cors());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`El Servidor está corriendo en ${PORT}`));

// obtener el "ID" de todos los empleados

app.get("/api/employees/:id", async(req, res)=>{
    try{
        const {id} = req.params;

        if (isNaN(id)){
            return res.status(400).json({
                success: false,
                message: "invalid id"
            })
        }

        const pool = await poolPromise;
        const result = 
        await pool
        .request()
        .input("EmployeeID",sql.Int, id)
        .query(" SELECT * FROM DummyEmployees WHERE EmployeeID = @EmployeeID");
        console.log(result);

        if(result.recordset.length === 0){
            return res.status(404).json({
                success: false,
                message: " detalles de los empleados no encontrados"
            })
        }

        res.status(200).json({
            success:true,
            empData:result.recordset
        });
    }
    catch(error){
        console.log('Error', error);
        res.status(500).json({
            success:false,
            message:"Error en el servidor, intente de nuevo",
            error: error.message
        });
    }
})

//Añadir nuevo  empleado

app.post("/api/employees", async (req,res)=>{
    try{
        const {EmployeeName,MobileNumber,Department,Salary}=req.body;
        if(!EmployeeName || !MobileNumber || !Department || !Salary)
        {
            return res.status(404).json({
                success: false,
                message: "All fields are required ",

        
            });
        }
        const pool = await poolPromise;
        const result = 
        await pool
        .request()
        .input("EmployeeName",sql.VarChar, EmployeeName)
        .input("MobileNumber",sql.VarChar, MobileNumber)
        .input("Department",sql.VarChar, Department)
        .input("Salary",sql.Decimal, Salary)

        .query(" INSERT INTO DummyEmployees(EmployeeName,MobileNumber,Department,Salary) VALUES (@EmployeeName,@MobileNumber,@Department,@Salary)");
        res.status(200).json(result.rowsAffected)
    }
    catch(error)
    {
        res.status(500).json(error.message)
    }
});


//Actualizar un  empleado

app.put("/api/employees/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const {EmployeeName,MobileNumber,Department,Salary}=req.body;
        if(!EmployeeName || !MobileNumber || !Department || !Salary)
        {
            return res.status(404).json({
                success: false,
                message: "All fields are required ",

        
            });
        }
        const pool = await poolPromise;
        const result = 
        await pool
        .request()
        .input("EmployeeID",sql.Int, id)
        .input("EmployeeName",sql.VarChar, EmployeeName)
        .input("MobileNumber",sql.VarChar, MobileNumber)
        .input("Department",sql.VarChar, Department)
        .input("Salary",sql.Decimal, Salary)

        .query("UPDATE DummyEmployees SET EmployeeName=@EmployeeName, MobileNumber = @MobileNumber,Department = @Department,Salary = @Salary WHERE EmployeeID = @EmployeeID");
        res.status(200).json(result.rowsAffected)
    }
    catch(error)
    {
        res.status(500).json(error.message)
    }
});

//ELIMINAR un  empleado

app.delete("/api/employees/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        
        if(isNaN(id))
        {
            return res.status(400).json({
                success: false,
                message: "Invalid id",

        
            });
        }
        const pool = await poolPromise;
        const result = 
        await pool
        .request()
        .input("EmployeeID",sql.Int, id)
        
        .query("DELETE FROM DummyEmployees WHERE EmployeeID = @EmployeeID");
        console.log(result);
        res.status(200).json(result.rowsAffected)
    }
    catch(error)
    {
        res.status(500).json(error.message)
    }
});