<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pub_service extends CI_Model
{

    public $super_services = array();

    public function __construct()
    {
        parent::__construct();
        $this -> load -> model('Pub_manager', '', true);
        $this -> _configureTimer();
    }

    private function _configureTimer()
    {
        if (defined("PUBSUB_CHANNEL")) {
            return;//Not Supported
        }
        global $runloop;
        $runloop -> addPeriodicTimer(0.5, function() {
            $this -> _intervalPush();
        });
    }

    private function _intervalPush()
    {
        $messages = $this -> Pub_manager -> messages();
        foreach ($messages as $message) {
            $this -> post($message);
        }
    }

    public function intervalPush()
    {
        for ($i=0; $i<60; $i++) {
            $this -> _intervalPush();
            sleep(1);
        }
    }

    public function post(Pub_entity $message)
    {
        $conns = $this->super_services['sub']->observers($message->sub_user_id);
        foreach ($conns as $conn) {
            $msg = pms_message($message->sub_service, $message->sub_method, json_decode($message->sub_params, true));
            $conn -> send($msg);
        }
        $this -> Pub_manager -> deleteMessage($message);
    }

    public function submit($conn, $params)
    {print_r($params);
        $entity = new Pub_entity;
        $entity -> sub_user_id = $conn->token->user_id;
        $entity -> sub_service = $params['service'];
        $entity -> sub_method = $params['method'];
        $entity -> sub_params = json_encode($params['params']);
        $this -> Pub_manager -> addMessage($entity);
    }
}
