<?php
    session_start();
    $idUsers = $_SESSION["id_user"];

    $mysqli = @new mysqli("localhost", "WebINGEOUser", "WebINGEOUser", "INGEO");

    $response = [
        "error" => "Vacio."
    ];

    if(!$mysqli->connect_errno){
        
        if ($mysqli->multi_query("SELECT sector_category, sector_name FROM sectors INNER JOIN users_sectors ON sectors.idSectors = users_sectors.sectorsId WHERE userId = ".$idUsers)) {
            $response = array();
            do {
                if ($result = $mysqli->store_result()) {
                    while ($row = $result->fetch_row()) {
                        array_push($response, $row);
                    }
                    $result->free();
                }
            } while ($mysqli->next_result());
        }
    
        $mysqli -> close();  
    } else {
        $response = [
            "error" => "DB connect error."
        ];
    }
    header("Content-Type: application/json");
    echo json_encode($response);
?>