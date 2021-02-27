<?php
    session_start();
    $response = [
        "error" => "Sin inicializar."
    ];
    if(isset($_SESSION["logged_in"]) && isset($_POST["title"]) && isset($_POST["short_description"]) && isset($_POST["image_content"])
     && isset($_POST["keywords"]) && isset($_POST["in_carousel"]) && isset($_POST["in_news"]) && isset($_POST["in_highlight"]) && isset($_POST["sectorId"])){
        
        $idUser = $_SESSION["id_user"];
        $title = $_POST["title"];
        $shortDesc = $_POST["short_description"];
        $keywords = $_POST["keywords"];
        $inCarousel = $_POST["in_carousel"];
        $inNews = $_POST["in_news"];
        $inHighlight = $_POST["in_highlight"];
        $sectorId = $_POST["sectorId"];

        $mysqli = @new mysqli("localhost", "WebINGEOUser", "WebINGEOUser", "INGEO");

        if(!$mysqli -> connect_errno) {
            if($stmt = $mysqli -> prepare("INSERT INTO articles(title, short_description, in_carousel, in_news, in_highlight, keywords, userId, sectorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")){
                if($stmt->bind_param("ssiiisii", $title, $shortDesc, $inCarousel, $inNews, $inHighlight, $keywords, $idUser, $sectorId)){
                    if($stmt->execute()){
                        $articleId = $mysqli -> insert_id;

                        $stmt -> close();

                        $dir = "../res/".$idUser."/articles/".$articleId;
        
                        if(!is_dir($dir)){
                            mkdir($dir, 0777, true);
                        }

                        $file = "/article_img".(new DateTime())->getTimestamp().".png";
                        $img_path = "http://localhost/WebINGEO2Loader/res/".$idUser."/articles/".$articleId.$file;
                        file_put_contents($dir.$file, base64_decode(explode(',',$_POST["image_content"])[1]));

                        if($updstmt = $mysqli -> prepare("UPDATE articles SET img_path = ? WHERE idArticles = ?")){
                            if($updstmt -> bind_param("si", $img_path, $articleId)){
                                if($updstmt -> execute()){
                                    $_SESSION["current_article"] = $articleId;
                                    $response = [
                                        "success" => true
                                    ];
                                } else {
                                    $response = [
                                        "error" => "Exec bind param"
                                    ];
                                }
                            } else {
                                $response = [
                                    "error" => "Update bind param"
                                ];
                            }
                            
                        } else {
                            $response = [
                                "error" => "No se pudo ejecutar la sentencia de actualizacion img_path.",
                                
                            ]; 
                        }
                    } else {
                        $response = [
                            "error" => "MySQL Statement no ejecutada."
                        ];  
                    }
                } else {
                    $response = [
                        "error" => "Parametros no seguros."
                    ]; 
                }
            } else {
                $response = [
                    "error" => "Error de MySQL Statement"
                ];
            }
            
            $mysqli -> close();
        } else {
            $response = [
                "error" => "Error de conexion a DB"
            ];
        }
    } else { 
        $response = [
            "error" => "Faltan campos."
        ];
    }
    header("Conten-Type: application/json");
    echo json_encode($response);
?>