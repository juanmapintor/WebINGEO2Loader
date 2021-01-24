<?php
    session_start();

    $result = [];
    
    if(isset($_SESSION["logged_in"])){
        $result = [
            "success" => true,
            "is_admin" => $_SESSION["is_admin"]
        ];
    } else {
        $result = [
            "success" => false
        ];
    }
    
    header("Content-Type:  application/json");
    echo json_encode($result);
?>