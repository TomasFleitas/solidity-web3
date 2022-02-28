// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.11;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Quiz {

    address private QUIZ_COIN_ADDRESS = 0xd9145CCE52D386f254917e481eB44e9943F39138;
    address private _owner;
    uint256 private Q_length;

    /**
    * eventType: "add_question_<id_question>"|"user_answer_<address>";
    */
    event EmittedEvent(string eventType);

    struct Question{
        uint id;
        string text;
        string image;
        uint lifetimeSeconds;
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
       uint question_id;
       string anwser_id; 
    }

    struct UserCalification {
        address user;
        uint256 value;
    }


    Survey public survey;
    mapping(address => Answer[]) private _answer;
    mapping(address => string) private _user_name;
    address[] private _users;
    mapping(address => uint256) private _lastQuestion;
    address[] private _admins;

    constructor(){
         _owner = msg.sender;
         _admins.push(_owner);
         survey.title = "Sample Survey";
         survey.image = "https://48tools.com/wp-content/uploads/2015/09/shortlink.png";
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

    function setVsibileQuestion(uint _id,bool _visible) onlyOwner public returns(bool){
        require(_id< survey.question.length, "Id no valido");
        survey.question[_id].visible = _visible;
        return true;
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

    function getUserName() public view returns(string memory name){
        return _user_name[msg.sender];
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
    
    function addQuestion(string memory text,string memory image,uint lifetimeSeconds , string[] memory opts, string memory correctAns) onlyAdmin public {   
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
        emit EmittedEvent(append("add_question_",Strings.toString(Q_length)));
        Q_length++;
    }

    function getAnswerByAccount(address _address) onlyAdmin public view returns(Answer[] memory answers){
        return _answer[_address];
    }

    //// USER FUNCTIONS ////

    function getMyAnswers() public view returns(Answer[] memory answers){
        return _answer[msg.sender];
    }

    function answer(string memory _opts_id, uint _question_id) public {
      
        bool exist = false;
        for(uint i = 0; i < _users.length; i++){
            if(msg.sender ==  _users[i]){
                exist = true;
                break;
            }
        }

        if(!exist){
             _users.push(msg.sender);
        }

        _answer[msg.sender].push(Answer(_question_id,_opts_id));

        /* QUIZ_COIN coin = QUIZ_COIN(QUIZ_COIN_ADDRESS);
        coin.transfer(msg.sender,1); */
        
        emit EmittedEvent(append("user_answer_",bytes20ToLiteralString(bytes20(msg.sender))));
    }
    
    function getNextQuestion(uint nexId) public view returns(Question memory question){
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
        _user_name[msg.sender] = _name;
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


