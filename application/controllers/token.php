<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Token extends CI_Controller {

    public function register_app_id()
    {
        $this->load->model('Token_manager', '', true);
        echo json_encode($this->Token_manager->register_token());
    }
}
