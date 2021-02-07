<?php
session_start();



if(isset($_POST["user_id"]) && isset($_SESSION["logged_in"]) && isset($_SESSION["is_admin"])){
    $user_id = $_POST["user_id"];
    $mysqli = @new mysqli("localhost", "WebINGEOAdmin", "WebINGEOAdmin", "INGEO");

        if(!$mysqli->connect_errno){
            if($stmt = $mysqli -> prepare("DELETE FROM users WHERE idUsers=?")) {
                $bind = $stmt->bind_param("i", $user_id);
                $exec = $stmt->execute();
                
                $dir = "../res/".$user_id;

                $files = glob($dir.'/*');
                foreach($files as $file){
                    if(is_file($file)) {
                        unlink($file);
                    }
                }

                rmdir($dir);

                $response = [
                    "success" => true,
                    "affected_rows" => $stmt->affected_rows
                ];

                header("Content-Type: application/json");
                echo json_encode($response);

                $stmt->close();
            } else {
                $response = [
                    "error" => "Sentencia DB fallida."
                ];
                header("Content-Type: application/json");
                echo json_encode($response);
            }
            $mysqli->close();
        } else {
            $response = [
                "error" => "DB no conectada."
            ];
            header("Content-Type: application/json");
            echo json_encode($response);
        }
} else {
    $response = [
        "error" => "Falló la autenticación."
    ];
    header("Content-Type: application/json");
    echo json_encode($response);
}
?>