<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Storage extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Storage_entity');
        $this->load->model('Storage_manager');
    }

    public function add()
    {
        $item = new Storage_entity;
        $item->identifier = $this->input->get('identifier');
        $item->contents = file_get_contents('php://input');
        $this->Storage_manager->addItem($item);
    }

    public function fetch()
    {
        die($this->Storage_manager->contentsWithIdentifier($this->input->get('identifier')));
    }

    public function clean()
    {
        $this->Storage_manager->removeItems();
    }
}
