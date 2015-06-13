<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
 * Factory Class
 */
class PubSub extends CI_Controller
{
    static public function instance($way = 'WebSocket')
    {
        $class_name = 'PubSub_'.$way;
        require APPPATH.'/controllers/'.strtolower($class_name).'.php';
        return new $class_name;
    }

    public function index()
    {die('1');
        if (defined("SAE_TMP_PATH")) {
            //Channel
            $client_id = md5(uniqid(mt_rand(0, 9999999999)));
            $channel_instance = new SaeChannel();
        	$token = $channel_instance->createChannel($client_id);
            echo $token;
        }
        else {
            //WebSocket
            echo 'ws://'.$_SERVER['HTTP_HOST'].':9090/pubsub';
        }
    }
}
