pragma solidity ^0.5.2;

contract Helper {
	function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e) internal pure returns (string memory) {
	    bytes memory _ba = bytes(_a);
	    bytes memory _bb = bytes(_b);
	    bytes memory _bc = bytes(_c);
	    bytes memory _bd = bytes(_d);
	    bytes memory _be = bytes(_e);
	    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
	    bytes memory babcde = bytes(abcde);
	    uint k = 0;
	    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
	    for (uint i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
	    for (uint i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
	    for (uint i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
	    for (uint i = 0; i < _be.length; i++) babcde[k++] = _be[i];
	    return string(babcde);
	}

	function strConcat(string memory _a, string memory _b, string memory _c, string memory _d) internal pure returns (string memory) {
	    return strConcat(_a, _b, _c, _d, "");
	}

	function strConcat(string memory _a, string memory _b, string memory _c) internal pure returns (string memory) {
	    return strConcat(_a, _b, _c, "", "");
	}

	function strConcat(string memory _a, string memory _b) internal pure returns (string memory) {
	    return strConcat(_a, _b, "", "", "");
	}

    function compareStrings(string memory _a, string memory _b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b));
    }
}