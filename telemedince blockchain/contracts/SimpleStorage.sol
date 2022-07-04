// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
    uint256 storedData;

    // struct file {
    //     string hash;
    // }

    string hash;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    // mapping(address => file[]) files;

    // function addfile(string memory _hash) public returns (address) {
    //     files[msg.sender].push(file({hash: _hash}));
    // }

    function addfile(string memory _hash) public {
        hash = _hash;
    }

    // function getfile(address addr, uint256 _index)
    //     public
    //     view
    //     returns (string memory)
    // {
    //     file memory file_instance = files[addr][_index];
    //     return (file_instance.hash);
    // }

    function getfile() public view returns (string memory) {
        return hash;
    }

    // function getLength() public view returns (uint256) {
    //     return files[msg.sender].length;
    // }
}
