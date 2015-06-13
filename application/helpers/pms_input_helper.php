<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function pms_input($controller, $class_name, $method = 'get|post')
{
    $instance = new $class_name;
    $methods = explode('|', $method);
    $params = array();
    foreach ($methods as $method) {
        $methodParams = $controller->input->$method();
        if (!empty($methodParams)) {
            $params = array_merge($params, $controller->input->$method());
        }
    }
    foreach ($params as $key => $value) {
        if (property_exists($class_name, $key)) {
            $instance->$key = $value;
        }
    }
    return $instance;
}
