<?php

    echo (int)$_SERVER['CONTENT_LENGTH'];

    /*
    session_start();
    $response = [
        "error" => "vacio"
    ];
    if(isset($_SESSION["logged_in"])){
        if(isset($_POST["title"]) && isset($_POST["short_description"]) && isset($_POST["image_content"]) && isset($_POST["keywords"]) && isset($_POST["html_content"]) && isset($_POST["in_carousel"]) && isset($_POST["in_news"]) && isset($_POST["in_highlight"]) && isset($_POST["sectorId"])){
            $idUser = $_SESSION["id_user"];
            $title = $_POST["title"];
            $short_description = $_POST["short_description"];
            $image_content = $_POST["image_content"];
            $keyword = $_POST["keywords"];
            $html_content = $_POST["html_content"];
            $in_carousel = $_POST["in_carousel"];
            $in_news = $_POST["in_news"];
            $in_highlight = $_POST["in_highlight"];
            $sectorId = $_POST["sectorId"];

            $response = [
                "These earings? " => "OK"
            ];
        } else {
            $response = [
                "error" => "Datos provistos incompletos."
            ];
        }
    } else {
        $response = [
            "error" => "Sesion no iniciada"
        ];
    }
    header("Content-Type:  application/json");
    echo json_encode($response);
    */
?>