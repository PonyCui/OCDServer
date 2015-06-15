<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Storage_entity
{

    public $identifier = '';
    public $expired = 0;
    public $contents = '';

    public function __construct()
    {
        $this->expired = time() + 120;
    }
}
