<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 */
class Storage_manager extends CI_Model
{

    private $seperator = '-_-!!!';

    private $kvdb = null;

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Storage_entity');
        if (class_exists('SaeKV')) {
            $this->kvdb = new SaeKV();
            $this->kvdb -> init();
        }
    }

    public function addItem(Storage_entity $item)
    {
        if (!empty($this->kvdb)) {
            $this->kvdb->set(md5($item->identifier), $item->expired.$this->seperator.$item->contents);
        }
        else {
            file_put_contents('./storage/'.md5($item->identifier), $item->expired.$this->seperator.$item->contents);
        }
    }

    public function contentsWithIdentifier($identifier)
    {
        if (!empty($this->kvdb)) {
            $fileContents = $this->kvdb->get(md5($identifier));
        }
        else {
            $fileContents = file_get_contents('./storage/'.md5($identifier));
        }
        $tmp = explode($this->seperator ,$fileContents);
        if (isset($tmp[1])) {
            return $tmp[1];
        }
    }

    public function removeItems()
    {
        if (!empty($this->kvdb)) {
            $ret = $kv->pkrget('', 100);
            while (true) {
                $value = $ret[key($ret)];
                $timestamp = substr($value, 0, 10);
                if ((int)$timestamp < time()) {
                    $this->kvdb->delete(key($ret));
                }
                end($ret);
                $start_key = key($ret);
                $i = count($ret);
                if ($i < 100) break;
                $ret = $kv->pkrget('', 100, $start_key);
            }
        }
        else {
            $files = scandir('./storage');
            foreach ($files as $fileName) {
                if ($fileName == '.' || $fileName == '..' || $fileName == 'index.html') {
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
}
