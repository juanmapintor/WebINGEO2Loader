<?php
if(isset($_POST["usr_name"]) && !empty($_POST["usr_name"]) && isset($_POST["usr_password"]) && !empty($_POST["usr_password"]) && isset($_POST["is_admin"])){
    $usr_name = $_POST["usr_name"];
    $usr_password = $_POST["usr_password"];
    $is_admin = $_POST["is_admin"];

    $mysqli = @new mysqli("localhost", "WebINGEOLookup", "WebINGEOLookup", "INGEO");

    if(!$mysqli->connect_errno) {
        if($stmt = $mysqli -> prepare("SELECT idUsers, usr_password, is_admin, first_name FROM users WHERE usr_name=?")) {
            $stmt->bind_param("s", $usr_name);
            $stmt->execute();
            $stmt->bind_result($idUser, $fetched_password, $fetched_is_admin, $first_name);
            $stmt->fetch();
            if($usr_password == $fetched_password){
                session_start();
                $_SESSION["logged_in"] = true;
                $_SESSION["id_user"] = $idUser;
                $_SESSION["is_admin"] = $is_admin;
                $result = [
                    "success" => true,
                    "first_time" => ($first_name=="PRIMERO")
                ];
                header("Content-Type: application/json");
                echo json_encode($result);
            } else {
                $result = [
                    "error" => "Contraseña incorrecta."
                ];
                header("Content-Type: application/json");
                echo json_encode($result);
            }
            $stmt->close();
        }
        $mysqli->close();
    } else {
        $result = [
            "error" => "DB no conectada."
        ];
        header('Content-Type: application/json');
        echo json_encode($result);
    }
} else {
    $result = [
        "error" => "Falló la autenticación."
    ];
    header('Content-Type: application/json');
    echo json_encode($result);
}

?>