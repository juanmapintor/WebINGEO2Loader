<?php
    session_start();
    $response =  [
        "error" => "Vacio"
    ];

    if(isset($_SESSION["logged_in"])){
        $idUser = $_SESSION["id_user"];
        $mysqli = @new mysqli("localhost", "WebINGEOLookup", "WebINGEOLookup", "INGEO");

        if($result = $mysqli -> query("SELECT usr_name, email, first_name, last_name, degree, profile_img, short_description, phone_number, web_link FROM users WHERE idUsers = ".$idUser)){
            $response = $result -> fetch_array(MYSQLI_ASSOC);
            $result -> close();

            if ($mysqli->multi_query("SELECT sector_category, sector_name FROM sectors INNER JOIN users_sectors ON sectors.idSectors = users_sectors.sectorsId WHERE userId = ".$idUser)) {
                $sectors = array();
                do {
                    if ($result = $mysqli->store_result()) {
                        while ($row = $result->fetch_row()) {
                            array_push($sectors, $row);
                        }
                        $result->free();
                    }
                } while ($mysqli->next_result());
                $response["sectors"] = $sectors;
            } else {
                $response =  [
                    "error" => "No se pudieron obtener los sectores."
                ];  
            }

        } else {
            $response =  [
                "error" => "No se pudo obtener la informacion del usuario."
            ];  
        }

        $mysqli -> close();
    } else {
        $response =  [
            "error" => "Sesion no iniciada."
        ];
    }

    header("Content-type: application/json");
    echo json_encode($response);

?>