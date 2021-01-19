<?php

function read_json($filepath): array
{
    if (file_exists($filepath)) return json_decode(file_get_contents($filepath), true);
    else return array();
}

function read_config(): array
{
    $CONFIGS_FILE = $_SERVER['DOCUMENT_ROOT'] . '/php/config.json';
    return read_json($CONFIGS_FILE);
}

function get_answer_for_client($error_code, $message, $db_message, $data): bool|string
{
    $message = $error_code < 300 ? $message : CodesAndMessages::CODE_TO_MESSAGE[$error_code];
    $message = (isset($db_message[0]) && $db_message[0]) ?  '('.$db_message[1].') ' .$message : $message;
    $answer = $error_code > 0 ?
        array(
            "error" => array(
                "code" => $error_code,
                "message" => $message,
                "dbMessage" => $db_message))
        : array(
            "message" => $message,
            "data" => $data,
            "code" => 200);

    return json_encode($answer, JSON_UNESCAPED_UNICODE);
}
function get_http_data(){
    return json_decode(file_get_contents("php://input"), true);
}