<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Pub_manager extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this -> load -> model('Pub_entity');
    }

    public function messages()
    {
        $this -> db -> from('pub');
        $query = $this -> db -> get();
        $result = $query -> result('Pub_entity');
        $query -> free_result();
        return $result;
    }

    public function addNotify($user_id, $service, $method, $params = array())
    {
        $message = new Pub_entity;
        $message -> sub_user_id = $user_id;
        $message -> sub_service = $service;
        $message -> sub_method = $method;
        $message -> sub_params = json_encode($params);
        $this -> addMessage($message);
    }

    public function addMessage(Pub_entity $message)
    {
        $message -> pub_id = null;
        $this -> db -> insert('pub', $message);
    }

    public function deleteMessage(Pub_entity $message)
    {
        $this -> db -> from('pub');
        $this -> db -> where('pub_id', $message->pub_id);
        $this -> db -> delete();
    }
}
