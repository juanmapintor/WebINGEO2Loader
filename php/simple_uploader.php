<?php
    session_start();
    $response = [
        "error" => [
            "message" => "Vacio."
        ]
    ];

    if(isset($_SESSION["logged_in"]) && isset($_SESSION["current_article"])) {
        $idUser = $_SESSION["id_user"];
        $articleId = $_SESSION["current_article"];
        if(isset($_FILES['upload']['name'])) {
            $file = $_FILES['upload']['tmp_name'];
            $file_name = $_FILES['upload']['name'];
            $file_name_array = explode(".", $file_name);
            $extension = end($file_name_array);
            $new_image_name = rand() . '.' . $extension;
            chmod("../res/".$idUser."/articles/".$articleId, 0777);
            $allowed_extension = array("jpg", "jpeg", "gif", "png");
            if(in_array($extension, $allowed_extension)) {
                move_uploaded_file($file, "../res/".$idUser."/articles/".$articleId."/".$new_image_name);
                $url = "http://localhost/WebINGEO2Loader/res/".$idUser."/articles/".$articleId."/".$new_image_name;
                $response = [
                    "url" => $url
                ];
            } else {
                $response = [
                    "error" => [
                        "message" => "in_array fail"
                    ]
                ];
            }
        } else {
            $response = [
                "error" => [
                    "message" => "No hay archivo para subir."
                ]
            ];  
        }
    } else {
        $response = [
            "error" => [
                "message" => "Sesion no iniciada."
            ]
        ];
    }

    header("Content-Type: application/json");
    echo json_encode($response);
?>