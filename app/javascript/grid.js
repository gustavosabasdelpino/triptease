export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y, colour, blockGrid) {
    this.x = x;
    this.y = y;
    this.selected=false;
    if (colour === undefined)
    {
      this.colour= COLOURS[Math.floor(Math.random() * COLOURS.length)]
    }
    else
    {
      this.colour = colour;
    }
    if (blockGrid!== undefined)
    {
      this.DetermineNeighBors(blockGrid);
    }
    
  }
  
Select()
{
  let listOfBottonElementsToPush= [];
  this.SelectAux(listOfBottonElementsToPush);
  return listOfBottonElementsToPush;
}

  SelectAux(listOfBottonElementsToPush)
  {
    this.selected= true;
    let neighborsToSelect=this.NeighborsSameColor();
    if (this.IsBottonOfNeighborhood())
    {
      listOfBottonElementsToPush.push(this);
    }
    neighborsToSelect.forEach(block => {
      block.SelectAux(listOfBottonElementsToPush);
    });
  }

 Dissapear()
 {
  if (this.BlockAtLeft !== null)
  {
    this.BlockAtLeft.BlockAtRight= null;
  }
  if (this.BlockAtRight !== null)
  {
    this.BlockAtRight.BlockAtLeft= null;
  }
  if (this.BlockAtTop !== null)
  {
    this.BlockAtTop.BlockAtBottom= null;
  }
  if (this.BlockAtBottom !== null)
  {
    this.BlockAtBottom.BlockAtTop= null;
  }
 }

  DetermineNeighBors(blockGrid)
  {
    this.BlockAtLeft= blockGrid.GetBlockAt(this.x-1,this.y);
    if (this.BlockAtLeft !== null)
    {
      this.BlockAtLeft.BlockAtRight= this;
    }
    this.BlockAtRight= blockGrid.GetBlockAt(this.x+1,this.y);
    if (this.BlockAtRight !== null)
    {
      this.BlockAtRight.BlockAtLeft= this;
    }
    this.BlockAtTop= blockGrid.GetBlockAt(this.x,this.y+1);
    if (this.BlockAtTop !== null)
    {
      this.BlockAtTop.BlockAtBottom= this;
    }
    this.BlockAtBottom= blockGrid.GetBlockAt(this.x,this.y-1);
    if (this.BlockAtBottom !== null)
    {
      this.BlockAtBottom.BlockAtTop= this;
    }
  }

  HasNeighborOnTop()
  {
    if (this.BlockAtTop== null || this.colour!== this.BlockAtTop.colour)
    {
      return false;
    }
    return true;
  }

  IsBottonOfNeighborhood()
  {
    if (this.BlockAtBottom === null || this.colour!== this.BlockAtBottom.colour)
    {
      return true;
    }
    return false;
  }

  ChangeColor(newColor, blockGrid)
  {
    this.colour= newColor;
    this.selected= false;
    this.DetermineNeighBors(blockGrid);
  }

  NeighborsSameColor()
  {
    let listOfNeighborsSameColor=[];
    this.AddNeighborToListIfNotNullAndSameColor(this.BlockAtLeft,listOfNeighborsSameColor);
    this.AddNeighborToListIfNotNullAndSameColor(this.BlockAtRight,listOfNeighborsSameColor);
    this.AddNeighborToListIfNotNullAndSameColor(this.BlockAtTop,listOfNeighborsSameColor);
    this.AddNeighborToListIfNotNullAndSameColor(this.BlockAtBottom,listOfNeighborsSameColor);
    return listOfNeighborsSameColor;
  }

  AddNeighborToListIfNotNullAndSameColor(block,list)
  {
    if (block !== null && block.colour=== this.colour && block.selected===false )
    {
       list.push(block);
    }
  }
}

export class BlockGrid {
  constructor(rows) {
    if (rows === undefined)
    {
      this.SetRandomGrid();
    }
    else
    {
      
      this.SetGridFromRows(rows);
    }
    return this;
  }

  SetGridFromRows(rows)
  {
    this.grid = [];
    for (let x = 0; x < rows.length; x++) {
      let col = [];
      this.grid.push(col);
      for (let y = 1; y < rows[x].length; y++) {
        let blockX= rows[x][0], 
        blockY= rows[x][y][0],
        blockColour= rows[x][y][1];
        col.push(new Block(blockX,blockY,blockColour,this));
      }
    }
  }

  SetRandomGrid()
  {
    this.grid = [];
    for (let x = 0; x < MAX_X; x++) {
      let col = [];
      this.grid.push(col);
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y,COLOURS[Math.floor(Math.random() * COLOURS.length)],this));
      }
    }
  }

  GetBlockAt(x,y)
  {
    if (x< 0 || y<0 || x>=this.grid.length || y>=this.grid[x].length )
    {
      return null;
    }
    return this.grid[x][y];
  }


  render(el = document.querySelector('#gridEl')) {
    for (let x = 0; x < this.grid.length; x++) {
      let id = 'col_' + x;
      let colEl = document.createElement('div');
      colEl
      colEl.className = 'col';
      colEl.id = id;
      if (el.childNodes[colEl] === undefined)
      {
        el.appendChild(colEl);
      }
      for (let y = this.grid[x].length - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        if (block === null)
        {
          blockEl.style.background = 'gray';
        }
        else
        {
          blockEl.style.background = block.colour;
        }
        blockEl.removeEventListener('click', evt => this.blockClicked(evt, block)); 
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        if (colEl.childNodes[blockEl]=== undefined)
        {
          colEl.appendChild(blockEl);
        }
        
      }
    }

    return this;
  }


  rerender(el = document.querySelector('#gridEl')) {
    if (el !== undefined && el!== null)
    {
      while (el.children.length>0)
      {
        el.removeChild(el.children[0]);
      }
      this.render(el);
    }
    
  }

  PullDown(listOfBottonElementsToPush)
  {
    for (let i = 0; i < listOfBottonElementsToPush.length; i++) 
    {
      let height= 1, current = listOfBottonElementsToPush[i];
      while (current.HasNeighborOnTop())
      {
        height++;
        current= current.BlockAtTop;
      }
      for (let blockY = listOfBottonElementsToPush[i].y; blockY <this.grid[0].length; blockY++) 
      {
          let blockToReplace= this.GetBlockAt(listOfBottonElementsToPush[i].x,blockY)
          if (blockToReplace !== null)
          {
            let blockToReplaceWith = this.GetBlockAt(listOfBottonElementsToPush[i].x,blockY + height);
            this.Replace(blockToReplace, blockToReplaceWith)
          }
      }

    } 
  }

  Replace(block1, block2)
  {
    let oldBlock= this.grid[block1.x][block1.y]
    if (block2 === null)
    {
      if (oldBlock !==null)
      {
        oldBlock.Dissapear();
      }
      this.grid[block1.x][block1.y] = block2;  
    }
    else
    {
      this.grid[block1.x][block1.y].ChangeColor(block2.colour,this);
    }
  }

  blockClicked(e, block) {
    let listOfBottonElementsToPush=  this.grid[block.x][block.y].Select();
    this.PullDown(listOfBottonElementsToPush);
    this.rerender();
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
