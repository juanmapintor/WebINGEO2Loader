<?php
session_start();
if(isset($_POST["sector_id"]) && isset($_SESSION["logged_in"]) && isset($_SESSION["is_admin"])){
    $sector_id = $_POST["sector_id"];
    $mysqli = @new mysqli("localhost", "WebINGEOAdmin", "WebINGEOAdmin", "INGEO");

        if(!$mysqli->connect_errno){
            if($stmt = $mysqli -> prepare("DELETE FROM sectors WHERE idSectors=?")) {
                $stmt->bind_param("i", $sector_id);
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
                    "error" => "E3"
                ];
                header("Content-Type: application/json");
                echo json_encode($response);
            }
            $mysqli->close();
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