<?php
    session_start();
    $response = [
        "error" => "Sin inicializar."
    ];
    if(isset($_SESSION["logged_in"]) && isset($_SESSION["current_article"])){
        $mysqli = @new mysqli("localhost", "WebINGEOUser", "WebINGEOUser", "INGEO");

        if(!$mysqli -> connect_errno) {
            $query = "DELETE FROM articles WHERE idArticles = ".$_SESSION["current_article"];
            if($mysqli -> query($query)){
                $dir = "../res/".$_SESSION["id_user"]."/articles/".$_SESSION["current_article"];

                $files = glob($dir.'/*');
                foreach($files as $file){
                    if(is_file($file)) {
                        unlink($file);
                    }
                }

                rmdir($dir);
                $response = [
                    "success" => true
                ];
            }
        } else {
            $response = [
                "error" => "Error de conexion a DB"
            ];
        }
        
    } else {
        $response = [
            "error" => "Nada que borrar."
        ];
    }
    header("Conten-Type: application/json");
    echo json_encode($response);
?>