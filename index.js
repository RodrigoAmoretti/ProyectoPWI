const express = require('express');
require("dotenv").config();
const path = require("path");
const hbs = require("hbs");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT || 8080;


//conexion a base de datos
const conexion = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
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

//handlebars
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"))
hbs.registerPartials(path.join(__dirname, "views/partials"));


//GETs

app.get("/", (req, res, next) => {
  res.render("index", {
    titulo: "Dojo Cobra Kai",
    Style: "index.css"
  })
});

app.get("/formulario", (req, res, next) => {
  res.render("formulario", {
    titulo: "Carga de producto para la tienda"
  })
});

app.get("/productos", (req, res, next) => {

  let sql = "SELECT * FROM producto";
  conexion.query(sql, (err,result) => {
    if (err) throw err;
    res.render("productos", {
      titulo: "Productos en stock",
      results: result,
    });
  });
});

app.get ("/contacto", (req, res) =>{
  res.render("contacto", {
    titulo: "Formulario de contacto"
  })
});

app.get ("/gracias", (req, res) =>{
  res.render("gracias", {
    titulo: "gracias"
  })
});

app.get ("/nuestro_dojo", (req, res) =>{
  res.render("nuestro_dojo", {
    titulo:"nuestro dojo"
  })
});

app.get ("/sensei", (req,res) =>{
  res.render ("sensei", {
    titulo: "Nuestros sensei"
  })
});

//POSTs

app.post ("/contacto", (req, res) =>{
  const { nombre, email } = req.body;
  if (nombre == "" || email == "") {
    let validacion = "Completa todos los datos por favor";
    res.render("contacto", {
      titulo: "Formulario de contacto",
      validacion
    })    
  } else{
    console.log(nombre);
    console.log(email);
    async function envioMail(){
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USEREMAIL,
          pass: process.env.PASSMAIL
        }
      });
      let envio = await transporter.sendMail({
        from: process.env.USEREMAIL,
        to: `${email}`,
        subject:"COBRA KAI NEVER DIES!",
        html:"Lo sentimos pero no estamos tomando nuevos alumnos, quizas quieras probar en un dojo de Miyagi-do."
      })
        res.render("gracias", {
          titulo: "gracias",
          nombre,
          email
        });
    }
    envioMail()
  }
});

app.post("/formulario", (req, res) =>{
  const {nombre, precio} = req.body;
  //console.log(nombre,precio);
  if (nombre == "" || precio == "") {
    let validacion = "Rellene los campos correctamente.";
    res.render("formulario", {
      titulo: "Formulario para proveedores",
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
      });
  }
});





app.listen(PORT, () => {
  console.log(`el servidor esta trabajando en el puerto ${PORT}`);
});


