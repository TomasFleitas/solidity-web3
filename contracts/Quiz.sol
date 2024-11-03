// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.11;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Quiz {

    address private QUIZ_COIN_ADDRESS;
    address private _owner;
    uint256 private Q_length;
    QUIZ_COIN private coin;

    // Token parameters
    uint8 public SET_ADMIN_COST = 10;
    uint8 public ANSWER_QUESTION_PROFITS = 1;
    uint8 public ANSWER_QUESTION_LOSS = 1;
    uint8 public CHANGE_NAME_COST = 5;
    uint8 public CREATE_QUESTION_COST = 2;

    /**
    * eventType: "add_question_<id_question>"|"user_answer_<address>";
    */
    event EmittedEvent(string eventType);

    struct Question{
        uint256 id;
        string text;
        string image;
        uint256 lifetimeSeconds;
        string[] options;
        string correctAns;
        bool visible;
    }

    struct Survey {
        string title;
        string image;
        Question[]  question;
    }

    struct Answer{
       uint256 question_id;
       string anwser_id; 
       string correctAns;
    }

    struct UserCalification {
        address user;
        uint256 value;
    }


    Survey public survey;
    mapping(address => Answer[]) private _answer;
    mapping(address => string) private _user_name;
    address[] private _users;
    address[] private _admins;

    constructor(address _quiz_coin_address){
        QUIZ_COIN_ADDRESS = _quiz_coin_address;
        _owner = msg.sender;
        _admins.push(_owner);
        survey.title = "";
        survey.image = "https://48tools.com/wp-content/uploads/2015/09/shortlink.png";
        coin = QUIZ_COIN(QUIZ_COIN_ADDRESS);
    }

    modifier onlyAdmin{
        bool isAdmin = false;

         for (uint i = 0; i<_admins.length; i++){
             if(msg.sender == _admins[i]){
                 isAdmin = true;
                 break;
             }
         }

        require(isAdmin, "Solo admin autorizado");
        _;
    }

    modifier onlyOwner{
        require(msg.sender == _owner, "Solo duenio");
        _;
    }

    modifier notAllowed(address _admin){
        require(_admin != _owner, "Accion no permitida");
        _;
    }


    ///// OWNER FUNCTION /////

    // Set parameters
    function setVisibleQuestion(
        uint8 _SET_ADMIN_COST,
        uint8 _ANSWER_QUESTION_PROFITS,
        uint8 _ANSWER_QUESTION_LOSS,
        uint8 _CHANGE_NAME_COST,
        uint8 _CREATE_QUESTION_COST
        ) onlyOwner public{
        SET_ADMIN_COST = _SET_ADMIN_COST;
        ANSWER_QUESTION_PROFITS=  _ANSWER_QUESTION_PROFITS;
        ANSWER_QUESTION_LOSS = _ANSWER_QUESTION_LOSS;
        CHANGE_NAME_COST=  _CHANGE_NAME_COST;
        CREATE_QUESTION_COST=  _CREATE_QUESTION_COST;
    }

    function setVisibleQuestion(uint _id,bool _visible) onlyOwner public{
        require(_id< survey.question.length, "Id no valido");
        survey.question[_id].visible = _visible;
    }

    function deleteAdmin(address _admin) notAllowed(_admin) onlyOwner public{
        bool exist = false;
        uint index;
        for (uint i = 0; i<_admins.length; i++){
            if(_admins[i] == _admin){
             exist = true;
             index = i;
             break;
            }
        }
        if(exist){
           _admins[index] = _admins[_admins.length - 1];
           _admins.pop();
        }
        emit EmittedEvent(append("change_admin_",bytes20ToLiteralString(bytes20(msg.sender))));
    }

    function getAdmins() public onlyOwner view returns(address[] memory admins){
        return _admins;
    }

    ///// COMMONT FUNCTINOS ////

    function getAnswerByAccount(address _ad)  public view returns(Answer[] memory answers){
        return _answer[_ad];
    }

    function getQuestionById(uint256 _question_id) public view returns(string memory, string[] memory){
        return (survey.question[_question_id].text, survey.question[_question_id].options);
    }

    function getCoinAddress() public view returns(address QA){
        return QUIZ_COIN_ADDRESS;
    }

    function owner() public view returns(bool){
        return msg.sender == _owner;
    }

    function admin() public view returns(bool){
        if(msg.sender == _owner){
            return true;
        }
        for(uint i = 0; i<_admins.length; i++){
            if(_admins[i] == msg.sender){
                return true;
            }
        }
        return false;
    }

    function getUserNameByAccount(address _address) public view returns(string memory name){
        return _user_name[_address];
    }

    function getClasifications() public view returns(UserCalification[] memory cla){
        uint total = 0;
        Question[] storage options = survey.question;
        UserCalification[] memory userCalification = new UserCalification[](_users.length);
        string memory qst_id;
        string memory answer_id;
        for(uint j=0;j<_users.length; j++){
            for(uint k=0;k<_answer[_users[j]].length; k++){ 
               qst_id = options[_answer[_users[j]][k].question_id].correctAns;
               answer_id = _answer[_users[j]][k].anwser_id;
                 if(keccak256(abi.encodePacked(qst_id)) == keccak256(abi.encodePacked(answer_id))){
                     total++;
                 }
            }
            userCalification[j] = UserCalification(_users[j],total);
            total=0;
        }
        return userCalification;
    }

    function setAdmin() public{
       require(coin.balanceOf(msg.sender) >= SET_ADMIN_COST, "Need more QUIZ_COIN");
       bool isSetted = false;
        for(uint i=0;i<_admins.length;i++){
            if(_admins[i] == msg.sender){
                isSetted = true;
                break;
            }
        }
        if(!isSetted){
        _admins.push(msg.sender);
        }
        coin.transferFrom(msg.sender,address(this), SET_ADMIN_COST);
        emit EmittedEvent(append("change_admin_",bytes20ToLiteralString(bytes20(msg.sender))));
    }

    function removeAdmin() public{
        bool exist = false;
        uint index;
       for (uint i = 0; i<_admins.length; i++){
           if(_admins[i] == msg.sender){
            exist = true;
            index = i;
            break;
           }
        }
        if(exist){
           _admins[index] = _admins[_admins.length - 1];
           _admins.pop();
        }
        emit EmittedEvent(append("change_admin_",bytes20ToLiteralString(bytes20(msg.sender))));
    }

    ///// ADMIN FUNCTIONS ////

    function getAllQuestion() onlyAdmin public view returns(Question[] memory qsts){
        return survey.question;
    }
    
    function addQuestion(string memory text,string memory image,uint256 lifetimeSeconds , string[] memory opts, string memory correctAns) onlyAdmin public {   
        require((msg.sender != _owner && coin.balanceOf(msg.sender) >= CREATE_QUESTION_COST) || msg.sender == _owner, "Need more QUIZ_COIN");
        Question[] storage qst =  survey.question;
        string memory auxCorrectAns;
        string[] memory auxOpts = new string[](opts.length);
        for(uint i=0;i <opts.length;i++){
            if(compareToIgnoreCase(correctAns, opts[i])){
                auxCorrectAns = Strings.toString(i);
            }
            auxOpts[i] = append(append(Strings.toString(i),"_"),opts[i]);
        }
        qst.push(Question(Q_length,text,image,lifetimeSeconds,auxOpts,auxCorrectAns,msg.sender == _owner)); 
        if(msg.sender != _owner){
             coin.transferFrom(msg.sender,address(this),CREATE_QUESTION_COST);
        }
        emit EmittedEvent(append("add_question_",Strings.toString(Q_length)));
        Q_length++;
    }


    //// USER FUNCTIONS ////

    function answer(string memory _opts_id, uint256 _question_id) public {
      
        bool exist = false;
        for(uint256 i = 0; i < _users.length; i++){
            if(msg.sender ==  _users[i]){
                exist = true;
                break;
            }
        }

        if(!exist){
             _users.push(msg.sender);
        }

        _answer[msg.sender].push(Answer(_question_id,_opts_id,getCorrectAns(_question_id)));

        if(isCorrectAnswer(_opts_id,_question_id)){
            coin.transfer(msg.sender,ANSWER_QUESTION_PROFITS);
            emit EmittedEvent(append("user_answer_correct_",bytes20ToLiteralString(bytes20(msg.sender))));
        }else{
            if(ANSWER_QUESTION_LOSS > 0){
                coin.transferFrom(msg.sender, address(this),  (coin.balanceOf(msg.sender) >= ANSWER_QUESTION_LOSS ? ANSWER_QUESTION_LOSS : coin.balanceOf(msg.sender))); 
            }
            emit EmittedEvent(append("user_answer_wrong_",bytes20ToLiteralString(bytes20(msg.sender))));
        }
    }
    
    function getNextQuestion(uint256 nexId) public view returns(Question memory question){
        require(nexId < survey.question.length, "Id no valido");
        if(nexId != 0 && !isAnswered(nexId)){
            if(survey.question[nexId].visible){
                return survey.question[nexId];
            }
        }else {
            Question memory qst = getNotAnsweredQuestion();
            if(qst.visible){
                return qst;
            }
        }
    }

    function setUserName(string memory _name) public {
        require(coin.balanceOf(msg.sender) >= CHANGE_NAME_COST, "Need more QUIZ_COIN");
        _user_name[msg.sender] = _name;
         coin.transferFrom(msg.sender,address(this), SET_ADMIN_COST);
        emit EmittedEvent(append("user_name_change_",bytes20ToLiteralString(bytes20(msg.sender))));
    }

    function getAnsweredCount() public view returns(uint cnt){
        uint count = 0;
        for(uint i=0;i<survey.question.length;i++){
            for(uint j=0;j<_answer[msg.sender].length;j++){
                if(survey.question[i].visible && _answer[msg.sender][j].question_id == survey.question[i].id){
                    count++;
                    break;
                }
            }
        }
        return count;
    }

    function getQuestionNumber() public view returns(uint cnt){
        uint count = 0;
        for(uint i=0;i<survey.question.length;i++){
            if(survey.question[i].visible){
                count++;
            }
        }
        return count;
    }

    ///// Tools ////

    function getCorrectAns(uint256 _question_id) internal view returns (string memory correctAns){
        return survey.question[_question_id].correctAns;
    }

    function isCorrectAnswer(string memory _opts_id, uint256 _question_id) internal view returns (bool isCorrect){
        return keccak256(abi.encodePacked(survey.question[_question_id].correctAns)) == keccak256(abi.encodePacked(_opts_id));
    }

    function getNotAnsweredQuestion() internal view returns (Question memory qst){
        if(_answer[msg.sender].length == 0){
             return survey.question[0];
        }
        bool answered = false;
        for(uint i = 0; i < survey.question.length; i++){
             for(uint j = 0; j < _answer[msg.sender].length; j++){
                if(_answer[msg.sender][j].question_id == survey.question[i].id){
                    answered = true;
                    break;
                }
             }
             if(!answered){
                 return survey.question[i];
             }
             answered = false;
        }
    }

    function isAnswered(uint id) internal view returns (bool answered){
        for(uint j = 0; j < _answer[msg.sender].length; j++){
           if(_answer[msg.sender][j].question_id == id){
               return true;
           }
        }
        return false;
    }

     function bytes20ToLiteralString(bytes20 data) 
        private
        pure
        returns (string memory result)
    {
        bytes memory temp = new bytes(41);
        uint256 count;

        for (uint256 i = 0; i < 20; i++) {
            bytes1 currentByte = bytes1(data << (i * 8));
            
            uint8 c1 = uint8(
                bytes1((currentByte << 4) >> 4)
            );
            
            uint8 c2 = uint8(
                bytes1((currentByte >> 4))
            );
        
            if (c2 >= 0 && c2 <= 9) temp[++count] = bytes1(c2 + 48);
            else temp[++count] = bytes1(c2 + 87);
            
            if (c1 >= 0 && c1 <= 9) temp[++count] = bytes1(c1 + 48);
            else temp[++count] = bytes1(c1 + 87);
        }
        
        result = string(temp);
    }
    
    function append(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }


    function split(string memory _base, string memory _value)
        internal
        pure
        returns (string[] memory splitArr) {
        bytes memory _baseBytes = bytes(_base);

        uint _offset = 0;
        uint _splitsCount = 1;
        while (_offset < _baseBytes.length - 1) {
            int _limit = _indexOf(_base, _value, _offset);
            if (_limit == -1)
                break;
            else {
                _splitsCount++;
                _offset = uint(_limit) + 1;
            }
        }

        splitArr = new string[](_splitsCount);

        _offset = 0;
        _splitsCount = 0;
        while (_offset < _baseBytes.length - 1) {

            int _limit = _indexOf(_base, _value, _offset);
            if (_limit == - 1) {
                _limit = int(_baseBytes.length);
            }

            string memory _tmp = new string(uint(_limit) - _offset);
            bytes memory _tmpBytes = bytes(_tmp);

            uint j = 0;
            for (uint i = _offset; i < uint(_limit); i++) {
                _tmpBytes[j++] = _baseBytes[i];
            }
            _offset = uint(_limit) + 1;
            splitArr[_splitsCount++] = string(_tmpBytes);
        }
        return splitArr;
    }

    function _indexOf(string memory _base, string memory _value, uint _offset)
        internal
        pure
        returns (int) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length == 1);

        for (uint i = _offset; i < _baseBytes.length; i++) {
            if (_baseBytes[i] == _valueBytes[0]) {
                return int(i);
            }
        }

        return -1;
    }

    function compareToIgnoreCase(string memory _base, string memory _value)
        internal
        pure
        returns (bool) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        if (_baseBytes.length != _valueBytes.length) {
            return false;
        }

        for (uint i = 0; i < _baseBytes.length; i++) {
            if (_baseBytes[i] != _valueBytes[i] &&
            _upper(_baseBytes[i]) != _upper(_valueBytes[i])) {
                return false;
            }
        }

        return true;
    }

     function _upper(bytes1 _b1)
        private
        pure
        returns (bytes1) {

        if (_b1 >= 0x61 && _b1 <= 0x7A) {
            return bytes1(uint8(_b1) - 32);
        }

        return _b1;
    }
}

abstract contract QUIZ_COIN is IERC20  {}


