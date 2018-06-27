pragma solidity ^0.4.22;

import "./SafeMath.sol";

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * See https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
    
  function allowance(address owner, address spender)
    public view returns (uint256);

  function transferFrom(address from, address to, uint256 value)
    public returns (bool);

  function approve(address spender, uint256 value) public returns (bool);
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}

contract ProjectOblioCrowdsale {
    
    using SafeMath for uint256;
    
    uint256 public min_donation = 200;
    
    uint256 public karma_rate = 1;
    
    ERC20 public token; // The token being sold
    
    address public wallet; // Address where funds are collected
    
    uint256 public weiRaised; // Amount of wei raised
    
    uint256 public currentRound; //current round total
    
    uint startTime = now; //block-time when it was deployed
    
    uint256 public completedAt; //Time Crowdsale completed
    
    address[] public accountList;
    
    struct Account {
        // string name;
        // string email;
        // string str_address;
        // string str_number;
        // uint zipcode;
        // bool terms;
        bool isEntity;
        bytes data;
    }
    
    mapping(address => Account) AccountStruts;
    
    //Events
    event AccountCreated(address _beneficiary);
    event AccountCreatedBuy(address sender, bytes data);
    
    constructor() public {}
    
    
    // -----------------------------------------
    // Crowdsale external interface
    // -----------------------------------------
    
    /**
    * @dev fallback function ***DO NOT OVERRIDE***
    */
    function () external payable {
        // buyTokens(msg.sender);
        createAccount(msg.sender, msg.data);
    }
        
    function createAccount(address ownerAddress, bytes data) public payable {
        require( ! AccountStruts[ownerAddress].isEntity, "Address exist already");
        
        AccountStruts[ownerAddress].isEntity = true;
        AccountStruts[ownerAddress].data = data;
        
        accountList.push(ownerAddress);
        emit AccountCreated(ownerAddress);
    }    
    
    function getAccount(address _beneficiary) public constant returns (bool isEntity, bytes data){
        require(_beneficiary != address(0), "Beneficiary wallet address is invalid");
        Account memory userInfo = AccountStruts[_beneficiary];
        return (userInfo.isEntity, userInfo.data );
    }
    
    function GetAccountCount() public constant returns (uint) {
        return accountList.length;
    }
   
}