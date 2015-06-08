<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function pms_verify_token(CI_Controller $controller, &$tokenRef = null)
{
    $controller->load->model('Token_manager');
    $token = new Token_entity;
    $token->user_id = $controller->input->get_request_header('user_id', true);
    $token->session_token = $controller->input->get_request_header('session_token', true);
    // $token->user_id = 1;
    // $token->session_token = 'testToken';
    $tokenRef = $token;
    return $controller->Token_manager->verify_entry($token);
}
