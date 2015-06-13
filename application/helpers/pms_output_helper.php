<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function pms_output($object, $error_code = 0, $error_description = '')
{
    @header("Content-type:application/json");
    $outputObject = array(
        'error_code' => $error_code,
        'error_description' => $error_description,
        'data' => $object
    );
    echo json_encode($outputObject), "\n";
}
