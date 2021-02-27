<?php
session_start();

function rrmdir($dir) { 
    if (is_dir($dir)) { 
      $objects = scandir($dir);
      foreach ($objects as $object) { 
        if ($object != "." && $object != "..") { 
          if (is_dir($dir. DIRECTORY_SEPARATOR .$object) && !is_link($dir."/".$object))
            rrmdir($dir. DIRECTORY_SEPARATOR .$object);
          else
            unlink($dir. DIRECTORY_SEPARATOR .$object); 
        } 
      }
      rmdir($dir); 
    } 
}

if(isset($_POST["user_id"]) && isset($_SESSION["logged_in"]) && isset($_SESSION["is_admin"])){
    $user_id = $_POST["user_id"];
    $mysqli = @new mysqli("localhost", "WebINGEOAdmin", "WebINGEOAdmin", "INGEO");

        if(!$mysqli->connect_errno){
            if($stmt = $mysqli -> prepare("DELETE FROM users WHERE idUsers=?")) {
                $bind = $stmt->bind_param("i", $user_id);
                $exec = $stmt->execute();
                
                $dir = "../res/".$user_id;

                rrmdir($dir); 
                
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