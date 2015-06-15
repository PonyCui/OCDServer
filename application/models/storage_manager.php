<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Storage_manager extends CI_Model
{

    private $seperator = '-_-!!!';

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Storage_entity');
    }

    public function addItem(Storage_entity $item)
    {
        file_put_contents('./storage/'.md5($item->identifier), $item->expired.$this->seperator.$item->contents);
    }

    public function contentsWithIdentifier($identifier)
    {
        $fileContents = file_get_contents('./storage/'.md5($identifier));
        $tmp = explode($this->seperator ,$fileContents);
        if (isset($tmp[1])) {
            return $tmp[1];
        }
    }

    public function removeItems()
    {
        $files = scandir('./storage');
        foreach ($files as $fileName) {
            if ($fileName == '.' || $fileName == '..') {
                continue;
            }
            $fileContents = file_get_contents('./storage/'.$fileName);
            $timestamp = substr($fileContents, 0, 10);
            if ((int)$timestamp < time()) {
                @unlink('./storage/'.$fileName);
            }
        }
    }
}
