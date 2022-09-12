const express = require('express');
require("dotenv").config();
const path = require("path");
const hbs = require("hbs");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const { request } = require('express');
const app = express();
const PORT = 3000 || 8080;


//conexion a base de datos
const conexion = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "lalala123",
  database: "DOJO",
});

conexion.connect((err) => {
  if (err) {
    console.error(`error en la conexion: ${err.stack}`)
    return;
  }
  console.log(`conectado a la base de datos dojo`);
});


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));

//motor de plantillas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"))
hbs.registerPartials(path.join(__dirname, "views/partials"));


//REVISAR ESTO SI SIRVE DE ALGO
//conexion.end();

app.get("/", (req, res, next) => {
  res.render("index", {
    titulo: "Dojo chugi"
  })
});

app.get("/formulario", (req, res, next) => {
  res.render("formulario", {
    titulo: "Formulario para productos"
  })
});

app.post("/formulario", (req, res) =>{
  const {nombre, precio} = req.body;
  console.log(nombre,precio);
  if (nombre == "" || precio == "") {
    let validacion = "Rellene los campos correctamente.";
    res.render("formulario", {
      titulo: "Formulario para productos",
      validacion
    })    
  } else{

      let datos = {
        nombre: nombre,
        precio: precio
      };

      let sql = "INSERT INTO producto SET ?";
      conexion.query(sql, datos, (err,result) => {
        if (err) throw err;
        res.render("formulario", {
          titulo: "Formulario para productos"
        });
      })
  }
});



app.listen(PORT, () => {
  console.log(`el servidor esta trabajando en el puerto ${PORT}`);
});


