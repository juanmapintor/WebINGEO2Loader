<?php
    session_start();
    $response = [
        "error" => "Vacio"
    ];
    if(isset($_SESSION["logged_in"])){
        $idUser = $_SESSION["id_user"];
        $mysqli = @new mysqli("localhost", "WebINGEOLookup", "WebINGEOLookup", "INGEO");
        if(!$mysqli -> connect_errno){
            if($result = $mysqli -> query("SELECT usr_password, usr_password_salt FROM USERS WHERE idUsers = ".$idUser)){
                $response = $result -> fetch_array(MYSQLI_ASSOC);
            }
        } else {
            $response = [
                "error" => "No se pudo conectar a la DB"
            ];
        }
    }
    header("Content-Type: application/json");
    echo json_encode($response);
?>