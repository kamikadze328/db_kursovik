<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/objects/CodesAndMessages.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/objects/DBManager.php';

$db = new DBManager();

$error_code = 0;
$message = '';
$data = array();
$user_data = get_http_data();
if (isset($user_data['purpose'])) {
    if ($db->connect()) {
        if ($user_data['purpose'] === 'breakdowns')
            $data = $db->get_breakdowns();
        else if ($user_data['purpose'] === 'spaceships')
            $data = $db->get_spaceships();
        else if ($user_data['purpose'] === 'devices_detectors')
            $data = $db->get_devices_and_detectors();
        else if ($user_data['purpose'] === 'planets')
            $data = $db->get_planets();
        else {
            $error_code = CodesAndMessages::WRONG_REQUEST_PARAMS;
        }
        if (is_null($data))
            $error_code = CodesAndMessages::DB_ERROR;
    } else {
        $error_code = CodesAndMessages::DB_NOT_AVAILABLE;
    }
} else {
    $error_code = CodesAndMessages::WRONG_REQUEST_PARAMS;
}
echo get_answer_for_client($error_code, $message, $db->error_msg, $data);