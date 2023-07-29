// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Notarize is Ownable, AccessControlEnumerable{
    using Counters for Counters.Counter;

    //Create a new role identifier for the hasher writer role
    bytes32 public constant HASH_WRITER = keccak256("HASH_WRITER");

    Counters.Counter private _docCounter;
    mapping(uint256 => Doc) private _documents;
    mapping(bytes32 => bool) private _regHashes;

    event DocHashAdded(uint256 indexed docCounter, string docUrl, bytes32 docHash);

    struct Doc {
        string docUrl;
        bytes32 docHash;
    }

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setHashWriterRole(address _hashWriter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(HASH_WRITER, _hashWriter);
    }

    /**
     * @dev set a new document structure to store in the list, queueing it if others exist and incrementing docuement counter
     * @param _url doc URL
     * @param _hash bytes32 Hash
     */
    function addNewDocument(string memory _url, bytes32 _hash) external onlyRole(HASH_WRITER) {
        require(!_regHashes[_hash], "Hash already registered");
        uint256 counter = _docCounter.current();
        _documents[counter] = Doc({docUrl: _url, docHash:_hash});
        _regHashes[_hash] = true;
        _docCounter.increment();
        emit DocHashAdded(counter, _url, _hash);
    }

    /**
     * @dev get a hash in the _num place
     * @param _num uint256 Place of the hash to return
     * @return streing documentUrl, bytes32 hash, uint256 datetime
     */
    function getDocInfo(uint256 _num) external view returns (string memory, bytes32) {
        require(_num < _docCounter.current(), "Document does not exist");
        Doc memory doc = _documents[_num];
        return (doc.docUrl, doc.docHash);
    }

    /**
     * @dev get the hash list length
     */
    function getDocsCount() external view returns (uint256) {
        return _docCounter.current();
    }

    function getRegisteredHash(bytes32 _hash) external view returns (bool) {
        return _regHashes[_hash];
    }
}
