<?php
    session_start();
    $response = [
        "error" => "Vacio"
    ];

    if(isset($_SESSION["logged_in"])){
        $mysqli = @new mysqli("localhost", "WebINGEOUser", "WebINGEOUser", "INGEO");

        if(!$mysqli -> connect_errno){
            $userId = $_SESSION["id_user"];
            if ($mysqli->multi_query("SELECT title, short_description, publish_date, sector_category, sector_name, idArticles FROM articles INNER JOIN sectors ON articles.sectorId = sectors.idSectors WHERE userId = ".$userId)) {
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
        } else {
            $response = [
                "error" => "Fallo conexion DB"
            ];
        }

    } else {
        $response = [
            "error" => "No esta logueado."
        ];
    }

    header("Content-Type:  application/json");
    echo json_encode($response);
?>