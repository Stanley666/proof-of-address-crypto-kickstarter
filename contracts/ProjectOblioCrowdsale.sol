pragma solidity ^0.4.22;

import "./SafeMath.sol";
import "./SafeERC20.sol";

contract Crowdsale {
  using SafeMath for uint256;
  using SafeERC20 for ERC20;

  // The token being sold
  ERC20 public token;

  // Address where funds are collected
  address public wallet;

  uint256 public rate;

  // Amount of wei raised
  uint256 public weiRaised;

  event TokenPurchase(
    address indexed purchaser,
    address indexed beneficiary,
    uint256 value,
    uint256 amount
  );

  constructor(uint256 _rate, address _wallet, ERC20 _token) public {
    require(_rate > 0);
    require(_wallet != address(0));
    require(_token != address(0));

    rate = _rate;
    wallet = _wallet;
    token = _token;
  }

  // -----------------------------------------
  // Crowdsale external interface
  // -----------------------------------------

  function _preValidatePurchase( address _beneficiary, uint256 _weiAmount ) internal {
    require(_beneficiary != address(0));
    require(_weiAmount != 0);
  }

  function _postValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    // optional override
  }

  function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal {
    token.safeTransfer(_beneficiary, _tokenAmount);
  }

  function _processPurchase(address _beneficiary, uint256 _tokenAmount ) internal {
    _deliverTokens(_beneficiary, _tokenAmount);
  }

  function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
    return _weiAmount.mul(rate);
  }

  function _forwardFunds() internal {
    wallet.transfer(msg.value);
  }

}

contract ProjectOblioCrowdsale is Crowdsale {

    using SafeMath for uint256;

    uint256 public openingTime;
    uint256 public closingTime;    
    
    uint256 public MIN_DONATION = 100000000000000000;
    uint256 public KARMA_RATE = 1;
    
    uint256 public completedAt; //Time Crowdsale completed
    address[] public accountList;
    
    struct Account {
        uint256 karma_rate;
        bool isEntity;
        bytes data;
    }
    
    mapping(address => Account) AccountStruts;
    
    //Events
    event AccountCreated(address _beneficiary, bytes _data, uint256 karma_rate);
    
    constructor(uint256 _rate, address _wallet, ERC20 _token, uint256 _openingTime, uint256 _closingTime) public 
        Crowdsale(_rate, _wallet, _token) {

        require(_openingTime >= block.timestamp);
        require(_closingTime >= _openingTime);

        openingTime = _openingTime;
        closingTime = _closingTime;
    }

    // -----------------------------------------
    // TimeCrowdsale external interface
    // -----------------------------------------

    /**
    * @dev Reverts if not in crowdsale time range.
    */
    modifier onlyWhileOpen {
        require(block.timestamp >= openingTime && block.timestamp <= closingTime);
        _;
    }

    function hasClosed() public view returns (bool) {
        return block.timestamp > closingTime;
    }

    // -----------------------------------------
    // Project Oblio external interface
    // -----------------------------------------
    
    /**
    * @dev fallback function ***DO NOT OVERRIDE***
    */
    function () external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address _beneficiary) public payable {

        uint256 weiAmount = msg.value;
        require(weiAmount > MIN_DONATION);
        _preValidatePurchase(_beneficiary, weiAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        // update state
        weiRaised = weiRaised.add(weiAmount);

        //_processPurchase(_beneficiary, tokens);
        emit TokenPurchase(msg.sender, _beneficiary, weiAmount, tokens);

        createAccount(msg.sender, 1, msg.data);
        _forwardFunds();

        _postValidatePurchase(_beneficiary, weiAmount);
    }    
        
    function createAccount(address ownerAddress, uint256 karma, bytes data) public payable {
        require( ! AccountStruts[ownerAddress].isEntity, "Address exist already");
        
        AccountStruts[ownerAddress].isEntity = true;
        AccountStruts[ownerAddress].karma_rate = karma;
        AccountStruts[ownerAddress].data = data;
        
        accountList.push(ownerAddress);
        emit AccountCreated(ownerAddress, data, karma);
    }    
    
    function getAccount(address _beneficiary) public constant returns (bool isEntity, bytes data){
        require(_beneficiary != address(0), "Beneficiary wallet address is invalid");
        Account memory userInfo = AccountStruts[_beneficiary];
        return (userInfo.isEntity, userInfo.data );
    }
    
    function GetAccountCount() public constant returns (uint) {
        return accountList.length;
    }

  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal onlyWhileOpen {
    super._preValidatePurchase(_beneficiary, _weiAmount);
  }    
   
}