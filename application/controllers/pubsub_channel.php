<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

define("PUBSUB_CHANNEL", true);

/**
 *
 */
class PubSub_Channel extends CI_Controller
{

    protected $services;

    public function __construct() {
        parent::__construct();
        $this->load->helpers('Pms_protocol');
        $this->load->model('Token_entity');
        $this->configureServices();
        $this->clients = new \SplObjectStorage;
    }

    public function configureServices()
    {
        $this->load->model('Sub_service');
        $this->load->model('Pub_service');
        $this->services = array(
            'sub' => $this->Sub_service,
            'pub' => $this->Pub_service
        );
        $this->Sub_service->super_services = $this->services;
        $this->Pub_service->super_services = $this->services;
    }

    public function connected()
    {
    }

    public function message()
    {
        $from = new PubSub_Channel_Connection($this->input->post('from'));
        $msg = $this->input->post('message');
        $service = pms_service($msg);
        $method = pms_method($msg);
        $params = pms_params($msg);
        if (isset($this->services[$service])) {
            if (method_exists($this->services[$service], $method)) {
                if (isset($from->token) &&
                    $from->token->canAccess($service)) {
                    //连接已认证
                    $this->services[$service] -> $method($from, $params);
                }
                else if ($service == 'sub') {
                    //连接未认证
                    $this->services[$service] -> $method($from, $params);
                }
            }
        }
    }

    public function disconnected()
    {
        $conn = new PubSub_Channel_Connection($this->input->post('from'));
        $this->services['sub']->removeObserver($conn);
        $conn -> detach();
    }

    public function intervalPush()
    {
        $this->Pub_service->intervalPush();
    }

}

/**
 *
 */
class PubSub_Channel_Connection
{

    public  $_connection_identifier = null;

    private $_connection_params = array();

    private $mmc = null;

    public function __construct($connection_identifier)
    {
        $this -> mmc = memcache_init();
        $this -> _connection_identifier = $connection_identifier;
        $this -> _restore();
    }

    public function send($message)
    {
        static $channel_instance = null;
        if (empty($channel_instance)) {
            $channel_instance = new SaeChannel();
        }
        $channel_instance -> sendMessage($this -> _connection_identifier, $message);
    }

    public function detach()
    {
        memcache_set($this -> mmc, "channel.connection.".$this->_connection_identifier,"",-1);
    }

    public function __get($property_name)
    {
        if ($property_name == 'alive') {
            return $this -> _alive();
        }
        return $this -> _connection_params[$property_name];
    }

    public function __set($property_name, $value)
    {
        if ($property_name == 'alive') {
            $this -> _setAlive($value);
            return;
        }
        $this -> _connection_params[$property_name] = $value;
        if($property_name == 'token') {
            $this -> _save();
        }
    }

    public function __isset($property_name)
    {
        return isset($this -> _connection_params[$property_name]);
    }

    private function _save()
    {
        memcache_set($this -> mmc, "channel.connection.".$this->_connection_identifier, serialize($this -> _connection_params));
    }

    public function _restore()
    {
        $restore_object =
        memcache_get($this -> mmc, "channel.connection.".$this->_connection_identifier);
        if (!empty($restore_object)) {
            $this -> _connection_params = unserialize($restore_object);
        }
    }

    private function _alive()
    {
        return memcache_get($this -> mmc, "channel.connection.alive.".$this->_connection_identifier);
    }

    private function _setAlive($timestamp)
    {
        memcache_set($this -> mmc, "channel.connection.alive.".$this->_connection_identifier, $timestamp);
    }
}
