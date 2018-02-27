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
      [0,[1,'green'], [0,'red']],
      [1,[1,'red'], [0,'red']]
    ];
    let blocksGrid= new BlockGrid(rows);
    blocksGrid.blockClicked(undefined,new Block(1,1))
    assert.equal (blocksGrid.GetBlockAt(0,0).colour,'green');  
    assert.equal (blocksGrid.GetBlockAt(110),null);  
  });
});
