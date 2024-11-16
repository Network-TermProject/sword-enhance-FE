import instruction from '.././assets/instruction.png';
import card from '.././assets/card.png';
import trophy from '.././assets/trophy.png';
import sword from '.././assets/sword.png';
import x from '.././assets/x.png';
import rank1 from '.././assets/rank1.png';
import rank2 from '.././assets/rank2.png';
import rank3 from '.././assets/rank3.png';
import fire_red from '.././assets/fire_red.png';
import fire_blue from '.././assets/fire_blue.png';
import login from '.././assets/login.png';
import tears from '.././assets/tears.png';
import diamond from '.././assets/diamond.png';

export function getImage(imageName){
  switch(imageName){
    case 'instruction': return instruction;
    case 'card': return card;
    case 'trophy': return trophy;
    case 'sword': return sword;
    case 'x': return x;
    case 'rank1': return rank1;
    case 'rank2': return rank2;
    case 'rank3': return rank3;
    case 'fire_red': return fire_red;
    case 'fire_blue': return fire_blue;
    case 'login': return login;
    case 'tears': return tears;
    case 'diamond': return diamond;
    default: return null;
  }
}