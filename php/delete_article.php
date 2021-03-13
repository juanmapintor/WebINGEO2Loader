<?php
    session_start();

    header("Content-Type: application/json");

    if(isset($_SESSION["logged_in"]) && isset($_POST["article"])){
        $old_current_article = $_SESSION["current_article"];
        $_SESSION["current_article"] = $_POST["article"];
        include_once("cancel_article.php");
        $_SESSION["current_article"] = $old_current_article;
    } else {
        echo json_encode([
            "error" => "No loggeado o informacion incompleta."
        ]);
    }
    
?>