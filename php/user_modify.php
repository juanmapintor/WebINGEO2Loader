<?php
    session_start();
    function modifyInDB($mysqli, $key, $value){
        $exec = false;
        $idUser = $_SESSION["id_user"];
        if($key != "sectors" && $key != "profile_img"){
            if($fnstmt = $mysqli -> prepare("UPDATE users SET ".$key." = ? WHERE idUsers = ".$idUser)){

                $fnstmt -> bind_param("s", $value);
                $exec = $fnstmt -> execute();
                $fnstmt -> close();

            } 
        }
        if($key == "sectors") {
            if($delResult = $mysqli -> query("DELETE FROM users_sectors WHERE userId = ".$idUser)){
                $sectors = explode(",", $value);
                $exec = true;
                foreach($sectors as $idSector){
                    if($addResult = $mysqli -> query("INSERT INTO users_sectors(userId, sectorsId) VALUES (".$idUser.",".$idSector.")")){
                        $exec = $exec && true;
                    } else {
                        $exec = false;
                    }
                }
            }
        }
        if($key == "profile_img"){
            $dir = "../res/".$idUser;
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
            file_put_contents($dir.$file, base64_decode(explode(',',$_POST["profile_img"])[1]));
            $profile_img = "http://localhost/WebINGEO2Loader/res/".$idUser.$file;
            if($fnstmt = $mysqli -> prepare("UPDATE users SET ".$key." = ? WHERE idUsers = ".$idUser)){

                $fnstmt -> bind_param("s", $profile_img);
                $exec = $fnstmt -> execute();
                $fnstmt -> close();

            } 
        }
        return $exec;
    }
    $response = [
        "error" => "Vacio"
    ];
    if(isset($_SESSION["logged_in"])) {

        $mysqli = @new mysqli("localhost", "WebINGEOUser", "WebINGEOUser", "INGEO");

        if(!$mysqli -> connect_errno) {
    
            foreach($_POST as $key => $value){
                if(!modifyInDB($mysqli, $key, $value)) {
                    $response = [
                        "error" => $key
                    ];
                    break;
                }
                $response = [
                    "success" => true
                ];            
            }
            
        } else {
            $response = [
                "error" => "Error de conexion a DB"
            ];
        }
    } else {
        $response = [
            "error" => "No ha iniciado sesion."
        ];
    }
    header("Content-Type: application/json");
    echo json_encode($response);
?>