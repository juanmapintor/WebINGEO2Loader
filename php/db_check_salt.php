<?php
    /*
        Este script chequea la existencia del usuario solicitado, y en caso de existir, devuelve su sal y si es 
        administrador o no.

        Devuelve, en caso satisfactorio, un objeto JSON con claves "salt" y "is_admin",
        y en caso de error, un objeto JSON con clave "error" que contiene un codigo de error. 
    */
    if(isset($_POST["usr_name"]) && !empty($_POST["usr_name"])){
        $mysqli = @new mysqli("localhost", "WebINGEOLookup", "WebINGEOLookup", "INGEO");
        if(!$mysqli->connect_errno){
            $usr_name = $_POST["usr_name"];
            if ($stmt = $mysqli->prepare("SELECT usr_password_salt, is_admin FROM users WHERE usr_name=?")) {
                $stmt->bind_param("s", $usr_name);
                $stmt->execute();
                $stmt->bind_result($salt, $is_admin);
                $stmt->fetch();
                if(!empty($salt)){
                    $result = [
                        "salt" => $salt,
                        "is_admin" => $is_admin
                    ];
                    header('Content-Type: application/json');
                    echo json_encode($result);
                } else {
                    $result = [
                        "error" => "Usuario inexistente."
                    ];
                    header('Content-Type: application/json');
                    echo json_encode($result);
                }
                $stmt->close();
            }
            $mysqli->close();
        } else {
            $result = [
                "error" => "Error conexión DB."
            ];
            header('Content-Type: application/json');
            echo json_encode($result);
        }
    } else {
        $result = [
            "error" => "Fallo de autenticación."
        ];
        header('Content-Type: application/json');
        echo json_encode($result);
    }
?>