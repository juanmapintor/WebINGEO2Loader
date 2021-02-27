<?php
    session_start();
    $response = [
        "error" => "Sin inicializar."
    ];
    if(isset($_SESSION["logged_in"]) && isset($_SESSION["current_article"]) && isset($_POST["html_content"])){
        $idArticles = $_SESSION["current_article"];
        $_SESSION["current_article"] = null;
        $html_content = $_POST["html_content"];

        $mysqli = @new mysqli("localhost", "WebINGEOUser", "WebINGEOUser", "INGEO");
        

        if(!$mysqli -> connect_errno) {
            if($stmt = $mysqli ->prepare("UPDATE articles SET html_content = ?, finished = 1 WHERE idArticles = ?")){
                if($stmt->bind_param("si", $html_content, $idArticles)){
                    if($stmt->execute()){
                        $response = [
                            "success" => true
                        ];
                        $stmt->close();
                    } else {
                        $response = [
                            "error" => "Exec bind param"
                        ];
                    }
                } else {
                    $response = [
                        "error" => "Update bind param"
                    ];
                }
            } else {
                $response = [
                    "error" => "No se pudo ejecutar la sentencia de actualizacion img_path.",
                ]; 
            }
        } else {
            $response = [
                "error" => "Error de conexion a DB"
            ];
        }
        
    } else {
        $response = [
            "error" => "Nada que terminar."
        ];
    }
    header("Conten-Type: application/json");
    echo json_encode($response);
?>