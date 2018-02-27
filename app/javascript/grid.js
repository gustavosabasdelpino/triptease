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


  blockClicked(e, block) {

  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
