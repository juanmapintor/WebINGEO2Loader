<?php
    session_start();
    if(isset($_POST["sector_category"]) && isset($_POST["sector_name"]) && $_SESSION["logged_in"] && $_SESSION["is_admin"]) {
        $sector_category = $_POST["sector_category"];
        $sector_name = $_POST["sector_name"];

        $mysqli = @new mysqli("localhost", "WebINGEOAdmin", "WebINGEOAdmin", "INGEO");

        if(!$mysqli->connect_errno){
            if($stmt = $mysqli -> prepare("INSERT INTO sectors(sector_category, sector_name) VALUES (?,?)")) {
                $stmt->bind_param("ss", $sector_category, $sector_name);
                $stmt->execute();

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
                "error" => "Error conexión DB."
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