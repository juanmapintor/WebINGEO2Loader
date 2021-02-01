<?php
session_start();
if(isset($_SESSION["logged_in"]) && isset($_SESSION["is_admin"])){
    $mysqli = @new mysqli("localhost", "WebINGEOAdmin", "WebINGEOAdmin", "INGEO");

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
                "error" => "E2"
            ];
            header("Content-Type: application/json");
            echo json_encode($response);
        }
    } else {
        $response = [
            "error" => "E1"
        ];
        header("Content-Type: application/json");
        echo json_encode($response);
    }
?>