<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/objects/CodesAndMessages.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/objects/DBManager.php';

$db = new DBManager();

$error_code = 0;
$message = '';
$data = array();
$user_data = get_http_data();
if (isset($user_data['description']) && isset($user_data['date']) && isset($user_data['spaceshipId'])) {
    if ($db->connect()) {
        $data = $db->add_breakdown($user_data['spaceshipId'], $user_data['date'] / 1000, $user_data['description']);
        if (is_null($data))
            $error_code = CodesAndMessages::DB_ERROR;
    } else {
        $error_code = CodesAndMessages::DB_NOT_AVAILABLE;
    }
} else {
    $error_code = CodesAndMessages::WRONG_REQUEST_PARAMS;
}
echo get_answer_for_client($error_code, $message, $db->error_msg, $data);