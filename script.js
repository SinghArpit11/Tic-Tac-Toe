/* due to presence of script tag in head  we need to add the eventListner tag in the window to process the script before any html tag to be processed  */
window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    // Array.from will convert the all the tile class in the form of an array.bcoz by the help of document.querySelectorAll('.tile') will create the node list. so 
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
 /* alag jagah se alag -alag dom refrences  alag-alag variable me save kr lo  */

  /*Next we will add the global variable needed to control the game we will initialize a board with 9 empty strings. This saves the X abd O value for each block on the board. We will have a currentPlayer that holds the flag of active players in the current turn. The isGameActive variable will remain true until someone wins or the game ends in a draw. In these cases, we set it to false so that the remaining tiles are inactive before reset. We have three constants representing the end state of the game. We use these constants to avoid spelling mistakes.  */
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    
  // the end game state is called ==> type 
    // this 3 variable will be provide the end game result
    const PLAYERX_WON = 'PLAYERX_WON';
    // if the player "X" won
    const PLAYERO_WON = 'PLAYERO_WON';
    // if the player "O" won
    const TIE = 'TIE';
    // if the game will be tied.


   /* In the next step, we will store all winning positions on the chessboard. In each subarray, we will store the indexes of the three positions that can win the game. So this [0, 1, 2] will represent the situation where the first horizontal line is occupied by the player. We will use this array to determine whether we have a winner. */

    /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    // these are the winning condition possible  for any player to win the game .

   
    /* Here we will do  outcome evaluation. Sabse pehle roundWon variable and initialize it to false. Then hm traverse karenge winConditions array ko aor check for each winning condition on the board. For example, in the second iteration, we will check these values: board 3,board4,board5.there are 8 winning conditions.

We will also do some optimization. If any field is empty, we will call continue and jump to the next iteration, because if there are empty tiles in the winning condition, you will not win. If all fields are equal, we have a winner, so we set roundWon to true and break the for loop, because any further iteration will waste calculation.

After the loop, we will check the value of the roundWon variable. If it is true, we will announce the winner and set the game inactive. If we have no winner, we will check whether there are empty cards on the chessboard. If we have no winner and no empty cards, we will declare a draw  */


    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

    if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

    if (!board.includes(''))
        announce(TIE);
    }


    /* isme hamara 3 expected result ho skta h to announce funnction usse announce kr deta h jaise ki X jeeta ya fir O jeeta Ya fir Match tie rha . to ye announcer  variable jo hamne bnaya h usme change kr denge . jaise ki pta h ki const will be changes its value by changing it through function aor announcer k saath me ek class "hide " add  h html me  jisse hm remove hi kr denge qki uss class k through hmane display us particular section ki 'none' kr rakhi h  */

    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    /* agar pahle se hi tile pr X  or  O hai to wo invalid action hoga. */
    /* Now we will write some practical functions. In the isValidAction function, we will decide whether the user wants to perform a valid action. If the inner text of the tile is XorO, we return false as the operation is invalid, otherwise the tile is empty, so the operation is valid. */


    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };


  /* isme hm board ko update kr dete h jaise hi hme index milta h taaki wo tile uss player k naam se reserve ho jae reset karne se pahle tk wo waise hi rahegi.
     The next utility function will be very simple. In this function, we will receive an index as a parameter and set the corresponding element in the chessboard array as the symbol of our current player.  */

    const updateBoard =  (index) => {
        board[index] = currentPlayer;
    }

   /* yha pr hm jb ek player apna move chl le tb uske baad kaise dusare player ko call karenge . ye function ki pehli line me h jisme hm current player le kr usse remove krna chahte h . second line me hm ternary operator k through naya current player wo hoga agar abhi wala X  h to naya wala O hoga and vice-versa . ab iske baad hm usse update bhi kr denge . */
     /*We will write a small function to handle player changes. In this function, we will first from the playerDisplay. String template text, player${currentPlayer} will become playerX or playerO, depending on the current player. Next, we will use a ternary expression to change the value of the current player. If it is x, it will be O, otherwise it will be X. Now that we have changed the value of our users, we need to update innerText's playerDisplay and apply the new player class. */

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

   /* yha pr hm userAction function create kr rahe h taki jb bhi hm kisi bhi tile pr jae to ye sare action ho sake .
    userAction basically argument lega tile and index pehle check kareg ki  jis bhi tile pr hm jaana chahte h wo hmara valid h wha jaana ki nahi by using the isValidAction me uss tile ko pass kr k aor saath hi saath kya game chl bhi rha h ki game finsh ho chuka h . ab in dono k baad us tile k andar uss current player ko add kr dega .
    uske baad updateBoard(index) k help se board ko update karega fir result validation check karega agr result nahi aaya to dusre player ko bula dega. */
    const userAction = (tile, index) => {
        if(isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }
    
    /* yha pr reset button k press karne se hm hme ye function execute krna padega .
     isme hm pura game fir se start krna h so fir se ek board variable me 9 empty screen array banega fir game ko active mode me daal  denge bcoz after the completition it will be in inactive mode . aor fir announcer me hm 'hide ' class ko add kr denge  qki after the previous game ye hata diya gya tha by the announce function k. and by default player hamara 'X' hoona chahie to agar plater "O " h to bhi change kr k "X " kr do . and lastly we will update every tile with empty string and we will remove 'playerX' or 'playerO' from the tile to make it clear to use further. */
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    tiles.forEach( (tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });
    // by this we will add the eventlistner to each tiles element of it . Here tiles is an array which consist of the all the div with class tile .
    resetButton.addEventListener('click', resetBoard);
});