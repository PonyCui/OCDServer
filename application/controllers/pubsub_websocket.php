<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

/**
 * PMS PubSub Service - WebSocket
 */
class PubSub_WebSocket extends CI_Controller implements MessageComponentInterface
{

    protected $clients;

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

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
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

    public function onClose(ConnectionInterface $conn) {
        $this->services['sub']->removeObserver($conn);
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $conn->close();
    }
}
