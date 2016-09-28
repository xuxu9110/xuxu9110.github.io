width = 3;
height = 3;
cells = [];

describe('initCells', function(){
	it('should be a function',function() {
		assert.isFunction(initCells);
	});
	it('should get a matrix full of zero',function() {
		initCells();
		var m = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
		assert.strictEqual(cells.toString(), m.toString());
	});
});

describe('copyCells', function(){
	it('should be a function',function() {
		assert.isFunction(copyCells);
	});
	it('should have two arguments',function() {
		assert.strictEqual(copyCells.length, 2);
	});
	it('should copy des matrix from src matrix correct',function() {
		cells = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
		var b = [[0,0,0,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,1,0,1,0],[0,0,0,0,0]];
		copyCells(cells, b);
		assert.strictEqual(cells.toString(), b.toString());
	});
});

describe('sumNeighbour', function(){
	it('should be a function',function() {
		assert.isFunction(sumNeighbour);
	});
	it('should sum the Neighbour correct',function() {
		cells = [[0,0,0,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,1,0,1,0],[0,0,0,0,0]];
		assert.strictEqual(sumNeighbour(2,2), 4);
	});
});

describe('growCells', function(){
	it('should be a function',function() {
		assert.isFunction(growCells);
	});
	it('should grow the cells correct',function() {
		cells = [[0,0,0,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,1,0,1,0],[0,0,0,0,0]];
		growCells();
		var cellsAfter = [[0,0,0,0,0],[0,1,1,0,0],[0,0,0,1,0],[0,0,1,0,0],[0,0,0,0,0]];
		assert.strictEqual(cells.toString(), cellsAfter.toString());
	});
});