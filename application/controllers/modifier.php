<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Modifier extends CI_Controller
{

    private $tokenItem = null;

    function __construct()
    {
        parent::__construct();
        $this->load->model('Token_manager');
        $this->load->model('Modifier_manager');
        $tokenItem = new Token_entity;
        $tokenItem->user_id = $this->input->get('appid');
        $tokenItem->session_token = $this->input->get('apptoken');
        if ($this->Token_manager->verify_entry($tokenItem)) {
            $this->tokenItem = $tokenItem;
        }
        else {
            die('invalid appid or apptoken.');
        }
    }

    public function fetch()
    {
        $allItems = $this->Modifier_manager->allItems($this->tokenItem->user_id);
        echo json_encode($allItems);
    }

    public function add()
    {
        $params = $this->input->post('params');
        $this->Modifier_manager->addItem($this->tokenItem->appid, $params);
    }

    public function delete()
    {
        $this->Modifier_manager->deleteItem($this->tokenItem->appid, $this->input->get('id'));
    }

    public function valid()
    {
        $this->Modifier_manager->validItem($this->tokenItem->appid, $this->input->get('id'));
    }

    public function invalid()
    {
        $this->Modifier_manager->invalidItem($this->tokenItem->appid, $this->input->get('id'));
    }
}
