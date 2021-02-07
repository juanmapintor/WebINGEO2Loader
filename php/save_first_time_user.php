<?php
    session_start();
    $response = array();
    if(isset($_SESSION["logged_in"])) {
        if(isset($_POST["first_name"]) && isset($_POST["last_name"]) && 
        isset($_POST["usr_name"]) && isset($_POST["usr_password"]) && isset($_POST["usr_password_salt"])){

            $idUsers = $_SESSION["id_user"];
            $usr_name = $_POST["usr_name"];
            $usr_password = $_POST["usr_password"];
            $usr_password_salt = $_POST["usr_password_salt"];
            $first_name = $_POST["first_name"];
            $last_name = $_POST["last_name"];
            $degree = isset($_POST["degree"]) ? $_POST["degree"] : null;
            //CUIDADO, CAMBIAR URL
            $profile_img = "http://localhost/WebINGEO2Loader/res/default_user.png";
            if(isset($_POST["profile_img"]) && $_POST["profile_img"] != ''){
                $dir = "../res/".$idUsers;
                if(!is_dir($dir)){
                    mkdir($dir, 0777, true);
                }
                //Borrar las fotos de perfil anteriores
                $files = glob($dir.'/*');
                foreach($files as $file){
                    if(is_file($file)) {
                        unlink($file);
                    }
                }
                //Agrega la nueva foto de perfil
                $file = "/profile_img".(new DateTime())->getTimestamp().".png";
                $profile_img = "http://localhost/WebINGEO2Loader/res/".$idUsers.$file;
                file_put_contents($dir.$file, base64_decode(explode(',',$_POST["profile_img"])[1]));
            }
            $short_description = isset($_POST["short_description"]) ? $_POST["short_description"] : null;
            $phone_number = isset($_POST["phone_number"]) ? $_POST["phone_number"] : null;
            $web_link = isset($_POST["web_link"]) ? $_POST["web_link"] : null;
            $sectors = isset($_POST["sectors"]) ? explode(",",$_POST["sectors"]) : null;


            $mysqli = @new mysqli("localhost", "WebINGEOUser", "WebINGEOUser", "INGEO");

            if(!$mysqli->connect_errno) {
                if($stmt = $mysqli -> prepare("UPDATE users SET usr_name = ?, usr_password = ?, usr_password_salt = ?, first_name = ?, last_name = ?, degree = ?, profile_img = ?, short_description = ?, phone_number = ?, web_link = ?, first_time = 0 WHERE (idUsers = ?)")) {
                    if($stmt->bind_param("ssssssssssi", $usr_name, $usr_password, $usr_password_salt, $first_name, $last_name, $degree, $profile_img, $short_description, $phone_number, $web_link, $idUsers)){
                        if($stmt->execute()) {
                            if($delstmt = $mysqli -> prepare("DELETE FROM users_sectors WHERE userId = ?")){
                                if($delstmt->bind_param("i", $idUsers)){
                                    if(!$delstmt->execute()) {
                                        $response = [
                                            "error" => "No se pudo exec."
                                        ];
                                    }
                                } else {
                                    $response = [
                                        "error" => "No se pudo bind."
                                    ]; 
                                }
                            } else {
                                $response = [
                                    "error" => "No se pudo eliminar los sectores."
                                ];
                            }
                            $error = false;
                            if($sectors[0]){
                                foreach($sectors as $idSectors) {
                                    if($stmt2 = $mysqli -> prepare("INSERT INTO users_sectors(userId, sectorsId) VALUES (?,?)")){
                                        if($stmt2->bind_param("ii", $idUsers, $idSectors)){
                                            if(!$stmt2->execute()) $error = true;
                                        } else {
                                            $error = true;
                                        }
                                    } else {
                                        $error = true;
                                    }
                                }
                            }
                            if(!$error) {
                                $response = [
                                    "success" => true,
                                ];
                            } else {
                                $response = [
                                    "error" => "No se pudo insertar todos los sectores.",
                                    "sectors" => $sectors[0] ? true : false
                                ];
                            }
                        } else {
                            $response = [
                                "error" => "No se pudo actualizar la información de su usuario."
                            ];
                        }
                    } else {
                        $response = [
                            "error" => "No se pudo bind."
                        ];
                    }
                } else {
                    $response = [
                        "error" => "Statement incorrecto."
                    ];
                }
            } else {
                $response = [
                    "error" => "Conexion de DB incorrecta."
                ];
            }
        } else {
            $response = [
                "error" => "Parametros insuficientes."
            ];
        }
    } else {
        $response = [
            "error" => "Sesion no iniciada."
        ];
    }
    header("Content-Type: application/json");
    echo json_encode($response);
?>