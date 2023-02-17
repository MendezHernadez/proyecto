<?php
$error;
if(!empty($_POST['usuario']) && !empty($_POST['password'])){
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];
    if($usuario == "cliente" && $password == "123"){ 
        $error = "valido";
        ob_start(); // Iniciar el buffer de salida
        header("Location: cliente.html");
        ob_end_flush(); // Liberar el buffer de salida y enviar la redirección
        exit(); // Detener la ejecución del script para asegurarte de que la redirección se realiza correctamente
    }
    if($usuario == "admin" && $password == "asd"){
        $error = "valido";
        ob_start();
        header("Location: admin.html");
        ob_end_flush();
        exit();
    }
    else
    {
        $error = "error";
        ob_start();
        header("Location: error.html");
        ob_end_flush();
        exit();
    }
} 