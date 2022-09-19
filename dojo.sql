create database dojo;

use dojo;

create table producto(
idproducto int not null auto_increment primary key,
nombre varchar(100),
precio int
);

select * from dojo.producto;

insert into producto values(
(null, "karategui femenino", 7500),
(null, "taza cobra kai", 450),
(null, "remera femenina", 2900),
(null, "remera unisex", 2900),
(null, "karategui liviano", 6200)
);

delete from producto where nombre= "taza cobra kai";

update dojo set precio = 5000 where nombre = "karategui liviano"

