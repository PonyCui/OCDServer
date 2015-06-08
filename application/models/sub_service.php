<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Sub_service extends CI_Model
{

    public $super_services = array();

    public function __construct()
    {
        parent::__construct();
        $this -> load -> model('Sub_manager');
    }

    public function observers($user_id)
    {
        return $this->Sub_manager->observers($user_id);
    }

    public function addObserver($conn, $params)
    {
        $conn -> alive = time();
        $tokenObject = new Token_entity;
        $tokenObject -> user_id = isset($params['user_id']) ? $params['user_id'] : '';
        $tokenObject -> session_token = isset($params['session_token']) ? $params['session_token'] : '';
        $result = $this->Sub_manager->addObserver($conn, $tokenObject);
        if ($result) {
            $this -> didAddObserver($conn);
            if (!empty($this->Sub_manager->last_error['error_code'])) {
                $this -> didReceivedError($this->Sub_manager->last_error['error_conn'],
                                          $this->Sub_manager->last_error['error_code'],
                                          $this->Sub_manager->last_error['error_description']);
            }
        }
        else {
            $this -> didReceivedError($conn,
                                      $this->Sub_manager->last_error['error_code'],
                                      $this->Sub_manager->last_error['error_description']);
        }
    }

    public function removeObserver($conn)
    {
        $result = $this->Sub_manager->removeObserver($conn);
        if ($result) {
            $this -> didRemoveObserver($conn);
        }
        else {
            $this -> didReceivedError($conn, 500, 'Unknowed Error');
        }
    }

    public function heartBeat($conn)
    {
        $conn -> alive = time();
        $this -> didReceivedHeartBeat($conn);
    }

    public function didAddObserver($conn)
    {
        $msg = pms_message("sub", "didAddObserver");
        $conn->send($msg);
    }

    public function didRemoveObserver($conn)
    {
        $msg = pms_message("sub", "didRemoveObserver");
        $conn->send($msg);
    }

    public function didReceivedHeartBeat($conn)
    {
        $msg = pms_message("sub", "didReceivedHeartBeat");
        $conn->send($msg);
    }

    public function didReceivedError($conn, $error_code, $error_description)
    {
        $msg = pms_message("sub", "didReceivedError", array("error_code"=>$error_code, "error_description"=>$error_description));
        $conn->send($msg);
    }
}
