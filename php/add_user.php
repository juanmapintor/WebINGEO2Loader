<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;
 
    require 'PHPMailer/src/Exception.php';
    require 'PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/src/SMTP.php';

    session_start();

    if(isset($_SESSION["logged_in"]) && isset($_SESSION["is_admin"])){
        if(isset($_POST["usr_name"]) && isset($_POST["usr_password"]) && isset($_POST["usr_password_unencripted"]) && isset($_POST["usr_password_salt"]) && isset($_POST["email"]) && isset($_POST["first_name"]) && isset($_POST["last_name"]) && isset($_POST["is_admin"])){
            $usr_name = $_POST["usr_name"];
            $usr_password = $_POST["usr_password"];
            $usr_password_unencripted = $_POST["usr_password_unencripted"];
            $usr_password_salt = $_POST["usr_password_salt"];
            $email = $_POST["email"];
            $first_name = $_POST["first_name"];
            $last_name = $_POST["last_name"];
            $is_admin = $_POST["is_admin"];

            $mysqli = @new mysqli("localhost", "WebINGEOAdmin", "WebINGEOAdmin", "INGEO");

            if(!$mysqli->connect_errno){
                if($stmt = $mysqli -> prepare("INSERT INTO users(usr_name, usr_password, usr_password_salt, email, first_name, last_name, is_admin, first_time) VALUES (?,?,?,?,?,?,?,1)")) {
                    $bind = $stmt->bind_param("ssssssi", $usr_name, $usr_password, $usr_password_salt, $email, $first_name, $last_name, $is_admin);
                    $exec = $stmt->execute();
                    if($exec){
                        $mail = new PHPMailer;
                        $mail->isSMTP();
                        $mail->Host = 'smtp.gmail.com';
                        $mail->Port = 587;
                        $mail->SMTPSecure = 'tls';
                        $mail->SMTPAuth = true;
                        $mail->Username = "juanmapintor@unsj-cuim.edu.ar";
                        $mail->Password = file_get_contents("mailRes/password.txt");
                        $mail->setFrom('juanmapintor@unsj-cuim.edu.ar', 'INGEO');
                        $mail->addReplyTo('juanmapintor@unsj-cuim.edu.ar', 'INGEO');
                        $mail->addAddress($email, 'Nuevo usuario.');
                        $mail->Subject = 'Nuevo usuario asignado en la pagina del INGEO.';
                    
                        $htmlContents = file_get_contents('mailRes/mailTemplate.html');
                        $replaceVariables = [
                            "usr_name" => $usr_name,
                            "usr_password" => $usr_password_unencripted
                        ];
                        foreach($replaceVariables as $key => $value){
                            $htmlContents = str_replace('{'.$key.'}', $value, $htmlContents);
                        }

                        $mail->msgHTML($htmlContents);
                        $mail->AltBody = 'Usted ha sido asignado un nuevo usuario en la pagina web del Instituto de Geología, 
                                        con las siguientes credenciales. 
                                        Usuario: '.$usr_name.
                                        ' Contraseña: '.$usr_password_unencripted.
                                        'SI USTED NO SOLICITO ESTA INFORMACION, IGNORE ESTE MENSAJE.';

                        if ($mail->send()) {
                            $response = [
                                "success" => true,
                                "affected_rows" => $stmt->affected_rows
                            ];

                            header("Content-Type: application/json");
                            echo json_encode($response);
                        } else {
                            //ERROR DE ENVIO DE MAIL
                            $response = [
                                "error" => "No se pudo comunicar con el mail del nuevo usuario. Reintentelo.",
                            ];

                            header("Content-Type: application/json");
                            echo json_encode($response);
                        }
                    } else {
                        $response = [
                            "error" => "No se pudo ejecutar sentencia. Reintente.",
                        ];
    
                        header("Content-Type: application/json");
                        echo json_encode($response);
                    }
                    $stmt->close();
                } else {
                    //ERROR DE SENTENCIA
                    $response = [
                        "error" => "Sentencia DB incorrecta.",
                    ];

                    header("Content-Type: application/json");
                    echo json_encode($response);
                }
                $mysqli->close();
            } else {
                //ERROR DE CONEXION A DB
                $response = [
                    "error" => "No se pudo conectar a la DB.",
                ];

                header("Content-Type: application/json");
                echo json_encode($response);
            }

        } else {
            //ERROR DE DATOS INCOMPLETOS
            $response = [
                "error" => "Datos provistos incompletos.",
            ];

            header("Content-Type: application/json");
            echo json_encode($response);
        }
    } else {
        //ERROR DE SESION NO INICIADA
        $response = [
            "error" => "Sesión no iniciada o caducada.",
        ];

        header("Content-Type: application/json");
        echo json_encode($response);
    }

    


?>