import { Block, COLOURS, BlockGrid } from './grid';
import { assert } from 'chai';

describe('Block', () => {
  it('should be created with correct coordinates and one of the valid colours', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });
});


describe('BlockGrid', () => {
  it('can be created on demand', () => {
    let rows =[
      [0,[1,'red'], [0,'red']]
    ];
    let blocksGrid= new BlockGrid(rows);
    assert.equal (blocksGrid.GetBlockAt(0,0).colour,'red');  
  });
});

describe('BlockGrid', () => {
  it('can play', () => {
    let rows =[
      [0,[0,'green'], [1,'red']],
      [1,[0,'red'], [1,'red']]
    ];
    let blocksGrid= new BlockGrid(rows);
    blocksGrid.blockClicked(undefined,new Block(1,1))
    assert.equal (blocksGrid.GetBlockAt(0,0).colour,'green');  
    assert.equal (blocksGrid.GetBlockAt(110),null);  
  });
});

describe('BlockGrid', () => {
  it('can play with more than one block selected in the same column', () => {
    let rows =[
      [0,[0,'green'], [1,'green'],[2,'green'], [3,'green']],
      [1,[0,'red'], [1,'red'],[2,'red'], [3,'green']],
      [2,[0,'red'], [1,'green'],[2,'red'], [3,'green']],
      [3,[0,'green'], [1,'green'],[2,'green'], [3,'green']],
    ];
    let blocksGrid= new BlockGrid(rows);
    blocksGrid.blockClicked(undefined,new Block(1,1))
    assert.equal (blocksGrid.GetBlockAt(1,0).colour,'green');
    assert.equal (blocksGrid.GetBlockAt(2,0).colour,'green');
    assert.equal (blocksGrid.GetBlockAt(1,1),null);  
    assert.equal (blocksGrid.GetBlockAt(2,1).colour,'green');
  });
});

