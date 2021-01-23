<?php
    if(isset($_POST["usr_name"]) && !empty($_POST["usr_name"])){
        $mysqli = new mysqli("localhost", "WebINGEOLookup", "WebINGEOLookup", "INGEO");
        if(!mysqli_connect_errno()){
            $usr_name = $_POST["usr_name"];
            if ($stmt = $mysqli->prepare("SELECT usr_password_salt, is_admin FROM users WHERE usr_name=?")) {
                $stmt->bind_param("s", $usr_name);
                $stmt->execute();
                $stmt->bind_result($salt, $is_admin);
                $stmt->fetch();
                if(!empty($salt)){
                    $result = [
                        "salt" => $salt,
                        "is_admin" => $is_admin
                    ];
                    header('Content-Type: application/json');
                    echo json_encode($result);
                } else {
                    $result = [
                        "error" => "E1"
                    ];
                    header('Content-Type: application/json');
                    echo json_encode($result);
                }
                $stmt->close();
            }
            $mysqli->close();
        } else {
            $result = [
                "error" => "E2"
            ];
            header('Content-Type: application/json');
            echo json_encode($result);
        }
    } else {
        $result = [
            "error" => "E3"
        ];
        header('Content-Type: application/json');
        echo json_encode($result);
    }
?>