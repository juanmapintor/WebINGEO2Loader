<?php
session_start();
if(isset($_SESSION["logged_in"])){
    $mysqli = @new mysqli("localhost", "WebINGEOLookup", "WebINGEOLookup", "INGEO");

    if(!$mysqli->connect_errno){
        if ($mysqli->multi_query("SELECT * FROM sectors")) {
            $response = array();
            do {
                if ($result = $mysqli->store_result()) {
                    while ($row = $result->fetch_row()) {
                        array_push($response, $row);
                    }
                    $result->free();
                }
            } while ($mysqli->next_result());
            header("Content-Type: application/json");
            echo json_encode($response);
        }        
        } else {
            $response = [
                "error" => "Querry falló."
            ];
            header("Content-Type: application/json");
            echo json_encode($response);
        }
    } else {
        $response = [
            "error" => "Fallo de autenticación."
        ];
        header("Content-Type: application/json");
        echo json_encode($response);
    }
?>