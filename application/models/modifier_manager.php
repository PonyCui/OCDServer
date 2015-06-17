<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Modifier_manager extends CI_Model
{

    function __construct()
    {
        parent::__construct();
        $this->load->model('Modifier_entity');
        $this->load->database();
    }

    public function addItem($user_id, $modifier_params)
    {
        $item = new Modifier_entity;
        $item->user_id = $user_id;
        $item->modifier_params = json_encode($modifier_params);
        $this->db->insert('modifier', $item);
        return $this->db->insert_id();
    }

    public function allItems($user_id)
    {
        $this->db->where('user_id', $user_id);
        $this->db->where('is_valid', 1);
        $query = $this->db->get('modifier');
        $result = $query -> result('Modifier_entity');
        return $result;
    }

    public function deleteItem($user_id, $modifier_id)
    {
        $this->db->where('user_id', $user_id);
        $this->db->where('modifier_id', $modifier_id);
        return $this->db->delete();
    }

    public function validItem($user_id, $modifier_id)
    {
        $this->db->where('user_id', $user_id);
        $this->db->where('modifier_id', $modifier_id);
        return $this->db->update('modifier', array('is_valid'=>'1'));
    }

    public function invalidItem($user_id, $modifier_id)
    {
        $this->db->where('user_id', $user_id);
        $this->db->where('modifier_id', $modifier_id);
        return $this->db->update('modifier', array('is_valid'=>'0'));
    }
}
